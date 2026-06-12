import { describe, it, expect } from 'vitest';
import { ALL_MODULES } from './lib/modules';
import { TERMINOLOGY } from './terminology';
import { PATCHES, applyPatches } from './patches/index';

describe('ALL_MODULES', () => {
  it('contains exactly 8 modules', () => {
    expect(ALL_MODULES).toHaveLength(8);
  });

  it('modules are in sequential order', () => {
    const orders = ALL_MODULES.map((m) => m.order);
    expect(orders).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('every module has an id, titleEs, and descriptionEs', () => {
    for (const mod of ALL_MODULES) {
      expect(mod.id).toBeTruthy();
      expect(mod.titleEs).toBeTruthy();
      expect(mod.descriptionEs).toBeTruthy();
    }
  });

  it('module-1 has 3 lessons', () => {
    const m1 = ALL_MODULES.find((m) => m.id === 'module-1')!;
    expect(m1.lessons).toHaveLength(3);
  });

  it('module-1 has 3 drills', () => {
    const m1 = ALL_MODULES.find((m) => m.id === 'module-1')!;
    expect(m1.drills).toHaveLength(3);
  });

  it('module-1 has 5 quiz items', () => {
    const m1 = ALL_MODULES.find((m) => m.id === 'module-1')!;
    expect(m1.reviewQuiz).toHaveLength(5);
  });

  it('module-4 has 1 lesson and 1 drill (PoC)', () => {
    const m4 = ALL_MODULES.find((m) => m.id === 'module-4')!;
    expect(m4.lessons).toHaveLength(1);
    expect(m4.drills).toHaveLength(1);
  });

  it('module-4 has no requiredPriorModuleId (preview mode)', () => {
    const m4 = ALL_MODULES.find((m) => m.id === 'module-4')!;
    expect(m4.requiredPriorModuleId).toBeUndefined();
  });

  it('module-1 lessons are in order 1–3', () => {
    const m1 = ALL_MODULES.find((m) => m.id === 'module-1')!;
    const orders = m1.lessons.map((l) => l.order);
    expect(orders).toEqual([1, 2, 3]);
  });

  it('all module-1 drills and quiz items have ruleRefs', () => {
    const m1 = ALL_MODULES.find((m) => m.id === 'module-1')!;
    for (const drill of m1.drills) {
      expect(drill.ruleRefs.length).toBeGreaterThan(0);
    }
    for (const quiz of m1.reviewQuiz) {
      expect(quiz.ruleRefs.length).toBeGreaterThan(0);
    }
  });

  it('module-4 interactive drill has a boardSnippet and fireCard', () => {
    const m4 = ALL_MODULES.find((m) => m.id === 'module-4')!;
    const drill = m4.drills[0];
    expect(drill.boardSnippet).toBeDefined();
    expect(drill.fireCard).toBeDefined();
  });

  it('module-4 drill type is interactive-select', () => {
    const m4 = ALL_MODULES.find((m) => m.id === 'module-4')!;
    expect(m4.drills[0].type).toBe('interactive-select');
  });

  it('module-4 drill correctAnswer reflects hit-limit priority rule', () => {
    const m4 = ALL_MODULES.find((m) => m.id === 'module-4')!;
    const drill = m4.drills[0];
    // Correct answer = unit-a,unit-b (both in intense-fire hexes, hit limit = 2)
    expect(drill.correctAnswer).toBe('unit-a,unit-b');
  });

  it('stubs (modules 2,3,5,6,7,8) have empty lessons/drills/quiz', () => {
    const stubs = ALL_MODULES.filter((m) => !['module-1', 'module-4'].includes(m.id));
    for (const stub of stubs) {
      expect(stub.lessons).toHaveLength(0);
      expect(stub.drills).toHaveLength(0);
      expect(stub.reviewQuiz).toHaveLength(0);
    }
  });
});

describe('TERMINOLOGY', () => {
  it('contains at least 9 required entries from REQ-CS-04', () => {
    expect(TERMINOLOGY.length).toBeGreaterThanOrEqual(9);
  });

  it('contains the WN entry', () => {
    const wn = TERMINOLOGY.find((t) => t.englishTerm === 'WN');
    expect(wn).toBeDefined();
    expect(wn?.spanishTerm).toBeTruthy();
  });

  it('all entries have devir: false (placeholders until manual is confirmed)', () => {
    for (const entry of TERMINOLOGY) {
      expect(entry.devir).toBe(false);
    }
  });

  it('required REQ-CS-04 terms are all present', () => {
    const required = [
      'WN',
      'Fire card',
      'Landing card',
      'Disruption',
      'Field of fire',
      'Depth marker',
      'Target symbol',
      'Step loss',
      'Beach landing box',
    ];
    for (const term of required) {
      const found = TERMINOLOGY.find(
        (t) => t.englishTerm.toLowerCase() === term.toLowerCase(),
      );
      expect(found, `Expected term "${term}" not found in TERMINOLOGY`).toBeDefined();
    }
  });
});

describe('PATCHES', () => {
  it('contains zero patches in v1', () => {
    expect(PATCHES).toHaveLength(0);
  });

  it('applyPatches returns the module unchanged when no patches exist', () => {
    const m1 = ALL_MODULES.find((m) => m.id === 'module-1')!;
    const result = applyPatches(m1);
    expect(result).toBe(m1); // same reference when no patches
  });
});
