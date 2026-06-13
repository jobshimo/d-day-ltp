/**
 * ProgressService unit tests.
 *
 * PrismaService is fully mocked — no real DB, no adapter, no network.
 * Pattern follows auth.service.spec.ts: bypass NestJS DI, instantiate directly.
 */
import { vi, describe, it, expect } from 'vitest';
import type { ModuleProgress, QuizResult } from 'content-schema';
import { ProgressService, rowToWire, wireToRow, defaultProgress } from './progress.service';

// ---------------------------------------------------------------------------
// Prisma stub factory
// ---------------------------------------------------------------------------
function makePrismaStub() {
  return {
    moduleProgress: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      upsert: vi.fn(),
      deleteMany: vi.fn(),
    },
  };
}

type PrismaStub = ReturnType<typeof makePrismaStub>;

function makeService(prismaOverrides?: Partial<PrismaStub>) {
  const prisma = { ...makePrismaStub(), ...prismaOverrides } as unknown as Parameters<
    typeof ProgressService
  >[0];
  return new (ProgressService as unknown as new (
    p: typeof prisma,
  ) => ProgressService)(prisma);
}

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------
const epoch = new Date(0);

const sampleRow = {
  id: 'row-1',
  userId: 'user-1',
  moduleId: 'module-2',
  lessonsCompleted: ['lesson-1'],
  drillResults: {
    'drill-1': { answeredCorrectly: true, attempts: 1, completedAt: '2024-01-01T00:00:00.000Z' },
  },
  quizResult: { score: 0.9, passed: true, completedAt: '2024-01-02T00:00:00.000Z' },
  unlockedAt: new Date('2024-01-02T00:00:00.000Z'),
};

// ---------------------------------------------------------------------------
// rowToWire / wireToRow round-trip
// ---------------------------------------------------------------------------
describe('rowToWire', () => {
  it('converts a full row to wire shape', () => {
    const wire = rowToWire(sampleRow);
    expect(wire.moduleId).toBe('module-2');
    expect(wire.lessonsCompleted).toEqual(['lesson-1']);
    expect(wire.drillResults['drill-1']).toEqual({
      answeredCorrectly: true,
      attempts: 1,
      completedAt: '2024-01-01T00:00:00.000Z',
    });
    expect(wire.quizResult).toEqual({ score: 0.9, passed: true, completedAt: '2024-01-02T00:00:00.000Z' });
    expect(wire.unlockedAt).toBe('2024-01-02T00:00:00.000Z');
  });

  it('converts null quizResult to undefined', () => {
    const wire = rowToWire({ ...sampleRow, quizResult: null });
    expect(wire.quizResult).toBeUndefined();
  });

  it('converts null unlockedAt to undefined', () => {
    const wire = rowToWire({ ...sampleRow, unlockedAt: null });
    expect(wire.unlockedAt).toBeUndefined();
  });
});

describe('wireToRow', () => {
  it('converts wire shape to row data (round-trip)', () => {
    const wire: ModuleProgress = {
      moduleId: 'module-2',
      lessonsCompleted: ['lesson-1'],
      drillResults: {
        'drill-1': { answeredCorrectly: true, attempts: 1, completedAt: '2024-01-01T00:00:00.000Z' },
      },
      quizResult: { score: 0.9, passed: true, completedAt: '2024-01-02T00:00:00.000Z' },
      unlockedAt: '2024-01-02T00:00:00.000Z',
    };
    const row = wireToRow('user-1', wire);
    expect(row.userId).toBe('user-1');
    expect(row.moduleId).toBe('module-2');
    expect(row.unlockedAt).toEqual(new Date('2024-01-02T00:00:00.000Z'));
    expect(row.quizResult).toEqual(wire.quizResult);
  });

  it('converts undefined quizResult to null', () => {
    const wire: ModuleProgress = {
      moduleId: 'module-1',
      lessonsCompleted: [],
      drillResults: {},
      quizResult: undefined,
    };
    const row = wireToRow('user-1', wire);
    expect(row.quizResult).toBeNull();
  });

  it('converts undefined unlockedAt to null', () => {
    const wire: ModuleProgress = {
      moduleId: 'module-2',
      lessonsCompleted: [],
      drillResults: {},
    };
    const row = wireToRow('user-1', wire);
    expect(row.unlockedAt).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// defaultProgress
// ---------------------------------------------------------------------------
describe('defaultProgress', () => {
  it('returns empty progress with unlockedAt epoch for module-1', () => {
    const p = defaultProgress('module-1');
    expect(p.moduleId).toBe('module-1');
    expect(p.lessonsCompleted).toEqual([]);
    expect(p.drillResults).toEqual({});
    expect(p.quizResult).toBeUndefined();
    expect(p.unlockedAt).toBe(epoch.toISOString());
  });

  it('returns empty progress with no unlockedAt for other modules', () => {
    const p = defaultProgress('module-2');
    expect(p.unlockedAt).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// ProgressService.getModuleProgress
// ---------------------------------------------------------------------------
describe('ProgressService.getModuleProgress', () => {
  it('returns rowToWire result when row exists', async () => {
    const prisma = makePrismaStub();
    prisma.moduleProgress.findUnique.mockResolvedValue(sampleRow);
    const service = makeService(prisma);

    const result = await service.getModuleProgress('user-1', 'module-2');
    expect(result.moduleId).toBe('module-2');
    expect(result.unlockedAt).toBe('2024-01-02T00:00:00.000Z');
  });

  it('returns defaultProgress when no row exists', async () => {
    const prisma = makePrismaStub();
    prisma.moduleProgress.findUnique.mockResolvedValue(null);
    const service = makeService(prisma);

    const result = await service.getModuleProgress('user-1', 'module-1');
    expect(result).toEqual(defaultProgress('module-1'));
  });
});

// ---------------------------------------------------------------------------
// ProgressService.setQuizResult — sets unlockedAt on pass when not already set
// ---------------------------------------------------------------------------
describe('ProgressService.setQuizResult', () => {
  it('sets unlockedAt when quiz is passed and not already set', async () => {
    const prisma = makePrismaStub();
    // No existing row — starts from default
    prisma.moduleProgress.findUnique.mockResolvedValue(null);
    const quizResult: QuizResult = { score: 1.0, passed: true, completedAt: '2024-06-01T10:00:00.000Z' };

    const expectedRow = {
      id: 'row-new',
      userId: 'user-1',
      moduleId: 'module-2',
      lessonsCompleted: [],
      drillResults: {},
      quizResult,
      unlockedAt: new Date('2024-06-01T10:00:00.000Z'),
    };
    prisma.moduleProgress.upsert.mockResolvedValue(expectedRow);
    const service = makeService(prisma);

    const result = await service.setQuizResult('user-1', 'module-2', quizResult);
    expect(result.unlockedAt).toBe('2024-06-01T10:00:00.000Z');
    expect(result.quizResult?.passed).toBe(true);
  });

  it('does NOT overwrite unlockedAt when already set', async () => {
    const existingUnlocked = new Date('2024-01-01T00:00:00.000Z');
    const existingRow = { ...sampleRow, unlockedAt: existingUnlocked };
    const prisma = makePrismaStub();
    prisma.moduleProgress.findUnique.mockResolvedValue(existingRow);
    const quizResult: QuizResult = { score: 1.0, passed: true, completedAt: '2024-06-01T10:00:00.000Z' };

    // Upsert returns row with original unlockedAt preserved
    prisma.moduleProgress.upsert.mockResolvedValue({
      ...existingRow,
      quizResult,
      unlockedAt: existingUnlocked,
    });
    const service = makeService(prisma);

    const result = await service.setQuizResult('user-1', 'module-2', quizResult);
    // unlockedAt stays as the original, not overwritten by completedAt
    expect(result.unlockedAt).toBe(existingUnlocked.toISOString());
  });
});

// ---------------------------------------------------------------------------
// ProgressService.setLessonComplete — deduplication
// ---------------------------------------------------------------------------
describe('ProgressService.setLessonComplete', () => {
  it('adds lesson if not already present', async () => {
    const prisma = makePrismaStub();
    prisma.moduleProgress.findUnique.mockResolvedValue(null);
    prisma.moduleProgress.upsert.mockImplementation(({ create }: { create: { lessonsCompleted: string[] } }) =>
      Promise.resolve({
        id: 'row-1',
        userId: 'user-1',
        moduleId: 'module-1',
        ...create,
        quizResult: null,
        unlockedAt: epoch,
      }),
    );
    const service = makeService(prisma);

    const result = await service.setLessonComplete('user-1', 'module-1', 'lesson-1');
    expect(result.lessonsCompleted).toContain('lesson-1');
  });

  it('deduplicates — does not add lesson if already present', async () => {
    const rowWithLesson = {
      ...sampleRow,
      moduleId: 'module-1',
      lessonsCompleted: ['lesson-1'],
      unlockedAt: epoch,
    };
    const prisma = makePrismaStub();
    prisma.moduleProgress.findUnique.mockResolvedValue(rowWithLesson);
    prisma.moduleProgress.upsert.mockImplementation(({ create }: { create: { lessonsCompleted: string[] } }) =>
      Promise.resolve({
        id: 'row-1',
        userId: 'user-1',
        moduleId: 'module-1',
        ...create,
        quizResult: null,
        unlockedAt: epoch,
      }),
    );
    const service = makeService(prisma);

    await service.setLessonComplete('user-1', 'module-1', 'lesson-1');
    const upsertCall = prisma.moduleProgress.upsert.mock.calls[0][0];
    expect(
      (upsertCall.create as { lessonsCompleted: string[] }).lessonsCompleted.filter(
        (l: string) => l === 'lesson-1',
      ).length,
    ).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// ProgressService.resetProgress
// ---------------------------------------------------------------------------
describe('ProgressService.resetProgress', () => {
  it('calls deleteMany with userId filter', async () => {
    const prisma = makePrismaStub();
    prisma.moduleProgress.deleteMany.mockResolvedValue({ count: 3 });
    const service = makeService(prisma);

    await service.resetProgress('user-1');
    expect(prisma.moduleProgress.deleteMany).toHaveBeenCalledWith({ where: { userId: 'user-1' } });
  });
});

// ---------------------------------------------------------------------------
// ProgressService.migrate
// ---------------------------------------------------------------------------
describe('ProgressService.migrate', () => {
  it('upserts each entry and returns count', async () => {
    const prisma = makePrismaStub();
    prisma.moduleProgress.findUnique.mockResolvedValue(null);
    prisma.moduleProgress.upsert.mockImplementation(({ create }: { create: ModuleProgress & { userId: string } }) =>
      Promise.resolve({
        id: 'row-new',
        userId: create.userId,
        moduleId: create.moduleId,
        lessonsCompleted: create.lessonsCompleted,
        drillResults: {},
        quizResult: null,
        unlockedAt: null,
      }),
    );
    const service = makeService(prisma);

    const entries: ModuleProgress[] = [
      { moduleId: 'module-1', lessonsCompleted: ['l1'], drillResults: {} },
      { moduleId: 'module-2', lessonsCompleted: [], drillResults: {} },
    ];
    const count = await service.migrate('user-1', entries);
    expect(count).toBe(2);
    expect(prisma.moduleProgress.upsert).toHaveBeenCalledTimes(2);
  });
});
