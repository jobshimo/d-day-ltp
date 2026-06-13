import { describe, it, expect } from 'vitest';
import { ALL_MODULES } from './lib/modules';
import { TERMINOLOGY } from './terminology';
import { PATCHES, applyPatches } from './patches/index';
import { SYMBOLOGY } from './lib/symbology';
import { SETUP_GUIDE } from './lib/setup-guide';

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

describe('SYMBOLOGY', () => {
  it('contains exactly 8 categories', () => {
    expect(SYMBOLOGY).toHaveLength(8);
  });

  it('all expected category ids are present', () => {
    const ids = SYMBOLOGY.map((c) => c.id);
    expect(ids).toContain('us-units');
    expect(ids).toContain('german-units');
    expect(ids).toContain('target-symbols');
    expect(ids).toContain('fire-dots');
    expect(ids).toContain('weapon-codes');
    expect(ids).toContain('terrain');
    expect(ids).toContain('german-positions');
    expect(ids).toContain('us-divisions');
  });

  it('us-units category has 9 entries (8 unit types + tank card-style NATO oval)', () => {
    const cat = SYMBOLOGY.find((c) => c.id === 'us-units')!;
    expect(cat.entries).toHaveLength(9);
  });

  it('german-units category has 5 entries including artillery-88 and armor card-style NATO oval', () => {
    const cat = SYMBOLOGY.find((c) => c.id === 'german-units')!;
    expect(cat.entries).toHaveLength(5);
    const has88 = cat.entries.some(
      (e) => e.render.kind === 'unit-symbol' && e.render.germanSymbol === 'artillery-88',
    );
    expect(has88).toBe(true);
  });

  it('target-symbols category has 6 entries (3 shapes × 2 control variants)', () => {
    const cat = SYMBOLOGY.find((c) => c.id === 'target-symbols')!;
    expect(cat.entries).toHaveLength(6);
  });

  it('fire-dots category has 3 entries', () => {
    const cat = SYMBOLOGY.find((c) => c.id === 'fire-dots')!;
    expect(cat.entries).toHaveLength(3);
  });

  it('weapon-codes category has 9 entries including NV', () => {
    const cat = SYMBOLOGY.find((c) => c.id === 'weapon-codes')!;
    expect(cat.entries).toHaveLength(9);
    const nv = cat.entries.find((e) => e.key === 'wc-NV');
    expect(nv).toBeDefined();
    expect(nv?.note).toBeTruthy(); // NV must carry the "a confirmar" note
  });

  it('terrain category has 9 entries matching TerrainType', () => {
    const cat = SYMBOLOGY.find((c) => c.id === 'terrain')!;
    expect(cat.entries).toHaveLength(9);
  });

  it('german-positions category has 6 entries', () => {
    const cat = SYMBOLOGY.find((c) => c.id === 'german-positions')!;
    expect(cat.entries).toHaveLength(6);
  });

  it('us-divisions category has 2 entries', () => {
    const cat = SYMBOLOGY.find((c) => c.id === 'us-divisions')!;
    expect(cat.entries).toHaveLength(2);
  });

  it('every entry has nameEs, meaningEs, and render', () => {
    for (const cat of SYMBOLOGY) {
      for (const entry of cat.entries) {
        expect(entry.nameEs, `${entry.key} missing nameEs`).toBeTruthy();
        expect(entry.meaningEs, `${entry.key} missing meaningEs`).toBeTruthy();
        expect(entry.render, `${entry.key} missing render`).toBeDefined();
        expect(entry.render.kind, `${entry.key} render missing kind`).toBeTruthy();
      }
    }
  });

  it('color-swatch entries have non-empty color and label', () => {
    for (const cat of SYMBOLOGY) {
      for (const entry of cat.entries) {
        if (entry.render.kind === 'color-swatch') {
          expect(entry.render.color, `${entry.key} swatch missing color`).toMatch(/^#[0-9a-f]{6}$/i);
          expect(entry.render.label, `${entry.key} swatch missing label`).toBeTruthy();
        }
      }
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

describe('SETUP_GUIDE', () => {
  it('contains exactly 5 groups', () => {
    expect(SETUP_GUIDE).toHaveLength(5);
  });

  it('all expected group ids are present', () => {
    const ids = SETUP_GUIDE.map((g) => g.id);
    expect(ids).toContain('mapa');
    expect(ids).toContain('german-wn');
    expect(ids).toContain('german-reinforcements');
    expect(ids).toContain('marcadores-mazo');
    expect(ids).toContain('us-deployment');
  });

  it('every group has a non-empty titleEs', () => {
    for (const group of SETUP_GUIDE) {
      expect(group.titleEs, `group "${group.id}" missing titleEs`).toBeTruthy();
    }
  });

  it('every group has at least one step', () => {
    for (const group of SETUP_GUIDE) {
      expect(group.steps.length, `group "${group.id}" has no steps`).toBeGreaterThan(0);
    }
  });

  it('every step has titleEs, bodyEs, and groupId', () => {
    for (const group of SETUP_GUIDE) {
      for (const step of group.steps) {
        expect(step.titleEs, `step "${step.id}" missing titleEs`).toBeTruthy();
        expect(step.bodyEs, `step "${step.id}" missing bodyEs`).toBeTruthy();
        expect(step.groupId, `step "${step.id}" missing groupId`).toBeTruthy();
      }
    }
  });

  it('every step groupId matches its parent group id', () => {
    for (const group of SETUP_GUIDE) {
      for (const step of group.steps) {
        expect(step.groupId).toBe(group.id);
      }
    }
  });

  it('total step count is 10', () => {
    const total = SETUP_GUIDE.reduce((sum, g) => sum + g.steps.length, 0);
    expect(total).toBe(10);
  });

  it('all step ids are unique', () => {
    const ids = SETUP_GUIDE.flatMap((g) => g.steps.map((s) => s.id));
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('german-wn group has 3 steps', () => {
    const group = SETUP_GUIDE.find((g) => g.id === 'german-wn')!;
    expect(group.steps).toHaveLength(3);
  });

  it('us-deployment group has a step with a pieceExample of type tank', () => {
    const group = SETUP_GUIDE.find((g) => g.id === 'us-deployment')!;
    const step = group.steps[0];
    expect(step.pieceExample).toBeDefined();
    expect(step.pieceExample!.unit.kind).toBe('us');
    // Type assertion for narrowing
    const u = step.pieceExample!.unit as { kind: 'us'; type: string };
    expect(u.type).toBe('tank');
  });
});
