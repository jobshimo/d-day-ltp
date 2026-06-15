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
import type { QuizItem, QuizResult, DrillChoice } from 'content-schema';
import { PROGRESS_REPO_TOKEN_ID } from 'domain-progress';
import type { ProgressRepository } from 'domain-progress';
import { evaluateDrill, shuffleWithSeed } from 'domain-drill';
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
    <div class="screen wrap" style="padding-bottom:90px">
      <app-breadcrumb [items]="breadcrumbs()" />

      @switch (phase()) {
        <!-- ── Answering phase ── -->
        @case ('answering') {
          @if (currentQuestion()) {
            <article class="quiz__article" aria-labelledby="quiz-question">
              <header class="quiz__header">
                <span class="kicker quiz__progress-label" aria-live="polite">
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
                <span class="kicker quiz__score-label">
                  {{ correctCount() }}/{{ currentIndex() }}
                </span>
              </header>

              <div class="card quiz__question-card">
                <p id="quiz-question" class="serif quiz__question">
                  {{ currentQuestion()!.questionEs }}
                </p>

                <!-- Choice selection (before answering) -->
                @if (!currentAnswer()) {
                  <fieldset class="quiz__choices"
                            aria-label="Opciones de respuesta">
                    <legend class="sr-only">Elige una respuesta</legend>
                    @for (choice of displayChoices(); track choice.id; let i = $index) {
                      <button type="button"
                              class="choice-option"
                              [class.choice-option--selected]="selectedChoiceId() === choice.id"
                              (click)="selectChoice(choice.id)"
                              [attr.aria-pressed]="selectedChoiceId() === choice.id">
                        <span class="choice-option__badge mono">{{ ['A','B','C','D','E'][i] }}</span>
                        <span class="choice-option__label">{{ choice.labelEs }}</span>
                      </button>
                    }
                  </fieldset>

                  <button type="button"
                          class="btn btn--primary quiz__submit"
                          [disabled]="!selectedChoiceId()"
                          (click)="submitCurrentAnswer()"
                          aria-label="Comprobar respuesta">
                    Comprobar respuesta
                  </button>
                }

                <!-- Post-answer: choices locked with correct/incorrect state -->
                @if (currentAnswer()) {
                  <fieldset class="quiz__choices"
                            disabled
                            aria-label="Opciones de respuesta">
                    <legend class="sr-only">Elige una respuesta</legend>
                    @for (choice of displayChoices(); track choice.id; let i = $index) {
                      <button type="button"
                              class="choice-option"
                              [class.choice-option--correct]="choice.isCorrect"
                              [class.choice-option--incorrect]="selectedChoiceId() === choice.id && !choice.isCorrect"
                              [class.choice-option--faded]="!choice.isCorrect && selectedChoiceId() !== choice.id"
                              disabled>
                        <span class="choice-option__badge mono">
                          @if (choice.isCorrect) { ✓ }
                          @else if (selectedChoiceId() === choice.id && !choice.isCorrect) { ✕ }
                          @else { {{ ['A','B','C','D','E'][i] }} }
                        </span>
                        <span class="choice-option__label">{{ choice.labelEs }}</span>
                      </button>
                    }
                  </fieldset>
                }
              </div>

              <!-- Question-level feedback (after answering current question) -->
              @if (currentAnswer()) {
                <div class="feedback"
                     [class.feedback--correct]="currentAnswer()!.correct"
                     [class.feedback--incorrect]="!currentAnswer()!.correct"
                     role="alert"
                     aria-live="polite">
                  <div class="feedback__top-row">
                    <span class="stencil feedback__verdict">
                      @if (currentAnswer()!.correct) { Correcto }
                      @else { Incorrecto }
                    </span>
                    <div class="feedback__rules">
                      @for (ref of currentQuestion()!.ruleRefs; track ref.section) {
                        <app-rule-ref-chip [ruleRef]="ref" />
                      }
                    </div>
                  </div>
                  <p class="feedback__explanation">
                    {{ currentAnswer()!.explanationEs }}
                  </p>
                </div>

                <button type="button"
                        class="btn btn--primary"
                        (click)="advanceOrFinish()"
                        aria-label="{{ isLastQuestion() ? 'Ver resultados' : 'Siguiente pregunta' }}">
                  {{ isLastQuestion() ? 'Ver resultado →' : 'Siguiente →' }}
                </button>
              }
            </article>
          }
        }

        <!-- ── Result phase ── -->
        @case ('result') {
          <div class="quiz-result" role="main" aria-labelledby="result-heading">
            <div class="card quiz-result__card"
                 [class.quiz-result__card--pass]="quizPassed()"
                 [class.quiz-result__card--fail]="!quizPassed()">

              <p class="eyebrow quiz-result__eyebrow">
                @if (quizPassed()) { Examen superado } @else { Sigue entrenando }
              </p>

              <h1 id="result-heading" class="quiz-result__heading">
                @if (quizPassed()) {
                  Módulo completado
                } @else {
                  No aprobado
                }
              </h1>

              <p class="display quiz-result__score"
                 [class.quiz-result__score--pass]="quizPassed()"
                 [class.quiz-result__score--fail]="!quizPassed()">
                {{ correctCount() }}/{{ total() }}
              </p>

              <p class="quiz-result__summary">
                Respondiste correctamente {{ correctCount() }} de {{ total() }} preguntas
                (mínimo requerido: {{ minCorrectCount() }}).
              </p>

              @if (quizPassed() && unlockedModuleTitle()) {
                <div class="quiz-result__unlock" role="status">
                  🔓 Has desbloqueado: <strong>{{ unlockedModuleTitle() }}</strong>
                </div>
              }
            </div>

            @if (!quizPassed()) {
              <!-- Review incorrect items -->
              <section class="quiz-result__review" aria-labelledby="review-heading">
                <h2 id="review-heading" class="quiz-result__review-title">
                  Preguntas incorrectas
                </h2>
                @for (ans of incorrectAnswers(); track ans.questionIndex) {
                  <div class="card review-item">
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
                      class="btn btn--ghost"
                      (click)="retryQuiz()"
                      aria-label="Reintentar el examen">
                Reintentar
              </button>
            }

            <div class="quiz-result__nav">
              <a [routerLink]="['/modules', moduleId()]"
                 class="btn btn--primary"
                 aria-label="Volver al módulo">
                Volver al módulo
              </a>
              <a [routerLink]="['/modules']"
                 class="btn btn--ghost"
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
    /* Answering phase header */
    .quiz__header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }

    .quiz__progress-label {
      white-space: nowrap;
    }

    .quiz__score-label {
      white-space: nowrap;
    }

    .quiz__progress-bar {
      flex: 1;
      height: 3px;
      background: var(--steel);
      border-radius: var(--radius);
      overflow: hidden;
    }

    .quiz__progress-fill {
      height: 100%;
      background: var(--accent);
      border-radius: var(--radius);
      transition: width 0.4s ease;
    }

    /* Question card */
    .quiz__question-card {
      padding: 26px 28px;
      margin-bottom: 20px;
    }

    .quiz__question {
      font-size: 18px;
      color: var(--bone);
      line-height: 1.5;
      margin-bottom: 20px;
    }

    /* Choice options */
    .quiz__choices {
      border: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 20px;
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

    .quiz__submit {
      margin-top: 4px;
    }

    /* Feedback */
    .feedback {
      padding: 18px 20px;
      border-radius: var(--radius);
      margin-bottom: 18px;
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

    /* Result screen */
    .quiz-result {
      max-width: 560px;
      margin: 0 auto;
      padding-top: 32px;
    }

    .quiz-result__card {
      padding: 44px 36px;
      text-align: center;
      margin-bottom: 32px;
    }

    .quiz-result__card--pass {
      border-color: var(--accent);
    }

    .quiz-result__card--fail {
      border-color: var(--blood);
    }

    .quiz-result__eyebrow {
      margin-bottom: 6px;
    }

    .quiz-result__heading {
      font-size: 22px;
      font-weight: 700;
      color: var(--bone);
      margin-bottom: 20px;
    }

    .quiz-result__score {
      font-size: 74px;
      line-height: 1;
      margin-bottom: 16px;
    }

    .quiz-result__score--pass { color: var(--accent); }
    .quiz-result__score--fail { color: var(--blood); }

    .quiz-result__summary {
      font-size: 14px;
      color: var(--sand);
      line-height: 1.55;
    }

    .quiz-result__unlock {
      margin-top: 20px;
      padding: 14px 18px;
      background: var(--accent-soft);
      border: 1px solid var(--accent);
      border-radius: var(--radius);
      color: var(--bone);
      font-size: 14px;
    }

    .quiz-result__review {
      margin-bottom: 20px;
    }

    .quiz-result__review-title {
      font-size: 13px;
      font-weight: 600;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.07em;
      margin-bottom: 14px;
    }

    .review-item {
      padding: 16px;
      margin-bottom: 10px;
    }

    .review-item__q {
      font-size: 14px;
      font-weight: 600;
      color: var(--bone);
      margin-bottom: 6px;
    }

    .review-item__explanation {
      font-size: 13px;
      color: var(--sand);
      line-height: 1.5;
    }

    .quiz-result__nav {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 24px;
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

  /**
   * Current question's choices in a stable, seed-shuffled order so the correct
   * answer is not always in the same position. Seeded by the question id.
   */
  readonly displayChoices = computed<DrillChoice[]>(() => {
    const q = this.currentQuestion();
    if (!q?.choices) return [];
    return shuffleWithSeed(q.choices, q.id);
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
