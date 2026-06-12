import type { DrillScenario, RuleRef } from 'content-schema';

// Maximum attempts before the correct answer is revealed
export const MAX_DRILL_ATTEMPTS = 3;

// Discriminated union for user answers
export type DrillAnswer =
  | { kind: 'choice'; optionId: string }
  | { kind: 'board'; selectedHexIds: string[] };

// Result returned by evaluateDrill
export interface EvaluationResult {
  correct: boolean;
  correctAnswer: string;
  explanationEs: string;
  ruleRefs: RuleRef[];
}

/**
 * Pure drill evaluator — no DOM, no Angular, no Nest dependencies.
 *
 * Handles:
 * - multiple-choice: compares optionId against DrillScenario.correctAnswer
 * - interactive-select: compares sorted selectedHexIds against correctAnswer
 *   (correctAnswer is a comma-separated list of hex/unit IDs)
 *
 * The caller is responsible for tracking attempts and revealing answers
 * after MAX_DRILL_ATTEMPTS incorrect answers (see DrillAttemptState).
 */
export function evaluateDrill(scenario: DrillScenario, userAnswer: DrillAnswer): EvaluationResult {
  const result: Omit<EvaluationResult, 'correct'> = {
    correctAnswer: scenario.correctAnswer,
    explanationEs: scenario.explanationEs,
    ruleRefs: scenario.ruleRefs,
  };

  if (scenario.type === 'multiple-choice') {
    return evaluateMultipleChoice(scenario, userAnswer, result);
  }

  if (scenario.type === 'interactive-select') {
    return evaluateInteractiveSelect(scenario, userAnswer, result);
  }

  // Exhaustive check — should never reach here with correct types
  const _exhaustive: never = scenario.type;
  throw new Error(`Unknown drill type: ${_exhaustive}`);
}

function evaluateMultipleChoice(
  scenario: DrillScenario,
  userAnswer: DrillAnswer,
  base: Omit<EvaluationResult, 'correct'>,
): EvaluationResult {
  if (userAnswer.kind !== 'choice') {
    // Wrong answer kind for this drill type — treat as incorrect
    return { ...base, correct: false };
  }

  // Validate the chosen option exists in the choices array
  const chosenOption = scenario.choices?.find((c) => c.id === userAnswer.optionId);
  if (!chosenOption) {
    return { ...base, correct: false };
  }

  return { ...base, correct: chosenOption.isCorrect };
}

function evaluateInteractiveSelect(
  scenario: DrillScenario,
  userAnswer: DrillAnswer,
  base: Omit<EvaluationResult, 'correct'>,
): EvaluationResult {
  if (userAnswer.kind !== 'board') {
    // Wrong answer kind for this drill type — treat as incorrect
    return { ...base, correct: false };
  }

  // correctAnswer is a single hex/unit ID for single-target scenarios,
  // or a comma-separated list for multi-target scenarios.
  const expectedIds = parseCorrectAnswerIds(scenario.correctAnswer);
  const selectedIds = [...userAnswer.selectedHexIds].sort();

  const correct = arraysEqual(expectedIds, selectedIds);
  return { ...base, correct };
}

function parseCorrectAnswerIds(correctAnswer: string): string[] {
  return correctAnswer
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .sort();
}

function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((val, idx) => val === b[idx]);
}

// ---- Attempt tracking (pure state, no side effects) ----

export interface DrillAttemptState {
  attempts: number;
  isRevealed: boolean;
  lastResult: EvaluationResult | null;
}

export function initialAttemptState(): DrillAttemptState {
  return { attempts: 0, isRevealed: false, lastResult: null };
}

/**
 * Processes a user answer and returns the updated attempt state.
 * After MAX_DRILL_ATTEMPTS incorrect answers, isRevealed becomes true.
 */
export function processAttempt(
  state: DrillAttemptState,
  result: EvaluationResult,
): DrillAttemptState {
  if (state.isRevealed) {
    // No more attempts allowed once the answer has been revealed
    return state;
  }

  const newAttempts = state.attempts + 1;
  const shouldReveal = !result.correct && newAttempts >= MAX_DRILL_ATTEMPTS;

  return {
    attempts: newAttempts,
    isRevealed: shouldReveal,
    lastResult: result,
  };
}
