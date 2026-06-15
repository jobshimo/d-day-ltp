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
    <div class="screen wrap section">

      <!-- ------------------------------------------------------------------ -->
      <!-- HEADER                                                               -->
      <!-- ------------------------------------------------------------------ -->
      <div class="sechead">
        <div class="sechead__body">
          <span class="eyebrow">Orden de operaciones</span>
          <h1 class="sechead__t preparacion__title">Preparación del tablero</h1>
        </div>
        <div class="sechead__meta">
          <span class="kicker">ANTES DEL TURNO 1</span>
          <span class="kicker">{{ checkedCount() }}/{{ totalSteps() }} PASOS</span>
        </div>
      </div>

      <p class="lede prep-lede">
        Sigue la secuencia para dejar la partida lista. Primero se configuran
        los alemanes —de forma aleatoria, para que nunca sepas qué WN es más
        fuerte— y después se despliega EE.UU. en el registro de turnos.
      </p>

      <!-- Mode toggle -->
      <div class="prep-toggle" role="group" aria-label="Modo de visualización">
        <button
          type="button"
          class="btn btn--sm mode-btn"
          [class.btn--primary]="mode() === 'learn'"
          [class.btn--secondary]="mode() !== 'learn'"
          [class.mode-btn--active]="mode() === 'learn'"
          [attr.aria-pressed]="mode() === 'learn'"
          (click)="setMode('learn')">
          Aprender
        </button>
        <button
          type="button"
          class="btn btn--sm mode-btn"
          [class.btn--primary]="mode() === 'play'"
          [class.btn--secondary]="mode() !== 'play'"
          [class.mode-btn--active]="mode() === 'play'"
          [attr.aria-pressed]="mode() === 'play'"
          (click)="setMode('play')">
          Preparar
        </button>
      </div>

      <!-- ------------------------------------------------------------------ -->
      <!-- LEARN MODE: step-by-step stepper                                    -->
      <!-- ------------------------------------------------------------------ -->
      @if (mode() === 'learn') {
        <section class="prep-stepper preparacion__stepper" aria-label="Guía paso a paso">

          <!-- Group context label -->
          <span class="eyebrow" aria-live="polite">{{ currentGroupTitle() }}</span>

          <!-- Step card -->
          <div
            class="card prep-step-card"
            role="region"
            [attr.aria-label]="'Paso ' + (currentStepIndex() + 1) + ' de ' + totalSteps()">

            <!-- Progress header -->
            <div class="prep-step-header">
              <span class="kicker step-label" style="color:var(--accent)">
                Paso {{ currentStepIndex() + 1 }} de {{ totalSteps() }}
              </span>
              <div class="prep-dots" aria-hidden="true">
                @for (i of stepRange(); track i) {
                  <div
                    class="prep-dot step-dot"
                    [class.prep-dot--active]="i === currentStepIndex()"
                    [class.prep-dot--done]="i < currentStepIndex()">
                  </div>
                }
              </div>
            </div>

            <!-- Step content -->
            <h2 class="serif prep-step-title step-title">{{ currentStep()?.titleEs }}</h2>
            <p class="step-body">{{ currentStep()?.bodyEs }}</p>

            <!-- Optional counter visual -->
            @if (currentStep()?.pieceExample; as ex) {
              <figure class="prep-counter" aria-label="Ejemplo de ficha">
                <ddob-counter
                  [unit]="ex.unit"
                  [side]="ex.side"
                  [size]="ex.size ?? 80"
                  [annotated]="ex.annotated ?? false" />
              </figure>
            }

            <!-- Optional rule reference chip -->
            @if (currentStep()?.ruleRef; as ref) {
              <span class="rule-chip" [attr.aria-label]="'Referencia de regla ' + ref">
                {{ ref }}
              </span>
            }
          </div>

          <!-- Navigation -->
          <div class="prep-stepper-nav">
            <button
              type="button"
              class="btn btn--ghost"
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
        <section class="prep-checklist preparacion__checklist" aria-label="Lista de preparación">

          <!-- Sticky progress bar -->
          <div class="prep-progress-bar">
            <div class="prep-progress-bar__top">
              <span class="stencil prep-pct">{{ checkedPct() }}% LISTO</span>
              @if (checkedCount() > 0) {
                <span
                  class="kicker prep-reset"
                  role="button"
                  tabindex="0"
                  (click)="resetChecklist()"
                  (keydown.enter)="resetChecklist()"
                  (keydown.space)="resetChecklist()"
                  aria-label="Reiniciar lista de preparación">
                  Reiniciar
                </span>
              }
            </div>
            <div class="prep-track">
              <div class="prep-track__fill" [style.width.%]="checkedPct()"></div>
            </div>
          </div>

          @for (group of groups; track group.id) {
            <section
              class="prep-group"
              [id]="'group-' + group.id"
              [attr.aria-labelledby]="'group-heading-' + group.id">

              <!-- Group heading row -->
              <div class="prep-group__head">
                <div class="prep-group__letter display">
                  {{ group.id.toUpperCase() }}
                </div>
                <h2 class="display prep-group__title checklist__group-title"
                    [id]="'group-heading-' + group.id">
                  {{ group.titleEs }}
                </h2>
              </div>

              <!-- Steps -->
              <ul class="prep-steps" role="list">
                @for (step of group.steps; track step.id) {
                  <li
                    class="card prep-item"
                    [class.prep-item--checked]="isChecked(step.id)"
                    role="checkbox"
                    [attr.aria-checked]="isChecked(step.id)"
                    [attr.aria-label]="step.checklistLabelEs ?? step.titleEs"
                    tabindex="0"
                    (click)="toggleStep(step.id)"
                    (keydown.enter)="toggleStep(step.id)"
                    (keydown.space)="toggleStep(step.id)">

                    <!-- Custom checkbox box -->
                    <div
                      class="prep-checkbox checklist__checkbox"
                      [class.prep-checkbox--checked]="isChecked(step.id)"
                      aria-hidden="true">
                      @if (isChecked(step.id)) { ✓ }
                    </div>

                    <!-- Step body -->
                    <div class="prep-item__body">
                      <div class="prep-item__top">
                        <span class="serif prep-item__title">
                          {{ step.checklistLabelEs ?? step.titleEs }}
                        </span>
                        @if (step.ruleRef) {
                          <span class="rule-chip" aria-hidden="true">
                            {{ step.ruleRef }}
                          </span>
                        }
                      </div>
                      @if (step.bodyEs) {
                        <p class="step-body prep-item__desc">{{ step.bodyEs }}</p>
                      }
                    </div>
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
    /* ---- Layout ---- */
    .prep-lede {
      max-width: 60ch;
      margin-top: 20px;
      margin-bottom: 32px;
    }

    /* ---- Mode toggle ---- */
    .prep-toggle {
      display: inline-flex;
      gap: 8px;
      margin-bottom: 40px;
    }

    /* ---- LEARN MODE ---- */
    .prep-stepper {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .prep-step-card {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .prep-step-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .prep-dots {
      display: flex;
      gap: 6px;
      align-items: center;
    }

    .prep-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--steel);
      transition: background 150ms;
    }

    .prep-dot--active { background: var(--accent); }
    .prep-dot--done   { background: var(--accent); opacity: .5; }

    .prep-step-title {
      font-size: 22px;
      color: var(--bone);
      margin: 0;
    }

    .step-body {
      font-size: 14.5px;
      color: var(--sand);
      line-height: 1.65;
      margin: 0;
    }

    .prep-counter {
      display: flex;
      justify-content: center;
      margin: 4px 0;
    }

    .prep-stepper-nav {
      display: flex;
      gap: 12px;
      justify-content: space-between;
    }

    /* ---- PLAY MODE: sticky progress bar ---- */
    .prep-progress-bar {
      position: sticky;
      top: var(--nav-h);
      z-index: 50;
      background: var(--ink);
      padding: 14px 0 16px;
      margin-bottom: 32px;
    }

    .prep-progress-bar__top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .prep-pct {
      color: var(--accent);
      font-weight: 600;
      font-size: 12px;
    }

    .prep-reset {
      cursor: pointer;
      color: var(--muted);
      transition: color 150ms;
    }

    .prep-reset:hover { color: var(--bone); }

    .prep-track {
      height: 4px;
      background: var(--steel);
      border-radius: 2px;
      overflow: hidden;
    }

    .prep-track__fill {
      height: 100%;
      background: var(--accent);
      border-radius: 2px;
      transition: width 250ms ease;
    }

    /* ---- PLAY MODE: groups ---- */
    .prep-checklist {
      display: flex;
      flex-direction: column;
      gap: 48px;
    }

    .prep-group {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .prep-group__head {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 4px;
    }

    .prep-group__letter {
      width: 46px;
      height: 46px;
      border: 1.5px solid var(--accent);
      color: var(--accent);
      display: grid;
      place-items: center;
      font-size: 30px;
      flex-shrink: 0;
    }

    .prep-group__title {
      font-size: 24px;
      color: var(--bone);
      margin: 0;
    }

    /* ---- PLAY MODE: step items ---- */
    .prep-steps {
      display: flex;
      flex-direction: column;
      gap: 10px;
      list-style: none;
      padding-left: 62px;
      margin: 0;
    }

    .prep-item {
      display: flex;
      gap: 16px;
      align-items: flex-start;
      padding: 18px 20px;
      cursor: pointer;
      transition: border-color 150ms, background 150ms;
    }

    .prep-item--checked {
      border-color: rgba(226, 163, 61, .4);
      background: var(--char-2);
    }

    .prep-item--checked .prep-item__title {
      color: var(--muted);
      text-decoration: line-through;
    }

    .prep-item--checked .prep-item__desc {
      opacity: .6;
    }

    /* Custom checkbox */
    .prep-checkbox {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      border: 1.5px solid var(--line-strong);
      border-radius: 3px;
      display: grid;
      place-items: center;
      font-size: 13px;
      color: #190f02;
      transition: background 150ms, border-color 150ms;
    }

    .prep-checkbox--checked {
      background: var(--accent);
      border-color: var(--accent);
    }

    /* Item body */
    .prep-item__body {
      display: flex;
      flex-direction: column;
      gap: 6px;
      flex: 1;
    }

    .prep-item__top {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }

    .prep-item__title {
      font-size: 18px;
      color: var(--bone);
    }

    .prep-item__desc {
      font-size: 14.5px;
      color: var(--muted);
      margin: 0;
    }

    /* ---- Responsive ---- */
    @media (max-width: 480px) {
      .prep-dots { display: none; }

      .prep-steps { padding-left: 0; }

      .prep-group__head { flex-wrap: wrap; }
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

  /** Percentage of checked steps (0–100, integer). */
  readonly checkedPct = computed<number>(() =>
    this.totalSteps() === 0
      ? 0
      : Math.round((this.checkedCount() / this.totalSteps()) * 100),
  );

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
