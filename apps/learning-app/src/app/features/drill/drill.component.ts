import {
  Component,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DrillStore } from 'application-drill-store';
import { ALL_MODULES } from 'content';
import type { DrillScenario, DrillChoice } from 'content-schema';
import { shuffleWithSeed } from 'domain-drill';
import type { DrillAnswer } from 'domain-drill';
import { BreadcrumbComponent } from '../../shared/breadcrumb.component';
import type { BreadcrumbItem } from '../../shared/breadcrumb.component';
import { RuleRefChipComponent } from '../lesson/rule-ref-chip.component';
import { BoardSnippetComponent } from 'ui-board-renderer';

@Component({
  standalone: true,
  selector: 'app-drill',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, BreadcrumbComponent, RuleRefChipComponent, BoardSnippetComponent],
  providers: [DrillStore],
  template: `
    <div class="screen wrap" style="padding-bottom:90px">
      <app-breadcrumb [items]="breadcrumbs()" />

      @if (drill()) {
        <article class="drill__article" aria-labelledby="drill-question">
          <header class="drill__header">
            <span class="kicker drill__progress-label">
              Ejercicio {{ drillIndex() + 1 }} de {{ totalDrills() }}
            </span>
            <div class="drill__progress-bar"
                 role="progressbar"
                 [attr.aria-valuenow]="drillIndex() + 1"
                 [attr.aria-valuemax]="totalDrills()"
                 aria-valuemin="1">
              <div class="drill__progress-fill"
                   [style.width.%]="progressPercent()"></div>
            </div>
          </header>

          <!-- Question -->
          <div class="drill__question-section">
            <p id="drill-question" class="serif drill__question">
              {{ drill()!.questionEs }}
            </p>

            <!-- Attempt indicator -->
            @if (store.attempts() > 0 && !resolved()) {
              <p class="kicker drill__attempts"
                 role="status"
                 aria-live="polite">
                Intento {{ store.attempts() }} de {{ store.maxAttempts }}
                @if (store.attempts() >= store.maxAttempts - 1) {
                  — <strong>último intento</strong>
                }
              </p>
            }
          </div>

          <!-- Board snippet (shown for interactive-select drills) -->
          @if (drill()!.boardSnippet) {
            <div class="card drill__board-section">
              <ddob-board-snippet
                [snippet]="boardSnippetWithHighlights()"
                [interactive]="drill()!.type === 'interactive-select' && !resolved()"
                [selectedHexIds]="selectedUnitHexIds()"
                (hexSelected)="onBoardHexSelected($event)" />

              @if (drill()!.type === 'interactive-select' && !resolved()) {
                <p class="drill__board-hint" role="note">
                  Selecciona la(s) unidad(es) afectadas en el tablero.
                  @if (selectedUnitIds().length > 0) {
                    <span class="drill__selected-count">
                      {{ selectedUnitIds().length }} unidad{{ selectedUnitIds().length !== 1 ? 'es' : '' }} seleccionada{{ selectedUnitIds().length !== 1 ? 's' : '' }}
                    </span>
                  }
                </p>
              }
            </div>
          }

          <!-- Multiple-choice answers -->
          @if (drill()!.type === 'multiple-choice' && drill()!.choices) {
            <fieldset class="drill__choices"
                      [disabled]="resolved()"
                      aria-label="Opciones de respuesta">
              <legend class="sr-only">Elige una respuesta</legend>
              @for (choice of displayChoices(); track choice.id; let i = $index) {
                <button type="button"
                        class="choice-option"
                        [class.choice-option--selected]="selectedChoiceId() === choice.id"
                        [class.choice-option--correct]="resolved() && choice.isCorrect"
                        [class.choice-option--incorrect]="resolved() && selectedChoiceId() === choice.id && !choice.isCorrect"
                        [class.choice-option--faded]="resolved() && !choice.isCorrect && selectedChoiceId() !== choice.id"
                        [disabled]="resolved()"
                        (click)="selectChoice(choice.id)"
                        [attr.aria-describedby]="'choice-desc-' + choice.id"
                        [attr.aria-pressed]="selectedChoiceId() === choice.id">
                  <span class="choice-option__badge mono">
                    @if (resolved() && choice.isCorrect) { ✓ }
                    @else if (resolved() && selectedChoiceId() === choice.id && !choice.isCorrect) { ✕ }
                    @else { {{ ['A','B','C','D','E'][i] }} }
                  </span>
                  <span class="choice-option__label"
                        [id]="'choice-desc-' + choice.id">{{ choice.labelEs }}</span>
                </button>
              }
            </fieldset>
          }

          <!-- Submit button (shown until the drill is resolved; stays available to retry) -->
          @if (!resolved()) {
            <button type="button"
                    class="btn btn--primary drill__submit"
                    [disabled]="!canSubmit() || store.submitting()"
                    (click)="submitAnswer()"
                    aria-label="Comprobar respuesta">
              {{ canRetry() ? 'Volver a intentar' : 'Comprobar respuesta' }}
            </button>
          }

          <!-- Feedback banner (after any submission) -->
          @if (store.answered()) {
            <div class="feedback"
                 [class.feedback--correct]="store.lastResult()!.correct"
                 [class.feedback--incorrect]="!store.lastResult()!.correct"
                 role="alert"
                 aria-live="polite">
              <div class="feedback__top-row">
                <span class="stencil feedback__verdict">
                  @if (store.lastResult()!.correct) {
                    Correcto
                  } @else if (store.isRevealed()) {
                    Respuesta revelada
                  } @else {
                    Incorrecto
                  }
                </span>
                @if (resolved()) {
                  <div class="feedback__rules" aria-label="Referencias de reglas">
                    @for (ref of store.lastResult()!.ruleRefs; track ref.section) {
                      <app-rule-ref-chip [ruleRef]="ref" />
                    }
                  </div>
                }
              </div>

              @if (store.isRevealed() && resolved()) {
                <p class="feedback__revealed-header">¿Cuál es la respuesta correcta?</p>
              }

              @if (resolved()) {
                <!-- Full explanation only once the drill is resolved -->
                <p class="feedback__explanation">
                  {{ store.lastResult()!.explanationEs }}
                </p>
              } @else {
                <!-- Wrong but attempts remain: encourage a retry without revealing the answer -->
                <p class="feedback__explanation">
                  Te queda{{ attemptsLeft() === 1 ? '' : 'n' }} {{ attemptsLeft() }}
                  intento{{ attemptsLeft() === 1 ? '' : 's' }}. Revisa tu elección y vuelve a intentarlo.
                </p>
              }
            </div>
          }

          <!-- Navigation (only once the drill is resolved) -->
          @if (resolved()) {
            <div class="drill__nav">
              @if (hasNextDrill()) {
                <button type="button"
                        class="btn btn--primary"
                        (click)="goToNextDrill()"
                        aria-label="Siguiente ejercicio">
                  Siguiente ejercicio →
                </button>
              } @else {
                <button type="button"
                        class="btn btn--primary"
                        (click)="goToQuiz()"
                        aria-label="Ir al examen de repaso">
                  Ir al examen →
                </button>
              }
            </div>
          }

          <!-- Back link -->
          <div class="drill__back">
            <a [routerLink]="['/modules', moduleId()]"
               class="back-link"
               aria-label="Volver al módulo">
              ← Volver al módulo
            </a>
          </div>
        </article>
      } @else {
        <p>Ejercicio no encontrado.</p>
        <a routerLink="/modules" class="back-link">← Volver al curso</a>
      }
    </div>
  `,
  styles: [`
    .drill__header {
      margin-bottom: 24px;
    }

    .drill__progress-label {
      display: block;
      margin-bottom: 8px;
    }

    .drill__progress-bar {
      height: 3px;
      background: var(--steel);
      border-radius: var(--radius);
      overflow: hidden;
    }

    .drill__progress-fill {
      height: 100%;
      background: var(--accent);
      border-radius: var(--radius);
      transition: width 0.4s ease;
    }

    .drill__question-section {
      margin-bottom: 28px;
    }

    .drill__question {
      font-size: 18px;
      color: var(--bone);
      line-height: 1.5;
      margin-bottom: 10px;
    }

    .drill__attempts {
      display: block;
      margin-top: 8px;
      color: var(--amber);
    }

    /* Choice options */
    .drill__choices {
      border: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 22px;
    }

    .choice-option {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 15px;
      background: transparent;
      border: 1px solid var(--line);
      border-radius: 2px;
      cursor: pointer;
      text-align: left;
      color: var(--sand);
      font-family: var(--font-body);
      font-size: 15.5px;
      transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease;
      width: 100%;
    }

    .choice-option:hover:not(:disabled):not(.choice-option--correct):not(.choice-option--incorrect) {
      border-color: var(--line-strong);
    }

    .choice-option--selected {
      border-color: var(--accent);
    }

    .choice-option--correct {
      border-color: var(--accent);
      background: var(--accent-soft);
      color: var(--bone);
    }

    .choice-option--incorrect {
      border-color: var(--blood);
      background: var(--blood-soft);
      color: var(--bone);
    }

    .choice-option--faded {
      color: var(--faint);
    }

    .choice-option:disabled {
      cursor: default;
    }

    .choice-option__badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      border: 1px solid currentColor;
      border-radius: 2px;
      font-size: 12px;
      line-height: 1;
    }

    .choice-option--correct .choice-option__badge {
      color: var(--accent);
      border-color: var(--accent);
    }

    .choice-option--incorrect .choice-option__badge {
      color: var(--blood);
      border-color: var(--blood);
    }

    .choice-option__label {
      flex: 1;
      line-height: 1.45;
    }

    /* Submit */
    .drill__submit {
      margin-bottom: 24px;
    }

    /* Feedback */
    .feedback {
      padding: 18px 20px;
      border-radius: var(--radius);
      margin-bottom: 24px;
      background: var(--char-2);
    }

    .feedback--correct {
      border-left: 2px solid var(--accent);
    }

    .feedback--incorrect {
      border-left: 2px solid var(--blood);
    }

    .feedback__top-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 10px;
      flex-wrap: wrap;
    }

    .feedback__verdict {
      display: block;
    }

    .feedback--correct .feedback__verdict { color: var(--accent); }
    .feedback--incorrect .feedback__verdict { color: var(--blood); }

    .feedback__revealed-header {
      font-size: 13px;
      color: var(--muted);
      margin-bottom: 6px;
    }

    .feedback__explanation {
      font-size: 14.5px;
      color: var(--sand);
      line-height: 1.6;
    }

    .feedback__rules {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    /* Navigation */
    .drill__nav {
      margin-bottom: 20px;
    }

    .drill__back {
      padding-top: 24px;
      border-top: 1px solid var(--line);
    }

    /* Board section for interactive-select drills */
    .drill__board-section {
      margin-bottom: 24px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }

    .drill__board-hint {
      font-size: 13px;
      color: var(--muted);
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
    }

    .drill__selected-count {
      color: var(--accent);
      background: var(--accent-soft);
      padding: 2px 6px;
      border-radius: var(--radius);
      font-size: 12px;
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }
  `],
})
export class DrillComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly store = inject(DrillStore);

  constructor() {
    // React to route param changes, not just the first load. Angular reuses this
    // component instance when only the drillIndex param changes (e.g. "Siguiente
    // ejercicio"), so reading params once in ngOnInit would leave the view stuck
    // on the previous drill.
    this.route.paramMap
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.loadDrill());
  }

  readonly moduleId = signal<string>('');
  readonly drillIndex = signal<number>(0);
  readonly drill = signal<DrillScenario | null>(null);
  readonly selectedChoiceId = signal<string | null>(null);

  // ---- Interactive-select (board) state ----

  /**
   * Tracks which unit IDs the user has selected for an interactive-select drill.
   * Selection is toggled: clicking the same unit deselects it.
   */
  readonly selectedUnitIds = signal<string[]>([]);

  /**
   * Maps the selectedUnitIds to the hex IDs those units occupy.
   * Used to show the selected state highlight on the board.
   */
  readonly selectedUnitHexIds = computed<string[]>(() => {
    const d = this.drill();
    if (!d?.boardSnippet) return [];
    const ids = this.selectedUnitIds();
    return d.boardSnippet.units
      .filter((u) => ids.includes(u.id) && u.hexId !== null)
      .map((u) => u.hexId as string);
  });

  /**
   * Board snippet with highlights applied after answer submission.
   * Shows correct/incorrect overlays post-answer.
   */
  readonly boardSnippetWithHighlights = computed(() => {
    const d = this.drill();
    if (!d?.boardSnippet) return null;
    // Only reveal correct/incorrect overlays once the drill is resolved, so a
    // wrong attempt with retries left does not give the answer away.
    if (!this.resolved()) return d.boardSnippet;

    // Apply highlights based on correct/incorrect unit IDs
    const correctIds = d.correctAnswer.split(',').map((s) => s.trim());
    const highlights = d.boardSnippet.units.flatMap((u) => {
      if (!u.hexId) return [];
      const isCorrect = correctIds.includes(u.id);
      const style: 'correct' | 'incorrect' = isCorrect ? 'correct' : 'incorrect';
      return [{ hexId: u.hexId, style }];
    });

    return { ...d.boardSnippet, highlights };
  });

  readonly totalDrills = computed<number>(() => {
    const id = this.moduleId();
    const mod = ALL_MODULES.find((m) => m.id === id);
    return mod?.drills.length ?? 0;
  });

  readonly progressPercent = computed<number>(() => {
    const total = this.totalDrills();
    return total > 0 ? Math.round(((this.drillIndex() + 1) / total) * 100) : 0;
  });

  readonly hasNextDrill = computed<boolean>(() => {
    return this.drillIndex() < this.totalDrills() - 1;
  });

  /**
   * True once the drill is finished: answered correctly, or revealed after the
   * maximum number of attempts. A wrong answer with attempts remaining is NOT
   * resolved — the user keeps trying.
   */
  readonly resolved = computed<boolean>(() => {
    return this.store.lastResult()?.correct === true || this.store.isRevealed();
  });

  /** True when a result exists but the drill is not resolved (wrong, retry left). */
  readonly canRetry = computed<boolean>(() => {
    return this.store.answered() && !this.resolved();
  });

  /** Remaining attempts before the answer is revealed. */
  readonly attemptsLeft = computed<number>(() => {
    return Math.max(0, this.store.maxAttempts - this.store.attempts());
  });

  /**
   * Choices in a stable, seed-shuffled order so the correct answer is not
   * always in the same position. Seeded by the drill id → deterministic.
   */
  readonly displayChoices = computed<DrillChoice[]>(() => {
    const d = this.drill();
    if (!d?.choices) return [];
    return shuffleWithSeed(d.choices, d.id);
  });

  readonly moduleTitle = computed<string>(() => {
    const id = this.moduleId();
    return ALL_MODULES.find((m) => m.id === id)?.titleEs ?? '';
  });

  readonly breadcrumbs = computed<BreadcrumbItem[]>(() => {
    const modId = this.moduleId();
    const modTitle = this.moduleTitle();
    return [
      { label: 'Curso', route: ['/modules'] },
      { label: modTitle || 'Módulo', route: ['/modules', modId] },
      { label: `Ejercicio ${this.drillIndex() + 1}` },
    ];
  });

  /** True when the user has made a valid selection and can submit */
  readonly canSubmit = computed<boolean>(() => {
    const d = this.drill();
    if (!d) return false;
    if (d.type === 'interactive-select') {
      return this.selectedUnitIds().length > 0;
    }
    return this.selectedChoiceId() !== null;
  });

  private loadDrill(): void {
    const modId = this.route.parent?.snapshot.paramMap.get('moduleId') ?? '';
    const indexStr = this.route.snapshot.paramMap.get('drillIndex') ?? '0';
    const index = parseInt(indexStr, 10);

    this.moduleId.set(modId);
    this.drillIndex.set(index);

    // Reset per-drill UI state so the new drill starts clean.
    this.selectedChoiceId.set(null);
    this.selectedUnitIds.set([]);

    const mod = ALL_MODULES.find((m) => m.id === modId);
    const drillScenario = mod?.drills[index] ?? null;

    this.drill.set(drillScenario);
    if (drillScenario) {
      this.store.load(drillScenario, modId);
    }
  }

  selectChoice(choiceId: string): void {
    // Allow changing the selection on every attempt until the drill is resolved.
    if (!this.resolved()) {
      this.selectedChoiceId.set(choiceId);
    }
  }

  /**
   * Called when the user clicks a hex in the board snippet.
   * Finds the unit in that hex and toggles its selection.
   * If no unit occupies the hex, the click is ignored.
   */
  onBoardHexSelected(hexId: string): void {
    if (this.resolved()) return;
    const d = this.drill();
    if (!d?.boardSnippet) return;

    // Find the unit(s) in this hex
    const unitsInHex = d.boardSnippet.units.filter((u) => u.hexId === hexId);
    if (unitsInHex.length === 0) return; // no unit to select in empty hex

    // Toggle selection: select first unit in hex (drills have ≤1 unit per hex)
    const unitId = unitsInHex[0].id;
    const current = this.selectedUnitIds();
    if (current.includes(unitId)) {
      this.selectedUnitIds.set(current.filter((id) => id !== unitId));
    } else {
      this.selectedUnitIds.set([...current, unitId]);
    }
  }

  async submitAnswer(): Promise<void> {
    const d = this.drill();
    if (!d) return;

    let answer: DrillAnswer;

    if (d.type === 'interactive-select') {
      const ids = this.selectedUnitIds();
      if (ids.length === 0) return;
      answer = { kind: 'board', selectedHexIds: ids };
    } else {
      const choiceId = this.selectedChoiceId();
      if (!choiceId) return;
      answer = { kind: 'choice', optionId: choiceId };
    }

    await this.store.submit(answer);
  }

  goToNextDrill(): void {
    const modId = this.moduleId();
    const nextIndex = this.drillIndex() + 1;
    this.router.navigate(['/modules', modId, 'drills', nextIndex]);
  }

  goToQuiz(): void {
    this.router.navigate(['/modules', this.moduleId(), 'quiz']);
  }
}
