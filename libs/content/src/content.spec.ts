import { describe, it, expect } from 'vitest';
import { ALL_MODULES } from './lib/modules';
import { TERMINOLOGY } from './terminology';
import { PATCHES, applyPatches } from './patches/index';
import { SYMBOLOGY } from './lib/symbology';
import { SETUP_GUIDE } from './lib/setup-guide';
import { HISTORY } from './lib/history';

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

  // ------------------------------------------------------------------
  // Per-module non-empty content counts
  // ------------------------------------------------------------------
  const KNOWN_CHART_SRCS = new Set([
    'assets/charts/german-fire-chart.jpg',
    'assets/charts/amphibious-landing-table.jpg',
    'assets/charts/us-attack-results-chart.jpg',
    'assets/charts/us-weapons-chart.jpg',
    'assets/charts/us-barrage-table.jpg',
    'assets/charts/terrain-effects-chart.jpg',
  ]);

  const MODULE_COUNTS: Record<string, { lessons: number; drills: number; quiz: number }> = {
    'module-2': { lessons: 3, drills: 3, quiz: 4 },
    'module-3': { lessons: 3, drills: 3, quiz: 4 },
    'module-4': { lessons: 1, drills: 1, quiz: 3 },
    'module-5': { lessons: 4, drills: 3, quiz: 4 },
    'module-6': { lessons: 3, drills: 2, quiz: 4 },
    'module-7': { lessons: 3, drills: 2, quiz: 4 },
    'module-8': { lessons: 4, drills: 2, quiz: 4 },
  };

  for (const [moduleId, counts] of Object.entries(MODULE_COUNTS)) {
    describe(`${moduleId} content counts`, () => {
      const mod = ALL_MODULES.find((m) => m.id === moduleId)!;
      it(`has at least ${counts.lessons} lessons`, () => {
        expect(mod.lessons.length).toBeGreaterThanOrEqual(counts.lessons);
      });
      it(`has at least ${counts.drills} drills`, () => {
        expect(mod.drills.length).toBeGreaterThanOrEqual(counts.drills);
      });
      it(`has at least ${counts.quiz} quiz items`, () => {
        expect(mod.reviewQuiz.length).toBeGreaterThanOrEqual(counts.quiz);
      });
    });
  }

  // ------------------------------------------------------------------
  // Cross-cutting data integrity (ALL modules 1–8)
  // ------------------------------------------------------------------
  describe('cross-cutting integrity', () => {
    it('every lesson has id, moduleId, order, titleEs and non-empty blocks', () => {
      for (const mod of ALL_MODULES) {
        for (const lesson of mod.lessons) {
          expect(lesson.id, `${mod.id} lesson missing id`).toBeTruthy();
          expect(lesson.moduleId, `${lesson.id} missing moduleId`).toBeTruthy();
          expect(typeof lesson.order, `${lesson.id} order not number`).toBe('number');
          expect(lesson.titleEs, `${lesson.id} missing titleEs`).toBeTruthy();
          expect(lesson.blocks.length, `${lesson.id} has no blocks`).toBeGreaterThan(0);
        }
      }
    });

    it('every block has non-empty content; image/svg blocks have altText', () => {
      for (const mod of ALL_MODULES) {
        for (const lesson of mod.lessons) {
          for (const block of lesson.blocks) {
            expect(block.content, `${lesson.id} block missing content`).toBeTruthy();
            if (block.type === 'image' || block.type === 'svg-snippet') {
              expect(block.altText, `${lesson.id} ${block.type} block missing altText`).toBeTruthy();
            }
          }
        }
      }
    });

    it('every image block src starts with assets/charts/ or assets/svg/ (no leading slash)', () => {
      for (const mod of ALL_MODULES) {
        for (const lesson of mod.lessons) {
          for (const block of lesson.blocks) {
            if (block.type === 'image') {
              expect(
                block.content.startsWith('assets/charts/') || block.content.startsWith('assets/svg/'),
                `${lesson.id} image block has invalid src: "${block.content}"`,
              ).toBe(true);
            }
          }
        }
      }
    });

    it('every image block src is in the known chart filename allowlist', () => {
      for (const mod of ALL_MODULES) {
        for (const lesson of mod.lessons) {
          for (const block of lesson.blocks) {
            if (block.type === 'image' && block.content.startsWith('assets/charts/')) {
              expect(
                KNOWN_CHART_SRCS.has(block.content),
                `${lesson.id} image src not in allowlist: "${block.content}"`,
              ).toBe(true);
            }
          }
        }
      }
    });

    it('every drill and quiz item has ruleRefs with length >= 1', () => {
      for (const mod of ALL_MODULES) {
        for (const drill of mod.drills) {
          expect(
            drill.ruleRefs.length,
            `${mod.id} drill ${drill.id} missing ruleRefs`,
          ).toBeGreaterThanOrEqual(1);
        }
        for (const quiz of mod.reviewQuiz) {
          expect(
            quiz.ruleRefs.length,
            `${mod.id} quiz ${quiz.id} missing ruleRefs`,
          ).toBeGreaterThanOrEqual(1);
        }
      }
    });

    it('every multiple-choice drill/quiz has exactly one isCorrect:true choice matching correctAnswer', () => {
      for (const mod of ALL_MODULES) {
        const items = [...mod.drills, ...mod.reviewQuiz];
        for (const item of items) {
          if (item.type === 'multiple-choice' && item.choices) {
            const correct = item.choices.filter((c) => c.isCorrect);
            expect(
              correct.length,
              `${mod.id} item ${item.id} must have exactly 1 isCorrect choice`,
            ).toBe(1);
            expect(
              correct[0].id,
              `${mod.id} item ${item.id} correctAnswer must match isCorrect choice id`,
            ).toBe(item.correctAnswer);
          }
        }
      }
    });

    it('every interactive-select drill has boardSnippet defined and correctAnswer non-empty', () => {
      for (const mod of ALL_MODULES) {
        for (const drill of mod.drills) {
          if (drill.type === 'interactive-select') {
            expect(
              drill.boardSnippet,
              `${mod.id} drill ${drill.id} missing boardSnippet`,
            ).toBeDefined();
            expect(
              drill.correctAnswer,
              `${mod.id} drill ${drill.id} correctAnswer must be non-empty`,
            ).toBeTruthy();
          }
        }
      }
    });
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

describe('HISTORY', () => {
  it('contains exactly 6 sections', () => {
    expect(HISTORY).toHaveLength(6);
  });

  it('all expected section ids are present', () => {
    const ids = HISTORY.map((s) => s.id);
    expect(ids).toContain('el-plan');
    expect(ids).toContain('el-asalto');
    expect(ids).toContain('las-defensas');
    expect(ids).toContain('la-crisis');
    expect(ids).toContain('el-avance');
    expect(ids).toContain('en-el-juego');
  });

  it('every section has a non-empty id and titleEs', () => {
    for (const section of HISTORY) {
      expect(section.id, `section missing id`).toBeTruthy();
      expect(section.titleEs, `section "${section.id}" missing titleEs`).toBeTruthy();
    }
  });

  it('every section has at least one block', () => {
    for (const section of HISTORY) {
      expect(section.blocks.length, `section "${section.id}" has no blocks`).toBeGreaterThan(0);
    }
  });

  it('every image block content starts with assets/images/ and has altText', () => {
    for (const section of HISTORY) {
      for (const block of section.blocks) {
        if (block.type === 'image') {
          expect(
            block.content.startsWith('assets/images/'),
            `section "${section.id}" image block has invalid src: "${block.content}"`,
          ).toBe(true);
          expect(
            block.altText,
            `section "${section.id}" image block missing altText`,
          ).toBeTruthy();
        }
      }
    }
  });

  it('every prose block has a sourceRef', () => {
    for (const section of HISTORY) {
      for (const block of section.blocks) {
        if (block.type === 'prose') {
          expect(
            block.sourceRef,
            `section "${section.id}" prose block missing sourceRef`,
          ).toBeTruthy();
        }
      }
    }
  });

  it('every pull-quote block has non-empty content', () => {
    for (const section of HISTORY) {
      for (const block of section.blocks) {
        if (block.type === 'pull-quote') {
          expect(block.content, `section "${section.id}" pull-quote has empty content`).toBeTruthy();
        }
      }
    }
  });

  it('each section has at least one pull-quote block', () => {
    for (const section of HISTORY) {
      const hasPullQuote = section.blocks.some((b) => b.type === 'pull-quote');
      expect(hasPullQuote, `section "${section.id}" has no pull-quote`).toBe(true);
    }
  });

  it('every block has non-empty content', () => {
    for (const section of HISTORY) {
      for (const block of section.blocks) {
        expect(block.content, `section "${section.id}" block has empty content`).toBeTruthy();
      }
    }
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
