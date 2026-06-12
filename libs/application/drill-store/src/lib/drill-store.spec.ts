import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { DrillStore, DRILL_PROGRESS_REPO } from './drill-store';
import type { DrillScenario } from 'content-schema';
import type { ModuleProgress, ProgressRepository } from 'domain-progress';

const EMPTY_PROGRESS: ModuleProgress = {
  moduleId: '',
  lessonsCompleted: [],
  drillResults: {},
  quizResult: undefined,
  unlockedAt: undefined,
};

function makeProgressRepo(overrides: Partial<ProgressRepository> = {}): ProgressRepository {
  return {
    getModuleProgress: vi.fn().mockResolvedValue({ ...EMPTY_PROGRESS }),
    setLessonComplete: vi.fn().mockResolvedValue(undefined),
    setDrillResult: vi.fn().mockResolvedValue(undefined),
    setQuizResult: vi.fn().mockResolvedValue(undefined),
    isModuleUnlocked: vi.fn().mockResolvedValue(false),
    resetProgress: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

function makeMultipleChoiceDrill(id: string): DrillScenario {
  return {
    id,
    moduleId: 'module-1',
    type: 'multiple-choice',
    questionEs: '¿Cuál es la respuesta?',
    choices: [
      { id: 'a', labelEs: 'Opción A', isCorrect: true },
      { id: 'b', labelEs: 'Opción B', isCorrect: false },
    ],
    correctAnswer: 'a',
    ruleRefs: [{ section: '6.3' }],
    explanationEs: 'La opción A es correcta porque las reglas así lo dicen.',
  };
}

describe('DrillStore', () => {
  let store: DrillStore;
  let progressRepo: ProgressRepository;

  beforeEach(() => {
    progressRepo = makeProgressRepo();

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        DrillStore,
        { provide: DRILL_PROGRESS_REPO, useValue: progressRepo },
      ],
    });

    store = TestBed.inject(DrillStore);
  });

  describe('initial state', () => {
    it('has no scenario loaded', () => {
      expect(store.scenario()).toBeNull();
    });

    it('has no result', () => {
      expect(store.lastResult()).toBeNull();
    });

    it('is not answered', () => {
      expect(store.answered()).toBe(false);
    });

    it('has 0 attempts', () => {
      expect(store.attempts()).toBe(0);
    });
  });

  describe('load()', () => {
    it('sets the scenario', () => {
      const drill = makeMultipleChoiceDrill('drill-1');
      store.load(drill, 'module-1');

      expect(store.scenario()).toBe(drill);
    });

    it('resets result and attempts when a new drill is loaded', async () => {
      const drill = makeMultipleChoiceDrill('drill-1');
      store.load(drill, 'module-1');

      await store.submit({ kind: 'choice', optionId: 'a' });
      expect(store.lastResult()).not.toBeNull();

      // Load a new drill — state resets
      store.load(makeMultipleChoiceDrill('drill-2'), 'module-1');
      expect(store.lastResult()).toBeNull();
      expect(store.attempts()).toBe(0);
    });
  });

  describe('submit() — correct answer', () => {
    beforeEach(() => {
      store.load(makeMultipleChoiceDrill('drill-1'), 'module-1');
    });

    it('sets lastResult with correct=true', async () => {
      await store.submit({ kind: 'choice', optionId: 'a' });
      expect(store.lastResult()?.correct).toBe(true);
    });

    it('persists the drill result to progress repository', async () => {
      await store.submit({ kind: 'choice', optionId: 'a' });
      expect(progressRepo.setDrillResult).toHaveBeenCalledWith(
        'module-1',
        'drill-1',
        expect.objectContaining({ answeredCorrectly: true }),
      );
    });

    it('increments attempts to 1', async () => {
      await store.submit({ kind: 'choice', optionId: 'a' });
      expect(store.attempts()).toBe(1);
    });
  });

  describe('submit() — incorrect answer', () => {
    beforeEach(() => {
      store.load(makeMultipleChoiceDrill('drill-1'), 'module-1');
    });

    it('sets lastResult with correct=false', async () => {
      await store.submit({ kind: 'choice', optionId: 'b' });
      expect(store.lastResult()?.correct).toBe(false);
    });

    it('does NOT persist result on first incorrect answer', async () => {
      await store.submit({ kind: 'choice', optionId: 'b' });
      expect(progressRepo.setDrillResult).not.toHaveBeenCalled();
    });

    it('reveals the answer after MAX_DRILL_ATTEMPTS incorrect attempts', async () => {
      for (let i = 0; i < 3; i++) {
        await store.submit({ kind: 'choice', optionId: 'b' });
      }
      expect(store.isRevealed()).toBe(true);
    });

    it('persists the result when revealed (after max attempts)', async () => {
      for (let i = 0; i < 3; i++) {
        await store.submit({ kind: 'choice', optionId: 'b' });
      }
      expect(progressRepo.setDrillResult).toHaveBeenCalledWith(
        'module-1',
        'drill-1',
        expect.objectContaining({ answeredCorrectly: false }),
      );
    });

    it('does not process more submissions after reveal', async () => {
      for (let i = 0; i < 3; i++) {
        await store.submit({ kind: 'choice', optionId: 'b' });
      }
      const attemptsBeforeExtra = store.attempts();
      await store.submit({ kind: 'choice', optionId: 'b' });
      expect(store.attempts()).toBe(attemptsBeforeExtra);
    });
  });

  describe('clear()', () => {
    it('resets store to initial state', async () => {
      store.load(makeMultipleChoiceDrill('drill-1'), 'module-1');
      await store.submit({ kind: 'choice', optionId: 'a' });

      store.clear();

      expect(store.scenario()).toBeNull();
      expect(store.lastResult()).toBeNull();
      expect(store.attempts()).toBe(0);
    });
  });
});
