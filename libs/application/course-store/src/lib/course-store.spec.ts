import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { CourseStore, COURSE_CONTENT, COURSE_PROGRESS_REPO } from './course-store';
import type { CourseModule } from 'content-schema';
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

function makeModule(id: string, order: number): CourseModule {
  return {
    id,
    order,
    titleEs: `Módulo ${order}`,
    descriptionEs: `Descripción del módulo ${order}`,
    lessons: [
      {
        id: `${id}-lesson-1`,
        moduleId: id,
        order: 1,
        titleEs: 'Lección 1',
        blocks: [],
      },
    ],
    drills: [],
    reviewQuiz: [],
    requiredPriorModuleId: order > 1 ? `module-${order - 1}` : undefined,
  };
}

describe('CourseStore', () => {
  let store: CourseStore;
  let progressRepo: ProgressRepository;

  beforeEach(() => {
    progressRepo = makeProgressRepo({
      isModuleUnlocked: vi.fn().mockImplementation((id: string) =>
        Promise.resolve(id === 'module-1'),
      ),
      getModuleProgress: vi.fn().mockImplementation((id: string) =>
        Promise.resolve({ ...EMPTY_PROGRESS, moduleId: id }),
      ),
    });

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        CourseStore,
        { provide: COURSE_CONTENT, useValue: [makeModule('module-1', 1), makeModule('module-2', 2)] },
        { provide: COURSE_PROGRESS_REPO, useValue: progressRepo },
      ],
    });

    store = TestBed.inject(CourseStore);
  });

  describe('initial state', () => {
    it('starts with empty module list', () => {
      expect(store.modules()).toEqual([]);
    });

    it('starts with no active module', () => {
      expect(store.activeModuleId()).toBeNull();
    });

    it('starts with loading false', () => {
      expect(store.loading()).toBe(false);
    });
  });

  describe('loadModules()', () => {
    it('populates the modules list from content', async () => {
      await store.loadModules();

      expect(store.modules()).toHaveLength(2);
    });

    it('marks module-1 as unlocked', async () => {
      await store.loadModules();

      const m1 = store.modules().find((m) => m.moduleId === 'module-1');
      expect(m1?.isUnlocked).toBe(true);
    });

    it('marks module-2 as unlocked (free navigation)', async () => {
      await store.loadModules();

      const m2 = store.modules().find((m) => m.moduleId === 'module-2');
      expect(m2?.isUnlocked).toBe(true);
    });

    it('isPreview is false for all modules under free navigation', async () => {
      await store.loadModules();

      for (const mod of store.modules()) {
        expect(mod.isPreview).toBe(false);
      }
    });

    it('computes zero completionPercent for a fresh module', async () => {
      await store.loadModules();

      const m1 = store.modules().find((m) => m.moduleId === 'module-1');
      expect(m1?.completionPercent).toBe(0);
    });

    it('sets loading to false after completion', async () => {
      await store.loadModules();
      expect(store.loading()).toBe(false);
    });

    it('unlocks module-2 once module-1 quiz is passed', async () => {
      // Regression: passing a module's quiz must unlock the next module. Unlock
      // is derived from the prior module's quiz score via the domain function.
      TestBed.resetTestingModule();
      const repo = makeProgressRepo({
        getModuleProgress: vi.fn().mockImplementation((id: string) =>
          Promise.resolve({
            ...EMPTY_PROGRESS,
            moduleId: id,
            quizResult:
              id === 'module-1'
                ? { score: 0.8, passed: true, completedAt: '2026-01-01T00:00:00.000Z' }
                : undefined,
          }),
        ),
      });
      TestBed.configureTestingModule({
        providers: [
          provideZonelessChangeDetection(),
          CourseStore,
          {
            provide: COURSE_CONTENT,
            useValue: [makeModule('module-1', 1), makeModule('module-2', 2)],
          },
          { provide: COURSE_PROGRESS_REPO, useValue: repo },
        ],
      });
      const s = TestBed.inject(CourseStore);

      await s.loadModules();

      const m2 = s.modules().find((m) => m.moduleId === 'module-2');
      expect(m2?.isUnlocked).toBe(true);
    });
  });

  describe('setActiveModule()', () => {
    it('updates activeModuleId', () => {
      store.setActiveModule('module-1');
      expect(store.activeModuleId()).toBe('module-1');
    });

    it('can set activeLessonId at the same time', () => {
      store.setActiveModule('module-1', 'lesson-1-1');
      expect(store.activeLessonId()).toBe('lesson-1-1');
    });
  });

  describe('setActiveLesson()', () => {
    it('updates activeLessonId without changing activeModuleId', () => {
      store.setActiveModule('module-1');
      store.setActiveLesson('lesson-1-2');

      expect(store.activeModuleId()).toBe('module-1');
      expect(store.activeLessonId()).toBe('lesson-1-2');
    });
  });
});
