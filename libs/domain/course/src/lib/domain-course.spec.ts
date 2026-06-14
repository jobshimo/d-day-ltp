import { describe, it, expect } from 'vitest';
import type { CourseModule, ModuleProgress } from 'content-schema';
import {
  isModuleUnlocked,
  quizPassed,
  getNextLesson,
  canAccessQuiz,
  QUIZ_PASS_THRESHOLD,
} from './domain-course';

// --- Test data helpers ---

function makeModule(overrides: Partial<CourseModule> = {}): CourseModule {
  return {
    id: 'module-1',
    order: 1,
    titleEs: 'Módulo 1',
    descriptionEs: 'Descripción',
    lessons: [],
    drills: [],
    reviewQuiz: [],
    ...overrides,
  };
}

function makeProgress(overrides: Partial<ModuleProgress> = {}): ModuleProgress {
  return {
    moduleId: 'module-1',
    lessonsCompleted: [],
    drillResults: {},
    ...overrides,
  };
}

// --- quizPassed ---

describe('quizPassed', () => {
  it('returns false when score is undefined', () => {
    expect(quizPassed(undefined)).toBe(false);
  });

  it('returns true at exactly 70% (threshold boundary)', () => {
    expect(quizPassed(QUIZ_PASS_THRESHOLD)).toBe(true);
  });

  it('returns true above 70%', () => {
    expect(quizPassed(0.8)).toBe(true);
    expect(quizPassed(1.0)).toBe(true);
  });

  it('returns false at 69% (just below threshold)', () => {
    expect(quizPassed(0.69)).toBe(false);
  });

  it('returns false at 0%', () => {
    expect(quizPassed(0)).toBe(false);
  });
});

// --- isModuleUnlocked ---

describe('isModuleUnlocked', () => {
  const module1 = makeModule({ id: 'module-1', order: 1 });
  const module2 = makeModule({ id: 'module-2', order: 2 });
  const module3 = makeModule({ id: 'module-3', order: 3 });
  const modules = [module1, module2, module3];

  it('unlocks any known module regardless of progress', () => {
    expect(isModuleUnlocked(modules, 'module-1', {})).toBe(true);
    expect(isModuleUnlocked(modules, 'module-2', {})).toBe(true);
    expect(isModuleUnlocked(modules, 'module-3', {})).toBe(true);
  });

  it('returns false for an unknown moduleId', () => {
    expect(isModuleUnlocked(modules, 'module-99', {})).toBe(false);
  });
});

// --- getNextLesson ---

describe('getNextLesson', () => {
  const lesson1 = {
    id: 'lesson-1',
    moduleId: 'module-1',
    order: 1,
    titleEs: 'Lección 1',
    blocks: [],
  };
  const lesson2 = {
    id: 'lesson-2',
    moduleId: 'module-1',
    order: 2,
    titleEs: 'Lección 2',
    blocks: [],
  };
  const lesson3 = {
    id: 'lesson-3',
    moduleId: 'module-1',
    order: 3,
    titleEs: 'Lección 3',
    blocks: [],
  };

  const moduleWithLessons = makeModule({ lessons: [lesson1, lesson2, lesson3] });

  it('returns first lesson when no progress exists (undefined progress)', () => {
    expect(getNextLesson(moduleWithLessons, undefined)).toEqual(lesson1);
  });

  it('returns first lesson when progress has empty lessonsCompleted', () => {
    const progress = makeProgress({ lessonsCompleted: [] });
    expect(getNextLesson(moduleWithLessons, progress)).toEqual(lesson1);
  });

  it('returns second lesson when first is completed', () => {
    const progress = makeProgress({ lessonsCompleted: ['lesson-1'] });
    expect(getNextLesson(moduleWithLessons, progress)).toEqual(lesson2);
  });

  it('returns third lesson when first two are completed', () => {
    const progress = makeProgress({ lessonsCompleted: ['lesson-1', 'lesson-2'] });
    expect(getNextLesson(moduleWithLessons, progress)).toEqual(lesson3);
  });

  it('returns undefined when all lessons are completed', () => {
    const progress = makeProgress({ lessonsCompleted: ['lesson-1', 'lesson-2', 'lesson-3'] });
    expect(getNextLesson(moduleWithLessons, progress)).toBeUndefined();
  });

  it('returns undefined for a module with no lessons', () => {
    const emptyModule = makeModule({ lessons: [] });
    expect(getNextLesson(emptyModule, undefined)).toBeUndefined();
  });
});

// --- canAccessQuiz ---

describe('canAccessQuiz', () => {
  const drill1 = {
    id: 'drill-1',
    moduleId: 'module-1',
    type: 'multiple-choice' as const,
    questionEs: '¿Q1?',
    correctAnswer: 'a',
    ruleRefs: [],
    explanationEs: 'Explicación 1.',
  };
  const drill2 = {
    id: 'drill-2',
    moduleId: 'module-1',
    type: 'multiple-choice' as const,
    questionEs: '¿Q2?',
    correctAnswer: 'b',
    ruleRefs: [],
    explanationEs: 'Explicación 2.',
  };

  const moduleWithDrills = makeModule({ drills: [drill1, drill2] });
  const moduleNoDrills = makeModule({ drills: [] });

  it('returns true for a module with no drills', () => {
    expect(canAccessQuiz(moduleNoDrills, undefined)).toBe(true);
  });

  it('returns false when no drills are completed (undefined progress)', () => {
    expect(canAccessQuiz(moduleWithDrills, undefined)).toBe(false);
  });

  it('returns false when no drills are completed (empty drillResults)', () => {
    const progress = makeProgress({ drillResults: {} });
    expect(canAccessQuiz(moduleWithDrills, progress)).toBe(false);
  });

  it('returns false when only one of two drills is completed', () => {
    const progress = makeProgress({
      drillResults: {
        'drill-1': { answeredCorrectly: true, attempts: 1, completedAt: '' },
      },
    });
    expect(canAccessQuiz(moduleWithDrills, progress)).toBe(false);
  });

  it('returns true when all drills are completed', () => {
    const progress = makeProgress({
      drillResults: {
        'drill-1': { answeredCorrectly: true, attempts: 1, completedAt: '' },
        'drill-2': { answeredCorrectly: false, attempts: 3, completedAt: '' },
      },
    });
    expect(canAccessQuiz(moduleWithDrills, progress)).toBe(true);
  });

  it('returns false when quiz would block access but drills differ', () => {
    // Only drill-2 done but module has drill-1 and drill-2
    const progress = makeProgress({
      drillResults: {
        'drill-2': { answeredCorrectly: true, attempts: 1, completedAt: '' },
      },
    });
    expect(canAccessQuiz(moduleWithDrills, progress)).toBe(false);
  });
});
