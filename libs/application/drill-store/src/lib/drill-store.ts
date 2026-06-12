import { Injectable, Inject, InjectionToken } from '@angular/core';
import type { Signal } from '@angular/core';
import type { DrillScenario } from 'content-schema';
import type { DrillResult } from 'content-schema';
import type { ProgressRepository } from 'domain-progress';
import { PROGRESS_REPO_TOKEN_ID } from 'domain-progress';
import {
  evaluateDrill,
  processAttempt,
  initialAttemptState,
  MAX_DRILL_ATTEMPTS,
} from 'domain-drill';
import type { DrillAnswer, EvaluationResult, DrillAttemptState } from 'domain-drill';
import { SignalStore } from 'application-course-store';

/** Angular DI token for ProgressRepository in the drill store */
export const DRILL_PROGRESS_REPO = new InjectionToken<ProgressRepository>(
  PROGRESS_REPO_TOKEN_ID,
);

interface DrillState {
  scenario: DrillScenario | null;
  moduleId: string | null;
  lastResult: EvaluationResult | null;
  attemptState: DrillAttemptState;
  submitting: boolean;
  error: string | null;
}

const INITIAL_STATE: DrillState = {
  scenario: null,
  moduleId: null,
  lastResult: null,
  attemptState: initialAttemptState(),
  submitting: false,
  error: null,
};

/**
 * DrillStore — manages the active drill scenario, user answers, and attempt tracking.
 *
 * Calls evaluateDrill (pure domain) for evaluation, then delegates persistence
 * to ProgressRepository via the port. No game logic lives here.
 */
@Injectable()
export class DrillStore extends SignalStore<DrillState> {
  // ---- Public selectors ----

  readonly scenario: Signal<DrillScenario | null> = this.select((s) => s.scenario);
  readonly lastResult: Signal<EvaluationResult | null> = this.select((s) => s.lastResult);
  readonly attemptState: Signal<DrillAttemptState> = this.select((s) => s.attemptState);
  readonly submitting: Signal<boolean> = this.select((s) => s.submitting);
  readonly error: Signal<string | null> = this.select((s) => s.error);

  /** True once the user has answered (correct or incorrect) */
  readonly answered: Signal<boolean> = this.select((s) => s.lastResult !== null);

  /** True once the answer is revealed after MAX_DRILL_ATTEMPTS incorrect attempts */
  readonly isRevealed: Signal<boolean> = this.select((s) => s.attemptState.isRevealed);

  /** Number of attempts made on the current scenario */
  readonly attempts: Signal<number> = this.select((s) => s.attemptState.attempts);

  /** Maximum allowed attempts (from domain constant) */
  readonly maxAttempts = MAX_DRILL_ATTEMPTS;

  constructor(
    @Inject(DRILL_PROGRESS_REPO) private readonly progress: ProgressRepository,
  ) {
    super(INITIAL_STATE);
  }

  // ---- Actions ----

  /**
   * Loads a drill scenario into the store, resetting previous state.
   */
  load(scenario: DrillScenario, moduleId: string): void {
    this.patch({
      scenario,
      moduleId,
      lastResult: null,
      attemptState: initialAttemptState(),
      submitting: false,
      error: null,
    });
  }

  /**
   * Submits an answer, evaluates it via the pure domain evaluator,
   * persists the result, and updates attempt state.
   */
  async submit(userAnswer: DrillAnswer): Promise<void> {
    const state = this.attemptState();
    const scenario = this.scenario();

    if (!scenario || state.isRevealed) {
      // No scenario loaded or answer already revealed — no-op
      return;
    }

    this.patch({ submitting: true, error: null });

    try {
      const result = evaluateDrill(scenario, userAnswer);
      const nextAttemptState = processAttempt(state, result);

      this.patch({
        lastResult: result,
        attemptState: nextAttemptState,
        submitting: false,
      });

      // Persist to progress repository if correct or revealed
      if (result.correct || nextAttemptState.isRevealed) {
        const moduleId = this.select((s) => s.moduleId)();
        if (moduleId) {
          const drillResult: DrillResult = {
            answeredCorrectly: result.correct,
            attempts: nextAttemptState.attempts,
            completedAt: new Date().toISOString(),
          };
          await this.progress.setDrillResult(moduleId, scenario.id, drillResult);
        }
      }
    } catch (err) {
      this.patch({ submitting: false, error: String(err) });
    }
  }

  /**
   * Clears the current drill state (call when navigating away).
   */
  clear(): void {
    this.reset(INITIAL_STATE);
  }
}
