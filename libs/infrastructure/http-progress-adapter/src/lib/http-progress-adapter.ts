import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import type { DrillResult, ModuleProgress, QuizResult } from 'content-schema';
import type { ProgressRepository } from 'domain-progress';

const BASE = '/api/progress';

/**
 * HTTP implementation of the ProgressRepository port.
 *
 * All writes use a read-modify-write pattern (GET module → mutate → PUT module)
 * to mirror the IDB adapter's semantics exactly. The server returns a default
 * empty record on GET miss (module-1 always has unlockedAt = epoch).
 *
 * No RxJS leakage: every HTTP call is wrapped in firstValueFrom().
 * Uses inject() instead of constructor injection for Angular 21 compatibility
 * and Vitest/JIT compatibility without emitDecoratorMetadata.
 */
@Injectable()
export class HttpProgressRepository implements ProgressRepository {
  private readonly http = inject(HttpClient);

  // ── reads ─────────────────────────────────────────────────────────────────

  async getModuleProgress(moduleId: string): Promise<ModuleProgress> {
    return firstValueFrom(
      this.http.get<ModuleProgress>(`${BASE}/${moduleId}`),
    );
  }

  async isModuleUnlocked(moduleId: string): Promise<boolean> {
    // module-1 is always unlocked — skip the network call
    if (moduleId === 'module-1') return true;

    const progress = await this.getModuleProgress(moduleId);
    return progress.unlockedAt !== undefined;
  }

  // ── writes (read-modify-write → PUT) ─────────────────────────────────────

  async setLessonComplete(moduleId: string, lessonId: string): Promise<void> {
    const current = await this.getModuleProgress(moduleId);

    if (!current.lessonsCompleted.includes(lessonId)) {
      current.lessonsCompleted = [...current.lessonsCompleted, lessonId];
    }

    await this.putModule(moduleId, current);
  }

  async setDrillResult(
    moduleId: string,
    drillId: string,
    result: DrillResult,
  ): Promise<void> {
    const current = await this.getModuleProgress(moduleId);
    current.drillResults = { ...current.drillResults, [drillId]: result };
    await this.putModule(moduleId, current);
  }

  async setQuizResult(moduleId: string, result: QuizResult): Promise<void> {
    const current = await this.getModuleProgress(moduleId);
    current.quizResult = result;

    // Mirror IDB adapter: set unlockedAt on first pass only
    if (result.passed && !current.unlockedAt) {
      current.unlockedAt = result.completedAt;
    }

    await this.putModule(moduleId, current);
  }

  async resetProgress(): Promise<void> {
    await firstValueFrom(
      this.http.post<void>(`${BASE}/reset`, {}),
    );
  }

  // ── private ───────────────────────────────────────────────────────────────

  private async putModule(
    moduleId: string,
    progress: ModuleProgress,
  ): Promise<ModuleProgress> {
    return firstValueFrom(
      this.http.put<ModuleProgress>(`${BASE}/${moduleId}`, progress),
    );
  }
}
