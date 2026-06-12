import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DrillStore } from 'application-drill-store';
import { ALL_MODULES } from 'content';
import type { DrillScenario } from 'content-schema';
import type { DrillAnswer } from 'domain-drill';
import { BreadcrumbComponent } from '../../shared/breadcrumb.component';
import type { BreadcrumbItem } from '../../shared/breadcrumb.component';
import { RuleRefChipComponent } from '../lesson/rule-ref-chip.component';

@Component({
  standalone: true,
  selector: 'app-drill',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, BreadcrumbComponent, RuleRefChipComponent],
  providers: [DrillStore],
  template: `
    <div class="drill">
      <app-breadcrumb [items]="breadcrumbs()" />

      @if (drill()) {
        <article class="drill__article" aria-labelledby="drill-question">
          <header class="drill__header">
            <span class="drill__progress-label">
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
            <p id="drill-question" class="drill__question">
              {{ drill()!.questionEs }}
            </p>

            <!-- Attempt indicator -->
            @if (store.attempts() > 0 && !store.answered()) {
              <p class="drill__attempts"
                 role="status"
                 aria-live="polite">
                Intento {{ store.attempts() }} de {{ store.maxAttempts }}
                @if (store.attempts() >= store.maxAttempts - 1) {
                  — <strong>último intento</strong>
                }
              </p>
            }
          </div>

          <!-- Multiple-choice answers -->
          @if (drill()!.type === 'multiple-choice' && drill()!.choices) {
            <fieldset class="drill__choices"
                      [disabled]="store.answered() || store.isRevealed()"
                      aria-label="Opciones de respuesta">
              <legend class="sr-only">Elige una respuesta</legend>
              @for (choice of drill()!.choices; track choice.id) {
                <label class="choice-option"
                       [class.choice-option--selected]="selectedChoiceId() === choice.id"
                       [class.choice-option--correct]="isAnswered() && choice.isCorrect"
                       [class.choice-option--incorrect]="isAnswered() && selectedChoiceId() === choice.id && !choice.isCorrect">
                  <input type="radio"
                         name="drill-answer"
                         [value]="choice.id"
                         [checked]="selectedChoiceId() === choice.id"
                         [disabled]="store.answered() || store.isRevealed()"
                         (change)="selectChoice(choice.id)"
                         [attr.aria-describedby]="'choice-desc-' + choice.id" />
                  <span class="choice-option__label">{{ choice.labelEs }}</span>
                  @if (isAnswered() && choice.isCorrect) {
                    <span class="choice-option__indicator choice-option__indicator--correct"
                          [id]="'choice-desc-' + choice.id"
                          aria-label="Respuesta correcta">✓</span>
                  } @else if (isAnswered() && selectedChoiceId() === choice.id && !choice.isCorrect) {
                    <span class="choice-option__indicator choice-option__indicator--incorrect"
                          [id]="'choice-desc-' + choice.id"
                          aria-label="Respuesta incorrecta">✗</span>
                  }
                </label>
              }
            </fieldset>
          }

          <!-- Submit button (before answer) -->
          @if (!store.answered() && !store.isRevealed()) {
            <button type="button"
                    class="btn btn--primary"
                    [disabled]="!selectedChoiceId() || store.submitting()"
                    (click)="submitAnswer()"
                    aria-label="Comprobar respuesta">
              Comprobar respuesta
            </button>
          }

          <!-- Feedback banner (after answer) -->
          @if (isAnswered()) {
            <div class="feedback"
                 [class.feedback--correct]="store.lastResult()!.correct"
                 [class.feedback--incorrect]="!store.lastResult()!.correct"
                 role="alert"
                 aria-live="polite">
              <p class="feedback__verdict">
                @if (store.lastResult()!.correct) {
                  ✓ Correcto
                } @else if (store.isRevealed()) {
                  Respuesta revelada — superaste el límite de intentos
                } @else {
                  ✗ Incorrecto
                }
              </p>

              <p class="feedback__explanation">
                {{ store.lastResult()!.explanationEs }}
              </p>

              <div class="feedback__rules" aria-label="Referencias de reglas">
                @for (ref of store.lastResult()!.ruleRefs; track ref.section) {
                  <app-rule-ref-chip [ruleRef]="ref" />
                }
              </div>
            </div>
          }

          <!-- Navigation after answer -->
          @if (isAnswered() || store.isRevealed()) {
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
                        class="btn btn--success"
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
    .drill {
      max-width: var(--max-content-width);
      margin: 0 auto;
      padding: var(--space-6) var(--space-4);
    }

    .drill__header {
      margin-bottom: var(--space-6);
    }

    .drill__progress-label {
      display: block;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--color-accent);
      margin-bottom: var(--space-2);
    }

    .drill__progress-bar {
      height: 4px;
      background: var(--color-progress-track);
      border-radius: var(--radius-full);
      overflow: hidden;
    }

    .drill__progress-fill {
      height: 100%;
      background: var(--color-accent);
      border-radius: var(--radius-full);
      transition: width var(--transition-slow);
    }

    .drill__question-section {
      margin-bottom: var(--space-6);
    }

    .drill__question {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      line-height: var(--line-height-tight);
      margin-bottom: var(--space-3);
    }

    .drill__attempts {
      font-size: var(--font-size-sm);
      color: var(--color-warning);
    }

    /* Choice options */
    .drill__choices {
      border: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
      margin-bottom: var(--space-5);
    }

    .choice-option {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-4);
      background: var(--color-surface);
      border: 2px solid var(--color-border);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: border-color var(--transition-fast), background var(--transition-fast);

      &:hover {
        border-color: var(--color-accent-dim);
        background: var(--color-surface-alt);
      }

      &--selected {
        border-color: var(--color-accent);
        background: rgba(200, 160, 74, 0.08);
      }

      &--correct {
        border-color: var(--color-success);
        background: var(--color-success-bg);
      }

      &--incorrect {
        border-color: var(--color-error);
        background: var(--color-error-bg);
      }

      input[type="radio"] {
        width: 18px;
        height: 18px;
        accent-color: var(--color-accent);
        flex-shrink: 0;
      }
    }

    .choice-option__label {
      flex: 1;
      font-size: var(--font-size-base);
      color: var(--color-text-primary);
      line-height: var(--line-height-normal);
    }

    .choice-option__indicator {
      font-weight: var(--font-weight-bold);
      font-size: var(--font-size-lg);

      &--correct { color: var(--color-success); }
      &--incorrect { color: var(--color-error); }
    }

    /* Feedback */
    .feedback {
      padding: var(--space-5);
      border-radius: var(--radius-md);
      margin-bottom: var(--space-5);

      &--correct {
        background: var(--color-success-bg);
        border: 1px solid var(--color-success);

        .feedback__verdict { color: var(--color-success); }
      }

      &--incorrect {
        background: var(--color-error-bg);
        border: 1px solid var(--color-error);

        .feedback__verdict { color: var(--color-error); }
      }
    }

    .feedback__verdict {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      margin-bottom: var(--space-3);
    }

    .feedback__explanation {
      font-size: var(--font-size-base);
      color: var(--color-text-primary);
      line-height: var(--line-height-relaxed);
      margin-bottom: var(--space-3);
    }

    .feedback__rules {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
    }

    /* Navigation */
    .drill__nav {
      margin-bottom: var(--space-5);
    }

    .drill__back {
      padding-top: var(--space-6);
      border-top: 1px solid var(--color-border);
    }

    /* Buttons */
    .btn {
      display: inline-flex;
      align-items: center;
      padding: var(--space-3) var(--space-5);
      border: none;
      border-radius: var(--radius-md);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      cursor: pointer;
      transition: background var(--transition-fast), transform var(--transition-fast);

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none !important;
      }

      &:focus-visible {
        outline: 2px solid var(--color-accent);
        outline-offset: 3px;
      }

      &--primary {
        background: var(--color-accent);
        color: var(--color-bg);

        &:hover:not(:disabled) {
          background: #d4b060;
          transform: translateY(-1px);
        }
      }

      &--success {
        background: var(--color-success);
        color: white;

        &:hover:not(:disabled) {
          background: #3d9963;
          transform: translateY(-1px);
        }
      }
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

    .back-link {
      color: var(--color-accent);
      text-decoration: none;
      font-size: var(--font-size-sm);

      &:hover { text-decoration: underline; }
    }
  `],
})
export class DrillComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly store = inject(DrillStore);

  readonly moduleId = signal<string>('');
  readonly drillIndex = signal<number>(0);
  readonly drill = signal<DrillScenario | null>(null);
  readonly selectedChoiceId = signal<string | null>(null);

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

  readonly isAnswered = computed<boolean>(() => {
    return this.store.answered() || this.store.isRevealed();
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

  ngOnInit(): void {
    const modId = this.route.parent?.snapshot.paramMap.get('moduleId') ?? '';
    const indexStr = this.route.snapshot.paramMap.get('drillIndex') ?? '0';
    const index = parseInt(indexStr, 10);

    this.moduleId.set(modId);
    this.drillIndex.set(index);

    const mod = ALL_MODULES.find((m) => m.id === modId);
    const drillScenario = mod?.drills[index] ?? null;

    if (drillScenario) {
      this.drill.set(drillScenario);
      this.store.load(drillScenario, modId);
    }
  }

  selectChoice(choiceId: string): void {
    if (!this.store.answered() && !this.store.isRevealed()) {
      this.selectedChoiceId.set(choiceId);
    }
  }

  async submitAnswer(): Promise<void> {
    const choiceId = this.selectedChoiceId();
    if (!choiceId) return;

    const answer: DrillAnswer = { kind: 'choice', optionId: choiceId };
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
