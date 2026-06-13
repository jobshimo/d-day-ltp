import {
  Component,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CounterComponent } from 'counter';
import { SETUP_GUIDE } from 'content';
import type { SetupStep, SetupStepGroup } from 'content';

/**
 * PreparacionComponent — interactive setup guide for D-Day at Omaha Beach.
 *
 * Dual-mode page at /preparacion (ungated — no canActivate guard):
 *   - **Aprender**: step-by-step stepper mirroring the worked-example pattern
 *     in LessonViewerComponent. Shows one step at a time with progress dots,
 *     Anterior / Siguiente navigation, and optional counter visuals.
 *   - **Preparar**: grouped checklist of all steps with checkboxes for
 *     table-companion use. State is ephemeral (component-level signal, not
 *     persisted to IndexedDB). A "Reiniciar" button clears all checks.
 *
 * No ProgressRepository coupling — this page is stateless beyond the toggle
 * and the ephemeral checklist.
 */
@Component({
  standalone: true,
  selector: 'app-preparacion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CounterComponent],
  template: `
    <div class="preparacion">
      <header class="preparacion__header">
        <h1 class="preparacion__title">Preparación de la partida</h1>
        <p class="preparacion__intro">
          Guía paso a paso para preparar <em>D-Day en Omaha Beach</em>
          antes de tu primera tirada. Basada en la sección §3 del reglamento.
        </p>

        <!-- Mode toggle -->
        <div class="preparacion__mode-toggle" role="group" aria-label="Modo de visualización">
          <button
            type="button"
            class="mode-btn"
            [class.mode-btn--active]="mode() === 'learn'"
            [attr.aria-pressed]="mode() === 'learn'"
            (click)="setMode('learn')">
            Aprender
          </button>
          <button
            type="button"
            class="mode-btn"
            [class.mode-btn--active]="mode() === 'play'"
            [attr.aria-pressed]="mode() === 'play'"
            (click)="setMode('play')">
            Preparar
          </button>
        </div>
      </header>

      <!-- ------------------------------------------------------------------ -->
      <!-- LEARN MODE: step-by-step stepper                                    -->
      <!-- ------------------------------------------------------------------ -->
      @if (mode() === 'learn') {
        <section class="preparacion__stepper" aria-label="Guía paso a paso">

          <!-- Group context label -->
          <div class="stepper__group-label" aria-live="polite">
            {{ currentGroupTitle() }}
          </div>

          <!-- Step card -->
          <div
            class="stepper__step"
            role="region"
            [attr.aria-label]="'Paso ' + (currentStepIndex() + 1) + ' de ' + totalSteps()">

            <!-- Progress header -->
            <div class="step-header">
              <span class="step-label">
                Paso {{ currentStepIndex() + 1 }} de {{ totalSteps() }}
              </span>
              <div class="step-progress" aria-hidden="true">
                @for (i of stepRange(); track i) {
                  <div
                    class="step-dot"
                    [class.step-dot--active]="i === currentStepIndex()"
                    [class.step-dot--done]="i < currentStepIndex()">
                  </div>
                }
              </div>
            </div>

            <!-- Step content -->
            <h2 class="step-title">{{ currentStep()?.titleEs }}</h2>
            <p class="step-body">{{ currentStep()?.bodyEs }}</p>

            <!-- Optional counter visual -->
            @if (currentStep()?.pieceExample; as ex) {
              <figure class="step-counter" aria-label="Ejemplo de ficha">
                <ddob-counter
                  [unit]="ex.unit"
                  [side]="ex.side"
                  [size]="ex.size ?? 80"
                  [annotated]="ex.annotated ?? false" />
              </figure>
            }

            <!-- Optional rule reference chip -->
            @if (currentStep()?.ruleRef; as ref) {
              <span class="step-rule-ref" [attr.aria-label]="'Referencia de regla ' + ref">
                {{ ref }}
              </span>
            }
          </div>

          <!-- Navigation -->
          <div class="stepper__nav">
            <button
              type="button"
              class="btn btn--secondary"
              [disabled]="currentStepIndex() === 0"
              (click)="prevStep()"
              aria-label="Paso anterior">
              ← Anterior
            </button>

            <button
              type="button"
              class="btn btn--primary"
              [disabled]="currentStepIndex() === totalSteps() - 1"
              (click)="nextStep()"
              aria-label="Siguiente paso">
              Siguiente →
            </button>
          </div>
        </section>
      }

      <!-- ------------------------------------------------------------------ -->
      <!-- PLAY MODE: grouped checklist                                         -->
      <!-- ------------------------------------------------------------------ -->
      @if (mode() === 'play') {
        <section class="preparacion__checklist" aria-label="Lista de preparación">

          <div class="checklist__actions">
            <span class="checklist__progress" aria-live="polite">
              {{ checkedCount() }} / {{ totalSteps() }} pasos completados
            </span>
            <button
              type="button"
              class="btn btn--secondary btn--sm"
              (click)="resetChecklist()"
              aria-label="Reiniciar lista de preparación">
              Reiniciar
            </button>
          </div>

          @for (group of groups; track group.id) {
            <section
              class="checklist__group"
              [id]="'group-' + group.id"
              [attr.aria-labelledby]="'group-heading-' + group.id">

              <h2
                class="checklist__group-title"
                [id]="'group-heading-' + group.id">
                {{ group.titleEs }}
              </h2>

              <ul class="checklist__steps" role="list">
                @for (step of group.steps; track step.id) {
                  <li class="checklist__item">
                    <label
                      class="checklist__label"
                      [for]="'step-' + step.id"
                      [class.checklist__label--checked]="isChecked(step.id)">
                      <input
                        type="checkbox"
                        class="checklist__checkbox"
                        [id]="'step-' + step.id"
                        [checked]="isChecked(step.id)"
                        (change)="toggleStep(step.id)"
                        [attr.aria-label]="step.checklistLabelEs ?? step.titleEs" />
                      <span class="checklist__text">
                        {{ step.checklistLabelEs ?? step.titleEs }}
                      </span>
                    </label>

                    @if (step.ruleRef) {
                      <span class="checklist__rule-ref" aria-hidden="true">
                        {{ step.ruleRef }}
                      </span>
                    }
                  </li>
                }
              </ul>
            </section>
          }
        </section>
      }
    </div>
  `,
  styles: [`
    .preparacion {
      max-width: var(--max-content-width);
      margin: 0 auto;
      padding: var(--space-8) var(--space-4);
    }

    /* ---- Header ---- */
    .preparacion__header {
      margin-bottom: var(--space-8);
    }

    .preparacion__title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      letter-spacing: -0.02em;
      margin-bottom: var(--space-3);
    }

    .preparacion__intro {
      font-size: var(--font-size-base);
      color: var(--color-text-secondary);
      line-height: var(--line-height-normal);
      max-width: 68ch;
      margin-bottom: var(--space-6);
    }

    /* ---- Mode toggle ---- */
    .preparacion__mode-toggle {
      display: inline-flex;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      overflow: hidden;
    }

    .mode-btn {
      padding: var(--space-2) var(--space-5);
      border: none;
      background: transparent;
      color: var(--color-text-secondary);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      cursor: pointer;
      transition: background var(--transition-fast), color var(--transition-fast);

      &:hover:not(.mode-btn--active) {
        background: var(--color-surface-alt);
        color: var(--color-text-primary);
      }

      &:focus-visible {
        outline: 2px solid var(--color-accent);
        outline-offset: -2px;
      }
    }

    .mode-btn--active {
      background: var(--color-accent);
      color: var(--color-bg);
    }

    /* ---- Stepper ---- */
    .preparacion__stepper {
      display: flex;
      flex-direction: column;
      gap: var(--space-5);
    }

    .stepper__group-label {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--color-accent);
    }

    .stepper__step {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: var(--space-6);
    }

    .step-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--space-4);
    }

    .step-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-accent);
    }

    .step-progress {
      display: flex;
      gap: var(--space-1);
      align-items: center;
    }

    .step-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--color-border);
      transition: background var(--transition-fast);
    }

    .step-dot--active { background: var(--color-accent); }
    .step-dot--done   { background: var(--color-success); }

    .step-title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      margin-bottom: var(--space-3);
    }

    .step-body {
      font-size: var(--font-size-base);
      color: var(--color-text-primary);
      line-height: var(--line-height-relaxed);
      margin-bottom: var(--space-4);
    }

    .step-counter {
      display: flex;
      justify-content: center;
      margin-bottom: var(--space-4);
    }

    .step-rule-ref {
      display: inline-block;
      font-size: var(--font-size-xs, 0.75rem);
      color: var(--color-accent);
      border: 1px solid var(--color-accent);
      border-radius: var(--radius-sm);
      padding: 0 var(--space-1);
      font-family: var(--font-family-mono, monospace);
      opacity: 0.8;
    }

    .stepper__nav {
      display: flex;
      gap: var(--space-3);
      justify-content: space-between;
    }

    /* ---- Checklist ---- */
    .preparacion__checklist {
      display: flex;
      flex-direction: column;
      gap: var(--space-8);
    }

    .checklist__actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--space-2);
    }

    .checklist__progress {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
    }

    .checklist__group {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .checklist__group-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      border-bottom: 1px solid var(--color-border);
      padding-bottom: var(--space-2);
    }

    .checklist__steps {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .checklist__item {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .checklist__label {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      cursor: pointer;
      flex: 1;
      padding: var(--space-3) var(--space-4);
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      transition: background var(--transition-fast), border-color var(--transition-fast);

      &:hover {
        background: var(--color-surface-alt);
      }
    }

    .checklist__label--checked {
      background: var(--color-surface-alt);
      border-color: var(--color-success);
      opacity: 0.75;

      .checklist__text {
        text-decoration: line-through;
        color: var(--color-text-secondary);
      }
    }

    .checklist__checkbox {
      flex-shrink: 0;
      width: 18px;
      height: 18px;
      accent-color: var(--color-success);
      cursor: pointer;
    }

    .checklist__text {
      font-size: var(--font-size-base);
      color: var(--color-text-primary);
      line-height: var(--line-height-normal);
    }

    .checklist__rule-ref {
      font-size: var(--font-size-xs, 0.75rem);
      color: var(--color-accent);
      border: 1px solid var(--color-accent);
      border-radius: var(--radius-sm);
      padding: 0 var(--space-1);
      font-family: var(--font-family-mono, monospace);
      opacity: 0.8;
      white-space: nowrap;
    }

    /* ---- Shared buttons ---- */
    .btn {
      display: inline-flex;
      align-items: center;
      padding: var(--space-2) var(--space-5);
      border: none;
      border-radius: var(--radius-md);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      cursor: pointer;
      transition: background var(--transition-fast), transform var(--transition-fast);

      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
        transform: none !important;
      }

      &:focus-visible {
        outline: 2px solid var(--color-accent);
        outline-offset: 3px;
      }
    }

    .btn--primary {
      background: var(--color-accent);
      color: var(--color-bg);

      &:hover:not(:disabled) {
        background: #d4b060;
        transform: translateY(-1px);
      }
    }

    .btn--secondary {
      background: var(--color-surface-alt);
      color: var(--color-text-primary);
      border: 1px solid var(--color-border);

      &:hover:not(:disabled) {
        background: var(--color-border);
      }
    }

    .btn--sm {
      padding: var(--space-1) var(--space-3);
      font-size: var(--font-size-sm);
    }

    /* ---- Responsive ---- */
    @media (max-width: 480px) {
      .step-progress {
        display: none;
      }

      .checklist__actions {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-2);
      }
    }
  `],
})
export class PreparacionComponent {
  /** All setup guide groups, sourced from the content lib. */
  readonly groups: SetupStepGroup[] = SETUP_GUIDE;

  // ---- Flat step list for the stepper ----
  private readonly allSteps: SetupStep[] = SETUP_GUIDE.flatMap((g) => g.steps);

  /** Current display mode. */
  readonly mode = signal<'learn' | 'play'>('learn');

  /** Zero-based index of the currently shown step in learn mode. */
  readonly currentStepIndex = signal<number>(0);

  /** Total number of steps across all groups. */
  readonly totalSteps = computed<number>(() => this.allSteps.length);

  /** Numeric range [0..N-1] used to render progress dots. */
  readonly stepRange = computed<number[]>(() =>
    Array.from({ length: this.totalSteps() }, (_, i) => i),
  );

  /** The step object at the current index. */
  readonly currentStep = computed<SetupStep | null>(
    () => this.allSteps[this.currentStepIndex()] ?? null,
  );

  /** Title of the group the current step belongs to. */
  readonly currentGroupTitle = computed<string>(() => {
    const step = this.currentStep();
    if (!step) return '';
    return this.groups.find((g) => g.id === step.groupId)?.titleEs ?? '';
  });

  // ---- Checklist state (ephemeral — not persisted) ----

  /** Set of checked step ids in play mode. */
  readonly checkedSteps = signal<Set<string>>(new Set<string>());

  /** Number of checked steps. */
  readonly checkedCount = computed<number>(() => this.checkedSteps().size);

  // ---- Mode toggle ----

  setMode(m: 'learn' | 'play'): void {
    this.mode.set(m);
  }

  // ---- Stepper navigation ----

  nextStep(): void {
    if (this.currentStepIndex() < this.totalSteps() - 1) {
      this.currentStepIndex.update((i) => i + 1);
    }
  }

  prevStep(): void {
    if (this.currentStepIndex() > 0) {
      this.currentStepIndex.update((i) => i - 1);
    }
  }

  // ---- Checklist helpers ----

  isChecked(stepId: string): boolean {
    return this.checkedSteps().has(stepId);
  }

  toggleStep(stepId: string): void {
    this.checkedSteps.update((prev) => {
      const next = new Set(prev);
      if (next.has(stepId)) {
        next.delete(stepId);
      } else {
        next.add(stepId);
      }
      return next;
    });
  }

  resetChecklist(): void {
    this.checkedSteps.set(new Set<string>());
  }
}

// Re-export for the lazy route
export default PreparacionComponent;
