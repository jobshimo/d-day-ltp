/**
 * ProgressController unit tests.
 *
 * ProgressService is fully mocked. JwtAuthGuard presence is verified via
 * Reflect metadata (guard applied to the controller class). No NestJS DI container.
 * Pattern follows auth.service.spec.ts: direct instantiation, mocked deps.
 */
import { vi, describe, it, expect } from 'vitest';
import type { ModuleProgress } from 'content-schema';
import { ProgressController } from './progress.controller';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// ---------------------------------------------------------------------------
// Service stub factory
// ---------------------------------------------------------------------------
function makeServiceStub() {
  return {
    getAllModuleProgress: vi.fn(),
    getModuleProgress: vi.fn(),
    upsertModuleProgress: vi.fn(),
    resetProgress: vi.fn(),
    migrate: vi.fn(),
  };
}

type ServiceStub = ReturnType<typeof makeServiceStub>;

function makeController(serviceOverrides?: Partial<ServiceStub>) {
  const service = { ...makeServiceStub(), ...serviceOverrides } as unknown as Parameters<
    typeof ProgressController
  >[0];
  return new (ProgressController as unknown as new (s: typeof service) => ProgressController)(
    service,
  );
}

// ---------------------------------------------------------------------------
// Fake CurrentUser payload
// ---------------------------------------------------------------------------
const fakeUser = { userId: 'user-1', email: 'test@example.com' };

// ---------------------------------------------------------------------------
// Sample wire data
// ---------------------------------------------------------------------------
const sampleProgress: ModuleProgress = {
  moduleId: 'module-1',
  lessonsCompleted: ['lesson-1'],
  drillResults: {},
  quizResult: undefined,
  unlockedAt: new Date(0).toISOString(),
};

// ---------------------------------------------------------------------------
// Guard metadata check
// ---------------------------------------------------------------------------
describe('ProgressController — guard', () => {
  it('has JwtAuthGuard applied at the controller level', () => {
    // @UseGuards(JwtAuthGuard) sets GUARDS_METADATA on the controller class
    const guards: unknown[] = Reflect.getMetadata('__guards__', ProgressController) ?? [];
    expect(guards).toContain(JwtAuthGuard);
  });
});

// ---------------------------------------------------------------------------
// getAll
// ---------------------------------------------------------------------------
describe('ProgressController.getAll', () => {
  it('delegates to progressService.getAllModuleProgress with userId', async () => {
    const stub = makeServiceStub();
    stub.getAllModuleProgress.mockResolvedValue([sampleProgress]);
    const controller = makeController(stub);

    const result = await controller.getAll(fakeUser);

    expect(stub.getAllModuleProgress).toHaveBeenCalledWith('user-1');
    expect(result).toEqual([sampleProgress]);
  });
});

// ---------------------------------------------------------------------------
// getOne
// ---------------------------------------------------------------------------
describe('ProgressController.getOne', () => {
  it('delegates to progressService.getModuleProgress with userId and moduleId', async () => {
    const stub = makeServiceStub();
    stub.getModuleProgress.mockResolvedValue(sampleProgress);
    const controller = makeController(stub);

    const result = await controller.getOne(fakeUser, 'module-1');

    expect(stub.getModuleProgress).toHaveBeenCalledWith('user-1', 'module-1');
    expect(result).toEqual(sampleProgress);
  });
});

// ---------------------------------------------------------------------------
// upsert
// ---------------------------------------------------------------------------
describe('ProgressController.upsert', () => {
  it('uses moduleId from URL param (not body) and delegates to upsertModuleProgress', async () => {
    const stub = makeServiceStub();
    stub.upsertModuleProgress.mockResolvedValue(sampleProgress);
    const controller = makeController(stub);

    const dto = {
      moduleId: 'wrong-from-body', // should be ignored
      lessonsCompleted: ['lesson-1'],
      drillResults: {},
      quizResult: undefined,
      unlockedAt: new Date(0).toISOString(),
    };

    const result = await controller.upsert(fakeUser, 'module-1', dto as never);

    const calledWith = stub.upsertModuleProgress.mock.calls[0];
    expect(calledWith[0]).toBe('user-1');
    expect(calledWith[1].moduleId).toBe('module-1'); // URL moduleId wins
    expect(result).toEqual(sampleProgress);
  });
});

// ---------------------------------------------------------------------------
// reset
// ---------------------------------------------------------------------------
describe('ProgressController.reset', () => {
  it('calls progressService.resetProgress with userId and returns void', async () => {
    const stub = makeServiceStub();
    stub.resetProgress.mockResolvedValue(undefined);
    const controller = makeController(stub);

    const result = await controller.reset(fakeUser);

    expect(stub.resetProgress).toHaveBeenCalledWith('user-1');
    expect(result).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// migrate
// ---------------------------------------------------------------------------
describe('ProgressController.migrate', () => {
  it('delegates to progressService.migrate and returns { imported: count }', async () => {
    const stub = makeServiceStub();
    stub.migrate.mockResolvedValue(2);
    const controller = makeController(stub);

    const dto = { entries: [sampleProgress, { ...sampleProgress, moduleId: 'module-2' }] };
    const result = await controller.migrate(fakeUser, dto as never);

    expect(stub.migrate).toHaveBeenCalledWith('user-1', dto.entries);
    expect(result).toEqual({ imported: 2 });
  });
});
