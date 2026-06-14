import type { CourseModule, ModuleProgress } from 'content-schema';

// Quiz pass threshold per REQ-QZ-02
export const QUIZ_PASS_THRESHOLD = 0.7;

/**
 * Determines whether a module is unlocked given an array of all course modules
 * and the current progress map.
 *
 * Free navigation: every known module is always accessible regardless of prior
 * module completion. Returns false only for an unknown moduleId.
 */
export function isModuleUnlocked(
  modules: CourseModule[],
  moduleId: string,
  _progressByModule: Record<string, ModuleProgress>,
): boolean {
  return modules.some((m) => m.id === moduleId);
}

/**
 * Returns true when a score meets or exceeds the 70% pass threshold.
 * Accepts undefined to make call sites cleaner.
 */
export function quizPassed(score: number | undefined): boolean {
  if (score === undefined) return false;
  return score >= QUIZ_PASS_THRESHOLD;
}

/**
 * Returns the next lesson the user should play within a module.
 * Lessons are returned in authored order; already-completed lessons are skipped.
 * Returns undefined when all lessons are complete.
 */
export function getNextLesson(
  module: CourseModule,
  progress: ModuleProgress | undefined,
): CourseModule['lessons'][number] | undefined {
  const completed = new Set(progress?.lessonsCompleted ?? []);

  for (const lesson of module.lessons) {
    if (!completed.has(lesson.id)) {
      return lesson;
    }
  }

  return undefined;
}

/**
 * Determines whether the user can access the review quiz for a module.
 * The quiz is accessible only when ALL drills in the module are completed.
 *
 * Per REQ-DRL-05: all drills must be completed before the review quiz is accessible.
 */
export function canAccessQuiz(
  module: CourseModule,
  progress: ModuleProgress | undefined,
): boolean {
  if (module.drills.length === 0) return true; // no drills — quiz freely accessible

  const completedDrills = Object.keys(progress?.drillResults ?? {});
  const allDrillIds = module.drills.map((d) => d.id);

  return allDrillIds.every((drillId) => completedDrills.includes(drillId));
}
