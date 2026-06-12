import { describe, it, expect } from 'vitest';
import type { ModuleProgress, DrillResult, QuizResult } from 'content-schema';
import type { ProgressRepository } from './domain-progress';
import { PROGRESS_REPO_TOKEN_ID } from './domain-progress';

describe('ProgressRepository port', () => {
  it('PROGRESS_REPO_TOKEN_ID is a non-empty string', () => {
    expect(typeof PROGRESS_REPO_TOKEN_ID).toBe('string');
    expect(PROGRESS_REPO_TOKEN_ID.length).toBeGreaterThan(0);
  });

  it('accepts a class that structurally implements ProgressRepository', () => {
    const drillResult: DrillResult = {
      answeredCorrectly: true,
      attempts: 1,
      completedAt: new Date().toISOString(),
    };

    const quizResult: QuizResult = {
      score: 0.8,
      passed: true,
      completedAt: new Date().toISOString(),
    };

    const progress: ModuleProgress = {
      moduleId: 'module-1',
      lessonsCompleted: ['lesson-1-1'],
      drillResults: { 'drill-1-1': drillResult },
      quizResult,
      unlockedAt: new Date().toISOString(),
    };

    class InMemoryProgressRepository implements ProgressRepository {
      private data: Record<string, ModuleProgress> = {};

      async getModuleProgress(moduleId: string): Promise<ModuleProgress> {
        return (
          this.data[moduleId] ?? {
            moduleId,
            lessonsCompleted: [],
            drillResults: {},
          }
        );
      }

      async setLessonComplete(moduleId: string, lessonId: string): Promise<void> {
        const existing = await this.getModuleProgress(moduleId);
        if (!existing.lessonsCompleted.includes(lessonId)) {
          this.data[moduleId] = {
            ...existing,
            lessonsCompleted: [...existing.lessonsCompleted, lessonId],
          };
        }
      }

      async setDrillResult(
        moduleId: string,
        drillId: string,
        result: DrillResult,
      ): Promise<void> {
        const existing = await this.getModuleProgress(moduleId);
        this.data[moduleId] = {
          ...existing,
          drillResults: { ...existing.drillResults, [drillId]: result },
        };
      }

      async setQuizResult(moduleId: string, result: QuizResult): Promise<void> {
        const existing = await this.getModuleProgress(moduleId);
        this.data[moduleId] = { ...existing, quizResult: result };
      }

      async isModuleUnlocked(moduleId: string): Promise<boolean> {
        if (moduleId === 'module-1') return true;
        const prog = this.data[moduleId];
        return prog?.quizResult?.passed === true;
      }

      async resetProgress(): Promise<void> {
        this.data = {};
      }
    }

    const repo: ProgressRepository = new InMemoryProgressRepository();
    expect(repo).toBeDefined();
    expect(progress.moduleId).toBe('module-1');
    expect(progress.lessonsCompleted).toContain('lesson-1-1');
    expect(progress.quizResult?.passed).toBe(true);
  });

  it('mock ProgressRepository: setLessonComplete and getModuleProgress round-trip', async () => {
    class InMemoryProgressRepository implements ProgressRepository {
      private data: Record<string, ModuleProgress> = {};

      async getModuleProgress(moduleId: string): Promise<ModuleProgress> {
        return this.data[moduleId] ?? { moduleId, lessonsCompleted: [], drillResults: {} };
      }

      async setLessonComplete(moduleId: string, lessonId: string): Promise<void> {
        const existing = await this.getModuleProgress(moduleId);
        this.data[moduleId] = {
          ...existing,
          lessonsCompleted: [...new Set([...existing.lessonsCompleted, lessonId])],
        };
      }

      async setDrillResult(
        moduleId: string,
        drillId: string,
        result: DrillResult,
      ): Promise<void> {
        const existing = await this.getModuleProgress(moduleId);
        this.data[moduleId] = {
          ...existing,
          drillResults: { ...existing.drillResults, [drillId]: result },
        };
      }

      async setQuizResult(moduleId: string, result: QuizResult): Promise<void> {
        const existing = await this.getModuleProgress(moduleId);
        this.data[moduleId] = { ...existing, quizResult: result };
      }

      async isModuleUnlocked(moduleId: string): Promise<boolean> {
        if (moduleId === 'module-1') return true;
        const prog = this.data[moduleId];
        return prog?.quizResult?.passed === true;
      }

      async resetProgress(): Promise<void> {
        this.data = {};
      }
    }

    const repo = new InMemoryProgressRepository();

    await repo.setLessonComplete('module-1', 'lesson-1-1');
    const prog = await repo.getModuleProgress('module-1');
    expect(prog.lessonsCompleted).toContain('lesson-1-1');

    // idempotent
    await repo.setLessonComplete('module-1', 'lesson-1-1');
    const prog2 = await repo.getModuleProgress('module-1');
    expect(prog2.lessonsCompleted).toHaveLength(1);
  });

  it('mock ProgressRepository: isModuleUnlocked reflects quiz pass', async () => {
    class InMemoryProgressRepository implements ProgressRepository {
      private data: Record<string, ModuleProgress> = {};

      async getModuleProgress(moduleId: string): Promise<ModuleProgress> {
        return this.data[moduleId] ?? { moduleId, lessonsCompleted: [], drillResults: {} };
      }

      async setLessonComplete(_moduleId: string, _lessonId: string): Promise<void> {}

      async setDrillResult(_moduleId: string, _drillId: string, _r: DrillResult): Promise<void> {}

      async setQuizResult(moduleId: string, result: QuizResult): Promise<void> {
        const existing = await this.getModuleProgress(moduleId);
        this.data[moduleId] = { ...existing, quizResult: result };
      }

      async isModuleUnlocked(moduleId: string): Promise<boolean> {
        if (moduleId === 'module-1') return true;
        const prog = this.data[moduleId];
        return prog?.quizResult?.passed === true;
      }

      async resetProgress(): Promise<void> {
        this.data = {};
      }
    }

    const repo = new InMemoryProgressRepository();

    expect(await repo.isModuleUnlocked('module-1')).toBe(true);
    expect(await repo.isModuleUnlocked('module-2')).toBe(false);

    await repo.setQuizResult('module-2', { score: 0.5, passed: false, completedAt: '' });
    expect(await repo.isModuleUnlocked('module-2')).toBe(false);

    await repo.setQuizResult('module-2', { score: 0.8, passed: true, completedAt: '' });
    expect(await repo.isModuleUnlocked('module-2')).toBe(true);
  });

  it('mock ProgressRepository: resetProgress clears all data', async () => {
    class InMemoryProgressRepository implements ProgressRepository {
      private data: Record<string, ModuleProgress> = {};

      async getModuleProgress(moduleId: string): Promise<ModuleProgress> {
        return this.data[moduleId] ?? { moduleId, lessonsCompleted: [], drillResults: {} };
      }

      async setLessonComplete(moduleId: string, lessonId: string): Promise<void> {
        const existing = await this.getModuleProgress(moduleId);
        this.data[moduleId] = {
          ...existing,
          lessonsCompleted: [...existing.lessonsCompleted, lessonId],
        };
      }

      async setDrillResult(_m: string, _d: string, _r: DrillResult): Promise<void> {}
      async setQuizResult(_m: string, _r: QuizResult): Promise<void> {}

      async isModuleUnlocked(moduleId: string): Promise<boolean> {
        return moduleId === 'module-1';
      }

      async resetProgress(): Promise<void> {
        this.data = {};
      }
    }

    const repo = new InMemoryProgressRepository();
    await repo.setLessonComplete('module-1', 'lesson-1-1');
    const beforeReset = await repo.getModuleProgress('module-1');
    expect(beforeReset.lessonsCompleted).toHaveLength(1);

    await repo.resetProgress();
    const afterReset = await repo.getModuleProgress('module-1');
    expect(afterReset.lessonsCompleted).toHaveLength(0);
  });
});
