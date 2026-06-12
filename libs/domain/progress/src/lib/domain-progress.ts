// Re-export shared progress types from content-schema
export type { ModuleProgress, DrillResult, QuizResult } from 'content-schema';

// ProgressRepository port (hexagonal port — no adapter logic here)
export interface ProgressRepository {
  getModuleProgress(moduleId: string): Promise<import('content-schema').ModuleProgress>;
  setLessonComplete(moduleId: string, lessonId: string): Promise<void>;
  setDrillResult(
    moduleId: string,
    drillId: string,
    result: import('content-schema').DrillResult,
  ): Promise<void>;
  setQuizResult(moduleId: string, result: import('content-schema').QuizResult): Promise<void>;
  isModuleUnlocked(moduleId: string): Promise<boolean>;
  resetProgress(): Promise<void>;
}

// DI token description — frameworks use this string to create their own typed tokens
// Angular apps: new InjectionToken<ProgressRepository>(PROGRESS_REPO_TOKEN_ID)
export const PROGRESS_REPO_TOKEN_ID = 'ProgressRepository';
