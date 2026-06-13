import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpProgressRepository } from './http-progress-adapter';
import type { DrillResult, ModuleProgress, QuizResult } from 'content-schema';

const BASE = '/api/progress';

function makeDefaultProgress(moduleId: string): ModuleProgress {
  return {
    moduleId,
    lessonsCompleted: [],
    drillResults: {},
    quizResult: undefined,
    unlockedAt: moduleId === 'module-1' ? new Date(0).toISOString() : undefined,
  };
}

// Typed helper to spy on private/public methods without ts error
function spyOn<T>(obj: T, method: keyof T) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return vi.spyOn(obj as any, method as string);
}

describe('HttpProgressRepository', () => {
  let repo: HttpProgressRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        HttpProgressRepository,
      ],
    });

    repo = TestBed.inject(HttpProgressRepository);
    http = TestBed.inject(HttpTestingController);
  });

  // ── getModuleProgress ────────────────────────────────────────────────────

  it('getModuleProgress issues GET /api/progress/:moduleId', async () => {
    const expected = makeDefaultProgress('module-1');
    const promise = repo.getModuleProgress('module-1');

    const req = http.expectOne(`${BASE}/module-1`);
    expect(req.request.method).toBe('GET');
    req.flush(expected);

    const result = await promise;
    expect(result).toEqual(expected);
  });

  // ── setLessonComplete ────────────────────────────────────────────────────
  // These tests use spies on getModuleProgress + putModule to verify the
  // read-modify-write mutation logic without fighting HttpTestingController
  // async scheduling in a zoneless environment.

  it('setLessonComplete calls PUT with lessonId appended', async () => {
    const current = makeDefaultProgress('module-1');
    spyOn(repo, 'getModuleProgress').mockResolvedValueOnce(current);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const putSpy = vi.spyOn(repo as any, 'putModule').mockResolvedValueOnce({
      ...current,
      lessonsCompleted: ['lesson-1'],
    });

    await repo.setLessonComplete('module-1', 'lesson-1');

    expect(putSpy).toHaveBeenCalledWith(
      'module-1',
      expect.objectContaining({ lessonsCompleted: ['lesson-1'] }),
    );
  });

  it('setLessonComplete deduplicates lessonId when already present', async () => {
    const current: ModuleProgress = {
      ...makeDefaultProgress('module-1'),
      lessonsCompleted: ['lesson-1'],
    };
    spyOn(repo, 'getModuleProgress').mockResolvedValueOnce(current);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const putSpy = vi.spyOn(repo as any, 'putModule').mockResolvedValueOnce(current);

    await repo.setLessonComplete('module-1', 'lesson-1');

    const sentProgress: ModuleProgress = putSpy.mock.calls[0][1];
    expect(sentProgress.lessonsCompleted).toEqual(['lesson-1']); // still one entry
  });

  // ── setDrillResult ───────────────────────────────────────────────────────

  it('setDrillResult merges drillResults and calls PUT', async () => {
    const current = makeDefaultProgress('module-1');
    const drillResult: DrillResult = {
      answeredCorrectly: true,
      attempts: 1,
      completedAt: new Date().toISOString(),
    };
    spyOn(repo, 'getModuleProgress').mockResolvedValueOnce(current);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const putSpy = vi.spyOn(repo as any, 'putModule').mockResolvedValueOnce({
      ...current,
      drillResults: { 'drill-1': drillResult },
    });

    await repo.setDrillResult('module-1', 'drill-1', drillResult);

    expect(putSpy).toHaveBeenCalledWith(
      'module-1',
      expect.objectContaining({ drillResults: { 'drill-1': drillResult } }),
    );
  });

  // ── setQuizResult ────────────────────────────────────────────────────────

  it('setQuizResult sets unlockedAt on first pass', async () => {
    const current = makeDefaultProgress('module-2'); // no unlockedAt
    const quizResult: QuizResult = {
      score: 90,
      passed: true,
      completedAt: '2024-01-01T00:00:00.000Z',
    };
    spyOn(repo, 'getModuleProgress').mockResolvedValueOnce(current);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const putSpy = vi.spyOn(repo as any, 'putModule').mockResolvedValueOnce({
      ...current,
      quizResult,
      unlockedAt: quizResult.completedAt,
    });

    await repo.setQuizResult('module-2', quizResult);

    const sentProgress: ModuleProgress = putSpy.mock.calls[0][1];
    expect(sentProgress.quizResult).toEqual(quizResult);
    expect(sentProgress.unlockedAt).toBe(quizResult.completedAt);
  });

  it('setQuizResult does NOT overwrite unlockedAt when already set', async () => {
    const existingUnlock = '2023-12-01T00:00:00.000Z';
    const current: ModuleProgress = {
      ...makeDefaultProgress('module-2'),
      unlockedAt: existingUnlock,
    };
    const quizResult: QuizResult = {
      score: 100,
      passed: true,
      completedAt: '2024-01-01T00:00:00.000Z',
    };
    spyOn(repo, 'getModuleProgress').mockResolvedValueOnce(current);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const putSpy = vi.spyOn(repo as any, 'putModule').mockResolvedValueOnce({ ...current, quizResult });

    await repo.setQuizResult('module-2', quizResult);

    const sentProgress: ModuleProgress = putSpy.mock.calls[0][1];
    expect(sentProgress.unlockedAt).toBe(existingUnlock); // not overwritten
  });

  it('setQuizResult does NOT set unlockedAt when quiz not passed', async () => {
    const current = makeDefaultProgress('module-2'); // no unlockedAt
    const quizResult: QuizResult = {
      score: 40,
      passed: false,
      completedAt: '2024-01-01T00:00:00.000Z',
    };
    spyOn(repo, 'getModuleProgress').mockResolvedValueOnce(current);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const putSpy = vi.spyOn(repo as any, 'putModule').mockResolvedValueOnce({ ...current, quizResult });

    await repo.setQuizResult('module-2', quizResult);

    const sentProgress: ModuleProgress = putSpy.mock.calls[0][1];
    expect(sentProgress.unlockedAt).toBeUndefined();
  });

  // ── resetProgress ────────────────────────────────────────────────────────

  it('resetProgress issues POST /api/progress/reset', async () => {
    const promise = repo.resetProgress();

    const req = http.expectOne(`${BASE}/reset`);
    expect(req.request.method).toBe('POST');
    req.flush(null, { status: 204, statusText: 'No Content' });

    await promise;
  });

  // ── isModuleUnlocked ─────────────────────────────────────────────────────

  it('isModuleUnlocked returns true for module-1 without HTTP call', async () => {
    const result = await repo.isModuleUnlocked('module-1');
    http.expectNone(`${BASE}/module-1`);
    expect(result).toBe(true);
  });

  it('isModuleUnlocked issues GET and returns true when unlockedAt is set', async () => {
    const progress: ModuleProgress = {
      ...makeDefaultProgress('module-2'),
      unlockedAt: '2024-01-01T00:00:00.000Z',
    };
    const promise = repo.isModuleUnlocked('module-2');

    const req = http.expectOne(`${BASE}/module-2`);
    req.flush(progress);

    expect(await promise).toBe(true);
  });

  it('isModuleUnlocked issues GET and returns false when unlockedAt is undefined', async () => {
    const progress = makeDefaultProgress('module-2'); // no unlockedAt
    const promise = repo.isModuleUnlocked('module-2');

    const req = http.expectOne(`${BASE}/module-2`);
    req.flush(progress);

    expect(await promise).toBe(false);
  });
});
