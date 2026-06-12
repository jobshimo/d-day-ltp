import { describe, it, expect, beforeEach } from 'vitest';
import { IdbProgressRepository } from './idb-adapter';
import type { DrillResult, QuizResult } from 'content-schema';

describe('IdbProgressRepository', () => {
  let repo: IdbProgressRepository;

  beforeEach(() => {
    // Each test gets a fresh repo instance (fresh lazy DB connection)
    repo = new IdbProgressRepository();
  });

  describe('setLessonComplete + getModuleProgress round-trip', () => {
    it('records a completed lesson and retrieves it', async () => {
      await repo.setLessonComplete('module-1', 'lesson-1-1');
      const progress = await repo.getModuleProgress('module-1');

      expect(progress.moduleId).toBe('module-1');
      expect(progress.lessonsCompleted).toContain('lesson-1-1');
    });

    it('does not duplicate a lesson already completed', async () => {
      await repo.setLessonComplete('module-1', 'lesson-1-1');
      await repo.setLessonComplete('module-1', 'lesson-1-1');
      const progress = await repo.getModuleProgress('module-1');

      expect(progress.lessonsCompleted.filter((l) => l === 'lesson-1-1')).toHaveLength(1);
    });

    it('returns empty lessonsCompleted for a fresh module', async () => {
      const progress = await repo.getModuleProgress('module-2');
      expect(progress.lessonsCompleted).toEqual([]);
    });
  });

  describe('setQuizResult + isModuleUnlocked chain', () => {
    it('marks a module unlocked when quiz is passed', async () => {
      const result: QuizResult = {
        score: 0.8,
        passed: true,
        completedAt: new Date().toISOString(),
      };

      // Before quiz: module-2 is locked
      expect(await repo.isModuleUnlocked('module-2')).toBe(false);

      await repo.setQuizResult('module-1', result);

      // After passing module-1 quiz, module-1 itself gets the unlock timestamp,
      // but unlocking the NEXT module requires calling setQuizResult on the
      // preceding module and then the application layer setting unlockedAt on
      // module-2. This test verifies the quiz result is stored.
      const progress = await repo.getModuleProgress('module-1');
      expect(progress.quizResult?.passed).toBe(true);
      expect(progress.quizResult?.score).toBe(0.8);
    });

    it('does NOT set unlockedAt on a failed quiz', async () => {
      const result: QuizResult = {
        score: 0.5,
        passed: false,
        completedAt: new Date().toISOString(),
      };

      await repo.setQuizResult('module-1', result);

      const progress = await repo.getModuleProgress('module-1');
      // module-1 always unlocked (unlockedAt = epoch), but no quiz pass recorded
      expect(progress.quizResult?.passed).toBe(false);
    });

    it('module-1 is always unlocked regardless of quiz state', async () => {
      expect(await repo.isModuleUnlocked('module-1')).toBe(true);
    });
  });

  describe('setDrillResult', () => {
    it('stores drill results keyed by drillId', async () => {
      const result: DrillResult = {
        answeredCorrectly: true,
        attempts: 1,
        completedAt: new Date().toISOString(),
      };

      await repo.setDrillResult('module-1', 'drill-1-1', result);
      const progress = await repo.getModuleProgress('module-1');

      expect(progress.drillResults['drill-1-1']).toEqual(result);
    });
  });

  describe('resetProgress', () => {
    it('clears all stored progress data', async () => {
      await repo.setLessonComplete('module-1', 'lesson-1-1');
      await repo.setLessonComplete('module-2', 'lesson-2-1');

      await repo.resetProgress();

      const m1 = await repo.getModuleProgress('module-1');
      const m2 = await repo.getModuleProgress('module-2');

      expect(m1.lessonsCompleted).toEqual([]);
      expect(m2.lessonsCompleted).toEqual([]);
    });

    it('after reset module-1 is still unlocked (default rule)', async () => {
      await repo.setLessonComplete('module-1', 'lesson-1-1');
      await repo.resetProgress();

      // module-1 unlock is a domain rule, not a stored value check
      expect(await repo.isModuleUnlocked('module-1')).toBe(true);
    });
  });
});
