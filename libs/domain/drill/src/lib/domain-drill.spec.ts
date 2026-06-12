import { describe, it, expect } from 'vitest';
import type { DrillScenario } from 'content-schema';
import {
  evaluateDrill,
  processAttempt,
  initialAttemptState,
  MAX_DRILL_ATTEMPTS,
  type DrillAnswer,
} from './domain-drill';

// --- Shared fixtures ---

const multipleChoiceScenario: DrillScenario = {
  id: 'drill-mc-1',
  moduleId: 'module-1',
  type: 'multiple-choice',
  questionEs: '¿Cuántos jugadores necesita el juego?',
  choices: [
    { id: 'a', labelEs: 'Uno', isCorrect: false },
    { id: 'b', labelEs: 'Dos', isCorrect: true },
    { id: 'c', labelEs: 'Cuatro', isCorrect: false },
  ],
  correctAnswer: 'b',
  ruleRefs: [{ section: '1.2' }],
  explanationEs: 'El juego es para dos jugadores.',
};

const interactiveSelectScenario: DrillScenario = {
  id: 'drill-is-1',
  moduleId: 'module-4',
  type: 'interactive-select',
  questionEs: '¿Qué unidad recibe el impacto de fuego?',
  boardSnippet: {
    hexes: [
      {
        hexId: 'A1',
        terrain: 'beach',
        sector: 'west',
        isBeachBox: false,
        isGermanPosition: true,
        germanPositionColor: 'red',
        isVPPosition: false,
        fireDots: [{ positionId: 'WN62', intensity: 'intense' }],
      },
      {
        hexId: 'A2',
        terrain: 'slope',
        sector: 'west',
        isBeachBox: false,
        isGermanPosition: false,
        isVPPosition: false,
        fireDots: [],
      },
    ],
    units: [
      {
        kind: 'us',
        id: 'unit-circle',
        type: 'infantry',
        steps: 2,
        targetSymbol: 'circle',
        weapons: ['BZ'],
        attackStrength: 2,
        isDisrupted: false,
        hexId: 'A1',
      },
      {
        kind: 'us',
        id: 'unit-diamond',
        type: 'infantry',
        steps: 2,
        targetSymbol: 'diamond',
        weapons: ['BZ'],
        attackStrength: 2,
        isDisrupted: false,
        hexId: 'A2',
      },
    ],
  },
  fireCard: {
    entries: [{ color: 'red', symbol: 'single', hasArmorBonus: false, hasStar: false }],
    targetSymbol: 'circle',
  },
  // correctAnswer: the unit whose targetSymbol matches the fire card's targetSymbol
  correctAnswer: 'unit-circle',
  ruleRefs: [{ section: '6.3', note: 'Fire resolution — target symbol must match' }],
  explanationEs:
    'La posición roja (simple) dispara. Su símbolo de objetivo es círculo. La unidad con símbolo círculo es el objetivo.',
};

// --- evaluateDrill: multiple-choice ---

describe('evaluateDrill — multiple-choice', () => {
  it('returns correct: true when the chosen option is correct', () => {
    const answer: DrillAnswer = { kind: 'choice', optionId: 'b' };
    const result = evaluateDrill(multipleChoiceScenario, answer);
    expect(result.correct).toBe(true);
    expect(result.correctAnswer).toBe('b');
    expect(result.explanationEs).toBe(multipleChoiceScenario.explanationEs);
    expect(result.ruleRefs).toEqual(multipleChoiceScenario.ruleRefs);
  });

  it('returns correct: false when the chosen option is incorrect', () => {
    const answer: DrillAnswer = { kind: 'choice', optionId: 'a' };
    const result = evaluateDrill(multipleChoiceScenario, answer);
    expect(result.correct).toBe(false);
  });

  it('returns correct: false for another incorrect option', () => {
    const answer: DrillAnswer = { kind: 'choice', optionId: 'c' };
    const result = evaluateDrill(multipleChoiceScenario, answer);
    expect(result.correct).toBe(false);
  });

  it('returns correct: false for a non-existent option ID', () => {
    const answer: DrillAnswer = { kind: 'choice', optionId: 'z' };
    const result = evaluateDrill(multipleChoiceScenario, answer);
    expect(result.correct).toBe(false);
  });

  it('returns correct: false when a board answer is given for a multiple-choice drill', () => {
    const answer: DrillAnswer = { kind: 'board', selectedHexIds: ['A1'] };
    const result = evaluateDrill(multipleChoiceScenario, answer);
    expect(result.correct).toBe(false);
  });
});

// --- evaluateDrill: interactive-select ---

describe('evaluateDrill — interactive-select (board)', () => {
  it('returns correct: true when the selected hex/unit matches correctAnswer', () => {
    const answer: DrillAnswer = { kind: 'board', selectedHexIds: ['unit-circle'] };
    const result = evaluateDrill(interactiveSelectScenario, answer);
    expect(result.correct).toBe(true);
  });

  it('returns correct: false when wrong hex/unit is selected', () => {
    const answer: DrillAnswer = { kind: 'board', selectedHexIds: ['unit-diamond'] };
    const result = evaluateDrill(interactiveSelectScenario, answer);
    expect(result.correct).toBe(false);
  });

  it('returns correct: false when no selection is made', () => {
    const answer: DrillAnswer = { kind: 'board', selectedHexIds: [] };
    const result = evaluateDrill(interactiveSelectScenario, answer);
    expect(result.correct).toBe(false);
  });

  it('returns correct: false when a choice answer is given for an interactive-select drill', () => {
    const answer: DrillAnswer = { kind: 'choice', optionId: 'unit-circle' };
    const result = evaluateDrill(interactiveSelectScenario, answer);
    expect(result.correct).toBe(false);
  });

  it('handles multi-target correctAnswer (comma-separated)', () => {
    const multiTargetScenario: DrillScenario = {
      ...interactiveSelectScenario,
      id: 'drill-multi',
      correctAnswer: 'unit-circle,unit-diamond',
    };

    // correct — both units selected
    const correctAnswer: DrillAnswer = {
      kind: 'board',
      selectedHexIds: ['unit-diamond', 'unit-circle'], // order should not matter
    };
    expect(evaluateDrill(multiTargetScenario, correctAnswer).correct).toBe(true);

    // incorrect — only one unit selected
    const partialAnswer: DrillAnswer = { kind: 'board', selectedHexIds: ['unit-circle'] };
    expect(evaluateDrill(multiTargetScenario, partialAnswer).correct).toBe(false);
  });
});

// --- §6.3 fire resolution acceptance scenario ---

describe('§6.3 fire resolution acceptance scenario', () => {
  /**
   * Scenario from spec / REQ-M4-02:
   * - Position is blue (double symbol)
   * - US unit has ▲ (triangle) target symbol
   * - Fire card shows: red (single) + blue (double); target symbol = triangle
   *
   * The blue position fires (its symbol appears on the fire card).
   * The fire card's targetSymbol is triangle, so the unit with triangle target symbol is hit.
   * Correct answer: select the unit with triangle target symbol.
   */
  const fireResolutionScenario: DrillScenario = {
    id: 'drill-fire-res-1',
    moduleId: 'module-4',
    type: 'interactive-select',
    questionEs: '¿Qué unidad estadounidense resulta impactada por el fuego alemán?',
    boardSnippet: {
      hexes: [
        {
          hexId: 'B3',
          terrain: 'bluff',
          sector: 'east',
          isBeachBox: false,
          isGermanPosition: true,
          germanPositionColor: 'blue',
          isVPPosition: true,
          fireDots: [{ positionId: 'WN-blue', intensity: 'steady' }],
        },
        {
          hexId: 'B4',
          terrain: 'beach',
          sector: 'east',
          isBeachBox: true,
          isGermanPosition: false,
          isVPPosition: false,
          fireDots: [],
        },
        {
          hexId: 'B5',
          terrain: 'beach',
          sector: 'east',
          isBeachBox: true,
          isGermanPosition: false,
          isVPPosition: false,
          fireDots: [],
        },
      ],
      units: [
        {
          kind: 'us',
          id: 'unit-triangle',
          type: 'ranger',
          steps: 2,
          targetSymbol: 'triangle',
          weapons: ['BZ', 'BR'],
          attackStrength: 3,
          isDisrupted: false,
          hexId: 'B4',
        },
        {
          kind: 'us',
          id: 'unit-circle-2',
          type: 'infantry',
          steps: 2,
          targetSymbol: 'circle',
          weapons: ['BZ'],
          attackStrength: 2,
          isDisrupted: false,
          hexId: 'B5',
        },
      ],
    },
    fireCard: {
      // Red (single) and blue (double) positions fire this phase
      entries: [
        { color: 'red', symbol: 'single', hasArmorBonus: false, hasStar: false },
        { color: 'blue', symbol: 'double', hasArmorBonus: false, hasStar: false },
      ],
      // Fire card's target symbol is triangle — unit with triangle is hit
      targetSymbol: 'triangle',
    },
    // The unit with triangle target symbol is the correct hit
    correctAnswer: 'unit-triangle',
    ruleRefs: [
      { section: '6.3', note: 'Fire resolution: fire card target symbol must match unit symbol' },
      { section: '6.31', note: 'Hit limits per WN per phase' },
    ],
    explanationEs:
      'La posición azul (doble) dispara. La ficha de fuego muestra símbolo triángulo como objetivo. La unidad rangers con símbolo triángulo es impactada.',
  };

  it('correctly identifies the triangle-symbol unit as the hit (§6.3)', () => {
    const answer: DrillAnswer = { kind: 'board', selectedHexIds: ['unit-triangle'] };
    const result = evaluateDrill(fireResolutionScenario, answer);
    expect(result.correct).toBe(true);
    expect(result.ruleRefs.some((r) => r.section === '6.3')).toBe(true);
    expect(result.ruleRefs.some((r) => r.section === '6.31')).toBe(true);
  });

  it('returns incorrect when the circle-symbol unit is selected instead', () => {
    const answer: DrillAnswer = { kind: 'board', selectedHexIds: ['unit-circle-2'] };
    const result = evaluateDrill(fireResolutionScenario, answer);
    expect(result.correct).toBe(false);
    expect(result.correctAnswer).toBe('unit-triangle');
  });

  it('always returns the Spanish explanation and rule refs regardless of correctness', () => {
    const wrongAnswer: DrillAnswer = { kind: 'board', selectedHexIds: ['unit-circle-2'] };
    const result = evaluateDrill(fireResolutionScenario, wrongAnswer);
    expect(result.explanationEs).toBe(fireResolutionScenario.explanationEs);
    expect(result.ruleRefs).toEqual(fireResolutionScenario.ruleRefs);
  });
});

// --- processAttempt: 3-attempt reveal logic ---

describe('processAttempt — attempt tracking', () => {
  const incorrectResult = {
    correct: false,
    correctAnswer: 'b',
    explanationEs: 'Explicación.',
    ruleRefs: [],
  };

  const correctResult = {
    correct: true,
    correctAnswer: 'b',
    explanationEs: 'Explicación.',
    ruleRefs: [],
  };

  it('starts with 0 attempts, not revealed, no last result', () => {
    const state = initialAttemptState();
    expect(state.attempts).toBe(0);
    expect(state.isRevealed).toBe(false);
    expect(state.lastResult).toBeNull();
  });

  it('increments attempt count on first incorrect answer', () => {
    const state = initialAttemptState();
    const next = processAttempt(state, incorrectResult);
    expect(next.attempts).toBe(1);
    expect(next.isRevealed).toBe(false);
    expect(next.lastResult?.correct).toBe(false);
  });

  it('increments attempt count on second incorrect answer', () => {
    let state = initialAttemptState();
    state = processAttempt(state, incorrectResult);
    state = processAttempt(state, incorrectResult);
    expect(state.attempts).toBe(2);
    expect(state.isRevealed).toBe(false);
  });

  it(`reveals the correct answer on ${MAX_DRILL_ATTEMPTS}rd incorrect attempt`, () => {
    let state = initialAttemptState();
    for (let i = 0; i < MAX_DRILL_ATTEMPTS; i++) {
      state = processAttempt(state, incorrectResult);
    }
    expect(state.attempts).toBe(MAX_DRILL_ATTEMPTS);
    expect(state.isRevealed).toBe(true);
  });

  it('does not process further attempts once revealed', () => {
    let state = initialAttemptState();
    for (let i = 0; i < MAX_DRILL_ATTEMPTS; i++) {
      state = processAttempt(state, incorrectResult);
    }
    const before = state;
    const after = processAttempt(state, incorrectResult);
    expect(after).toEqual(before); // state unchanged
  });

  it('does not reveal on correct answer even if previous attempts were wrong', () => {
    let state = initialAttemptState();
    state = processAttempt(state, incorrectResult); // attempt 1
    state = processAttempt(state, incorrectResult); // attempt 2
    state = processAttempt(state, correctResult); // attempt 3 but correct
    expect(state.isRevealed).toBe(false);
    expect(state.lastResult?.correct).toBe(true);
  });

  it('MAX_DRILL_ATTEMPTS is 3', () => {
    expect(MAX_DRILL_ATTEMPTS).toBe(3);
  });
});
