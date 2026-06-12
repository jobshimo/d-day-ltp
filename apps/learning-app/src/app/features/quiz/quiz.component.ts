import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
  InjectionToken,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ALL_MODULES } from 'content';
import type { QuizItem, QuizResult } from 'content-schema';
import { PROGRESS_REPO_TOKEN_ID } from 'domain-progress';
import type { ProgressRepository } from 'domain-progress';
import { evaluateDrill } from 'domain-drill';
import type { DrillAnswer } from 'domain-drill';
import { BreadcrumbComponent } from '../../shared/breadcrumb.component';
import type { BreadcrumbItem } from '../../shared/breadcrumb.component';
import { RuleRefChipComponent } from '../lesson/rule-ref-chip.component';

export const QUIZ_PROGRESS_REPO = new InjectionToken<ProgressRepository>(
  PROGRESS_REPO_TOKEN_ID,
);

const PASS_THRESHOLD = 0.7;

type QuizPhase = 'answering' | 'review' | 'result';

interface QuizAnswer {
  questionIndex: number;
  selectedChoiceId: string;
  correct: boolean;
  explanationEs: string;
  correctChoiceLabel: string;
}

@Component({
  standalone: true,
  selector: 'app-quiz',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, BreadcrumbComponent, RuleRefChipComponent],
  template: `
    <div class="quiz">
      <app-breadcrumb [items]="breadcrumbs()" />

      @switch (phase()) {
        <!-- ── Answering phase ── -->
        @case ('answering') {
          @if (currentQuestion()) {
            <article class="quiz__article" aria-labelledby="quiz-question">
              <header class="quiz__header">
                <span class="quiz__progress-label" aria-live="polite">
                  Pregunta {{ currentIndex() + 1 }} de {{ total() }}
                </span>
                <div class="quiz__progress-bar"
                     role="progressbar"
                     [attr.aria-valuenow]="currentIndex() + 1"
                     [attr.aria-valuemax]="total()"
                     aria-valuemin="1">
                  <div class="quiz__progress-fill"
                       [style.width.%]="progressPercent()"></div>
                </div>
              </header>

              <p id="quiz-question" class="quiz__question">
                {{ currentQuestion()!.questionEs }}
              </p>

              <!-- Question-level feedback (after answering current question) -->
              @if (currentAnswer()) {
                <div class="feedback"
                     [class.feedback--correct]="currentAnswer()!.correct"
                     [class.feedback--incorrect]="!currentAnswer()!.correct"
                     role="alert"
                     aria-live="polite">
                  <p class="feedback__verdict">
                    @if (currentAnswer()!.correct) { ✓ Correcto }
                    @else { ✗ Incorrecto — Respuesta correcta: "{{ currentAnswer()!.correctChoiceLabel }}" }
                  </p>
                  <p class="feedback__explanation">
                    {{ currentAnswer()!.explanationEs }}
                  </p>
                  <div class="feedback__rules">
                    @for (ref of currentQuestion()!.ruleRefs; track ref.section) {
                      <app-rule-ref-chip [ruleRef]="ref" />
                    }
                  </div>
                </div>

                <button type="button"
                        class="btn btn--primary"
                        (click)="advanceOrFinish()"
                        aria-label="{{ isLastQuestion() ? 'Ver resultados' : 'Siguiente pregunta' }}">
                  {{ isLastQuestion() ? 'Ver resultados →' : 'Siguiente pregunta →' }}
                </button>
              } @else {
                <!-- Choice selection -->
                <fieldset class="quiz__choices"
                          aria-label="Opciones de respuesta">
                  <legend class="sr-only">Elige una respuesta</legend>
                  @for (choice of currentQuestion()!.choices ?? []; track choice.id) {
                    <label class="choice-option"
                           [class.choice-option--selected]="selectedChoiceId() === choice.id">
                      <input type="radio"
                             name="quiz-answer"
                             [value]="choice.id"
                             [checked]="selectedChoiceId() === choice.id"
                             (change)="selectChoice(choice.id)" />
                      <span class="choice-option__label">{{ choice.labelEs }}</span>
                    </label>
                  }
                </fieldset>

                <button type="button"
                        class="btn btn--primary"
                        [disabled]="!selectedChoiceId()"
                        (click)="submitCurrentAnswer()"
                        aria-label="Comprobar respuesta">
                  Comprobar respuesta
                </button>
              }
            </article>
          }
        }

        <!-- ── Result phase ── -->
        @case ('result') {
          <div class="quiz-result" role="main" aria-labelledby="result-heading">
            <div class="quiz-result__score-circle"
                 [class.quiz-result__score-circle--pass]="quizPassed()"
                 [class.quiz-result__score-circle--fail]="!quizPassed()"
                 aria-hidden="true">
              <span class="quiz-result__score-num">{{ scorePercent() }}%</span>
            </div>

            <h1 id="result-heading" class="quiz-result__heading">
              @if (quizPassed()) {
                ¡Módulo completado!
              } @else {
                No aprobado
              }
            </h1>

            <p class="quiz-result__summary">
              Respondiste correctamente {{ correctCount() }} de {{ total() }} preguntas
              (mínimo requerido: {{ minCorrectCount() }}).
            </p>

            @if (quizPassed() && unlockedModuleTitle()) {
              <div class="quiz-result__unlock" role="status">
                🔓 Has desbloqueado: <strong>{{ unlockedModuleTitle() }}</strong>
              </div>
            }

            @if (!quizPassed()) {
              <!-- Review incorrect items -->
              <section class="quiz-result__review" aria-labelledby="review-heading">
                <h2 id="review-heading" class="quiz-result__review-title">
                  Preguntas incorrectas
                </h2>
                @for (ans of incorrectAnswers(); track ans.questionIndex) {
                  <div class="review-item">
                    <p class="review-item__q">
                      {{ questions()[ans.questionIndex].questionEs }}
                    </p>
                    <p class="review-item__explanation">
                      {{ ans.explanationEs }}
                    </p>
                  </div>
                }
              </section>

              <button type="button"
                      class="btn btn--primary"
                      (click)="retryQuiz()"
                      aria-label="Reintentar el examen">
                Reintentar
              </button>
            }

            <div class="quiz-result__nav">
              <a [routerLink]="['/modules', moduleId()]"
                 class="btn btn--secondary"
                 aria-label="Volver al módulo">
                Volver al módulo
              </a>
              <a [routerLink]="['/modules']"
                 class="btn btn--secondary"
                 aria-label="Ir al mapa del curso">
                Ver todos los módulos
              </a>
            </div>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .quiz {
      max-width: var(--max-content-width);
      margin: 0 auto;
      padding: var(--space-6) var(--space-4);
    }

    .quiz__header {
      margin-bottom: var(--space-6);
    }

    .quiz__progress-label {
      display: block;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--color-accent);
      margin-bottom: var(--space-2);
    }

    .quiz__progress-bar {
      height: 4px;
      background: var(--color-progress-track);
      border-radius: var(--radius-full);
      overflow: hidden;
    }

    .quiz__progress-fill {
      height: 100%;
      background: var(--color-accent);
      border-radius: var(--radius-full);
      transition: width var(--transition-slow);
    }

    .quiz__question {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      line-height: var(--line-height-tight);
      margin-bottom: var(--space-6);
    }

    .quiz__choices {
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
    }

    /* Feedback */
    .feedback {
      padding: var(--space-4) var(--space-5);
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
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-bold);
      margin-bottom: var(--space-2);
    }

    .feedback__explanation {
      font-size: var(--font-size-sm);
      color: var(--color-text-primary);
      line-height: var(--line-height-relaxed);
      margin-bottom: var(--space-3);
    }

    .feedback__rules {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
    }

    /* Result screen */
    .quiz-result {
      text-align: center;
      padding: var(--space-8) var(--space-4);
    }

    .quiz-result__score-circle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      border: 4px solid;
      margin: 0 auto var(--space-6);

      &--pass {
        border-color: var(--color-success);
        background: var(--color-success-bg);

        .quiz-result__score-num { color: var(--color-success); }
      }

      &--fail {
        border-color: var(--color-error);
        background: var(--color-error-bg);

        .quiz-result__score-num { color: var(--color-error); }
      }
    }

    .quiz-result__score-num {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
    }

    .quiz-result__heading {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      margin-bottom: var(--space-3);
    }

    .quiz-result__summary {
      font-size: var(--font-size-base);
      color: var(--color-text-secondary);
      margin-bottom: var(--space-6);
    }

    .quiz-result__unlock {
      padding: var(--space-4) var(--space-5);
      background: rgba(76, 175, 120, 0.1);
      border: 1px solid var(--color-success);
      border-radius: var(--radius-md);
      color: var(--color-success);
      font-weight: var(--font-weight-semibold);
      margin-bottom: var(--space-6);
    }

    .quiz-result__review {
      text-align: left;
      margin-bottom: var(--space-6);
    }

    .quiz-result__review-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      margin-bottom: var(--space-4);
    }

    .review-item {
      padding: var(--space-4);
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      margin-bottom: var(--space-3);
    }

    .review-item__q {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      margin-bottom: var(--space-2);
    }

    .review-item__explanation {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      line-height: var(--line-height-normal);
    }

    .quiz-result__nav {
      display: flex;
      justify-content: center;
      gap: var(--space-3);
      flex-wrap: wrap;
      margin-top: var(--space-6);
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
      text-decoration: none;
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

      &--secondary {
        background: var(--color-surface-alt);
        color: var(--color-text-primary);
        border: 1px solid var(--color-border);

        &:hover:not(:disabled) {
          background: var(--color-border);
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
  `],
})
export class QuizComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly moduleId = signal<string>('');
  readonly phase = signal<QuizPhase>('answering');
  readonly currentIndex = signal<number>(0);
  readonly selectedChoiceId = signal<string | null>(null);
  readonly answers = signal<QuizAnswer[]>([]);
  readonly unlockedModuleTitle = signal<string | null>(null);

  readonly questions = computed<QuizItem[]>(() => {
    const id = this.moduleId();
    return ALL_MODULES.find((m) => m.id === id)?.reviewQuiz ?? [];
  });

  readonly total = computed<number>(() => this.questions().length);

  readonly progressPercent = computed<number>(() => {
    const total = this.total();
    return total > 0 ? Math.round(((this.currentIndex() + 1) / total) * 100) : 0;
  });

  readonly currentQuestion = computed<QuizItem | null>(() => {
    return this.questions()[this.currentIndex()] ?? null;
  });

  readonly currentAnswer = computed<QuizAnswer | null>(() => {
    return this.answers().find((a) => a.questionIndex === this.currentIndex()) ?? null;
  });

  readonly isLastQuestion = computed<boolean>(() => {
    return this.currentIndex() === this.total() - 1;
  });

  readonly correctCount = computed<number>(() => {
    return this.answers().filter((a) => a.correct).length;
  });

  readonly incorrectAnswers = computed<QuizAnswer[]>(() => {
    return this.answers().filter((a) => !a.correct);
  });

  readonly scorePercent = computed<number>(() => {
    const total = this.total();
    return total > 0 ? Math.round((this.correctCount() / total) * 100) : 0;
  });

  readonly quizPassed = computed<boolean>(() => {
    const total = this.total();
    return total > 0 && this.correctCount() / total >= PASS_THRESHOLD;
  });

  readonly minCorrectCount = computed<number>(() => {
    return Math.ceil(this.total() * PASS_THRESHOLD);
  });

  readonly moduleTitle = computed<string>(() => {
    return ALL_MODULES.find((m) => m.id === this.moduleId())?.titleEs ?? '';
  });

  readonly breadcrumbs = computed<BreadcrumbItem[]>(() => {
    const modId = this.moduleId();
    const modTitle = this.moduleTitle();
    return [
      { label: 'Curso', route: ['/modules'] },
      { label: modTitle || 'Módulo', route: ['/modules', modId] },
      { label: 'Examen de repaso' },
    ];
  });

  private readonly progressRepo = inject<ProgressRepository>(QUIZ_PROGRESS_REPO);

  ngOnInit(): void {
    const modId = this.route.parent?.snapshot.paramMap.get('moduleId') ?? '';
    this.moduleId.set(modId);
    this.resetState();
  }

  private resetState(): void {
    this.currentIndex.set(0);
    this.selectedChoiceId.set(null);
    this.answers.set([]);
    this.phase.set('answering');
    this.unlockedModuleTitle.set(null);
  }

  selectChoice(choiceId: string): void {
    this.selectedChoiceId.set(choiceId);
  }

  submitCurrentAnswer(): void {
    const question = this.currentQuestion();
    const choiceId = this.selectedChoiceId();
    if (!question || !choiceId) return;

    const answer: DrillAnswer = { kind: 'choice', optionId: choiceId };
    const result = evaluateDrill(question, answer);

    const correctChoice = question.choices?.find((c) => c.isCorrect);

    const quizAnswer: QuizAnswer = {
      questionIndex: this.currentIndex(),
      selectedChoiceId: choiceId,
      correct: result.correct,
      explanationEs: result.explanationEs,
      correctChoiceLabel: correctChoice?.labelEs ?? result.correctAnswer,
    };

    this.answers.update((prev) => [...prev, quizAnswer]);
  }

  advanceOrFinish(): void {
    this.selectedChoiceId.set(null);
    if (this.isLastQuestion()) {
      this.finishQuiz();
    } else {
      this.currentIndex.update((i) => i + 1);
    }
  }

  private async finishQuiz(): Promise<void> {
    const modId = this.moduleId();
    const passed = this.quizPassed();
    const score = this.total() > 0 ? this.correctCount() / this.total() : 0;

    const quizResult: QuizResult = {
      score,
      passed,
      completedAt: new Date().toISOString(),
    };

    await this.progressRepo.setQuizResult(modId, quizResult);

    // If passed, unlock the next module
    if (passed) {
      const mod = ALL_MODULES.find((m) => m.id === modId);
      if (mod?.requiredPriorModuleId !== undefined) {
        // Nothing more needed — IDB adapter handles unlock via setQuizResult chain
      }

      // Find what module this unlocks
      const nextMod = ALL_MODULES.find((m) => m.requiredPriorModuleId === modId);
      if (nextMod) {
        this.unlockedModuleTitle.set(nextMod.titleEs);
      }
    }

    this.phase.set('result');
  }

  retryQuiz(): void {
    this.resetState();
  }
}
