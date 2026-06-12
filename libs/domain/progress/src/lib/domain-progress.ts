// Progress domain types — framework-free

export interface ModuleProgress {
  moduleId: string;
  lessonsCompleted: string[];
  drillResults: Record<string, DrillResult>;
  quizResult?: QuizResult;
  unlockedAt?: string; // ISO date
}

export interface DrillResult {
  answeredCorrectly: boolean;
  attempts: number;
  completedAt: string; // ISO date
}

export interface QuizResult {
  score: number; // 0.0 – 1.0
  passed: boolean;
  completedAt: string; // ISO date
}

// ProgressRepository port (hexagonal port — no adapter logic here)
export interface ProgressRepository {
  getModuleProgress(moduleId: string): Promise<ModuleProgress>;
  setLessonComplete(moduleId: string, lessonId: string): Promise<void>;
  setDrillResult(moduleId: string, drillId: string, result: DrillResult): Promise<void>;
  setQuizResult(moduleId: string, result: QuizResult): Promise<void>;
  isModuleUnlocked(moduleId: string): Promise<boolean>;
  resetProgress(): Promise<void>;
}

// DI token description — frameworks use this string to create their own typed tokens
// Angular apps: new InjectionToken<ProgressRepository>(PROGRESS_REPO_TOKEN_ID)
export const PROGRESS_REPO_TOKEN_ID = 'ProgressRepository';
