import {
  Component,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
  InjectionToken,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ALL_MODULES, getBlockNarration } from 'content';
import type { Lesson, WorkedExampleStep } from 'content-schema';
import { PROGRESS_REPO_TOKEN_ID } from 'domain-progress';
import type { ProgressRepository } from 'domain-progress';
import { NarrationStore } from 'application-narration-store';
import { BreadcrumbComponent } from '../../shared/breadcrumb.component';
import type { BreadcrumbItem } from '../../shared/breadcrumb.component';
import { RuleRefChipComponent } from './rule-ref-chip.component';
import { CounterComponent } from 'counter';

export const LESSON_PROGRESS_REPO = new InjectionToken<ProgressRepository>(
  PROGRESS_REPO_TOKEN_ID,
);

@Component({
  standalone: true,
  selector: 'app-lesson-viewer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, BreadcrumbComponent, RuleRefChipComponent, CounterComponent],
  template: `
    <div class="lesson-viewer">
      <app-breadcrumb [items]="breadcrumbs()" />

      @if (lesson()) {
        <article class="lesson-viewer__article" aria-labelledby="lesson-title">
          <header class="lesson-viewer__header">
            <span class="lesson-viewer__module-label">{{ moduleTitle() }}</span>
            <h1 id="lesson-title" class="lesson-viewer__title">{{ lesson()!.titleEs }}</h1>
          </header>

          <!-- Content blocks -->
          <div class="lesson-blocks">
            @for (block of lesson()!.blocks; track $index) {
              @switch (block.type) {
                @case ('prose') {
                  <div class="lesson-block lesson-block--prose">
                    <p>{{ block.content }}</p>
                    @if (getNarrationSrc(lesson()!.id, $index); as src) {
                      <button
                        type="button"
                        class="narration-btn"
                        [class.narration-btn--playing]="isBlockPlaying(lesson()!.id, $index)"
                        [attr.aria-pressed]="isBlockPlaying(lesson()!.id, $index)"
                        [attr.aria-label]="isBlockPlaying(lesson()!.id, $index) ? 'Detener narración' : 'Escuchar este párrafo'"
                        (click)="toggleNarration(lesson()!.id, $index, src)">
                        <svg class="narration-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" width="16" height="16">
                          @if (isBlockPlaying(lesson()!.id, $index)) {
                            <!-- Pause icon -->
                            <rect x="4" y="3" width="4" height="14" rx="1"/>
                            <rect x="12" y="3" width="4" height="14" rx="1"/>
                          } @else {
                            <!-- Speaker icon -->
                            <path d="M9.5 3.5a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.8.4L5.7 13H3a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h2.7l3.5-3.4a.5.5 0 0 1 .8.4zM13.7 6.3a1 1 0 0 1 1.4 0 6 6 0 0 1 0 7.4 1 1 0 1 1-1.4-1.4 4 4 0 0 0 0-4.6 1 1 0 0 1 0-1.4z"/>
                          }
                        </svg>
                        {{ isBlockPlaying(lesson()!.id, $index) ? 'Detener' : 'Escuchar' }}
                      </button>
                    }
                  </div>
                }
                @case ('rule-callout') {
                  <aside class="lesson-block lesson-block--rule-callout" role="note">
                    @for (ref of block.ruleRefs ?? []; track ref.section) {
                      <app-rule-ref-chip [ruleRef]="ref" />
                    }
                    <p class="rule-callout__text">{{ block.content }}</p>
                    @if (getNarrationSrc(lesson()!.id, $index); as src) {
                      <button
                        type="button"
                        class="narration-btn narration-btn--rule"
                        [class.narration-btn--playing]="isBlockPlaying(lesson()!.id, $index)"
                        [attr.aria-pressed]="isBlockPlaying(lesson()!.id, $index)"
                        [attr.aria-label]="isBlockPlaying(lesson()!.id, $index) ? 'Detener narración' : 'Escuchar este párrafo'"
                        (click)="toggleNarration(lesson()!.id, $index, src)">
                        <svg class="narration-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" width="16" height="16">
                          @if (isBlockPlaying(lesson()!.id, $index)) {
                            <rect x="4" y="3" width="4" height="14" rx="1"/>
                            <rect x="12" y="3" width="4" height="14" rx="1"/>
                          } @else {
                            <path d="M9.5 3.5a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.8.4L5.7 13H3a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h2.7l3.5-3.4a.5.5 0 0 1 .8.4zM13.7 6.3a1 1 0 0 1 1.4 0 6 6 0 0 1 0 7.4 1 1 0 1 1-1.4-1.4 4 4 0 0 0 0-4.6 1 1 0 0 1 0-1.4z"/>
                          }
                        </svg>
                        {{ isBlockPlaying(lesson()!.id, $index) ? 'Detener' : 'Escuchar' }}
                      </button>
                    }
                  </aside>
                }
                @case ('image') {
                  <figure class="lesson-block lesson-block--image">
                    <img [src]="block.content"
                         [alt]="block.altText ?? ''"
                         loading="lazy"
                         class="lesson-block__img" />
                    @if (block.altText) {
                      <figcaption>{{ block.altText }}</figcaption>
                    }
                  </figure>
                }
                @case ('svg-snippet') {
                  <figure class="lesson-block lesson-block--svg" aria-label="Ilustración del tablero">
                    <img [src]="block.content"
                         [alt]="block.altText ?? 'Ilustración del juego'"
                         loading="lazy"
                         class="lesson-block__svg" />
                    @if (block.altText) {
                      <figcaption>{{ block.altText }}</figcaption>
                    }
                  </figure>
                }
                @case ('counter') {
                  <figure class="lesson-block lesson-block--counter">
                    <!--
                      Size fallback: annotated counters use a wide viewBox ("-95 -15 252 95")
                      that fits the Spanish labels, so ~720px keeps the glyph ≈170px and
                      labels ≈23px; height auto-follows the aspect. Non-annotated counters
                      use viewBox "0 0 60 60", so 200px gives a 200px square glyph.
                    -->
                    <ddob-counter
                      [unit]="block.counterConfig!.unit"
                      [side]="block.counterConfig!.side"
                      [size]="block.counterConfig!.size ?? (block.counterConfig!.annotated ? 720 : 200)"
                      [annotated]="block.counterConfig!.annotated ?? true" />
                    @if (block.altText) {
                      <figcaption>{{ block.altText }}</figcaption>
                    }
                  </figure>
                }
              }
            }
          </div>

          <!-- Worked example stepper (T-43) -->
          @if (lesson()!.workedExample) {
            <section class="worked-example" aria-labelledby="example-heading">
              <h2 id="example-heading" class="worked-example__title">
                {{ lesson()!.workedExample!.titleEs }}
              </h2>
              <p class="worked-example__scenario">
                {{ lesson()!.workedExample!.scenarioDescription }}
              </p>

              <div class="worked-example__step"
                   role="region"
                   [attr.aria-label]="'Paso ' + (currentStep() + 1) + ' de ' + totalSteps()">
                <div class="step-header">
                  <span class="step-label">Paso {{ currentStep() + 1 }} de {{ totalSteps() }}</span>
                  <div class="step-progress">
                    @for (i of stepRange(); track i) {
                      <div class="step-dot"
                           [class.step-dot--active]="i === currentStep()"
                           [class.step-dot--done]="i < currentStep()"
                           [attr.aria-hidden]="true">
                      </div>
                    }
                  </div>
                </div>

                <p class="step-description">
                  {{ currentStepData()?.descriptionEs }}
                </p>
              </div>

              <div class="worked-example__nav">
                @if (currentStep() > 0) {
                  <button type="button"
                          class="btn btn--secondary"
                          (click)="prevStep()"
                          aria-label="Paso anterior">
                    ← Anterior
                  </button>
                }

                @if (currentStep() < totalSteps() - 1) {
                  <button type="button"
                          class="btn btn--primary"
                          (click)="nextStep()"
                          aria-label="Siguiente paso">
                    Siguiente →
                  </button>
                } @else {
                  <button type="button"
                          class="btn btn--success"
                          [disabled]="lessonComplete()"
                          (click)="completeLesson()"
                          aria-label="Marcar lección como completada">
                    {{ lessonComplete() ? 'Lección completada ✓' : 'Completar lección' }}
                  </button>
                }
              </div>
            </section>
          } @else {
            <!-- No worked example: complete button appears after scrolling content -->
            <div class="lesson-viewer__complete">
              <button type="button"
                      class="btn btn--success"
                      [disabled]="lessonComplete()"
                      (click)="completeLesson()"
                      aria-label="Marcar lección como completada">
                {{ lessonComplete() ? 'Lección completada ✓' : 'Completar lección' }}
              </button>
            </div>
          }

          <!-- Back to module -->
          <div class="lesson-viewer__back">
            <a [routerLink]="['/modules', moduleId()]"
               class="back-link"
               aria-label="Volver al módulo">
              ← Volver al módulo
            </a>
          </div>
        </article>
      } @else {
        <p class="lesson-viewer__not-found">Lección no encontrada.</p>
        <a routerLink="/modules" class="back-link">← Volver al curso</a>
      }
    </div>
  `,
  styles: [`
    .lesson-viewer {
      max-width: var(--max-content-width);
      margin: 0 auto;
      padding: var(--space-6) var(--space-4);
    }

    .lesson-viewer__article {}

    .lesson-viewer__header {
      margin-bottom: var(--space-8);
    }

    .lesson-viewer__module-label {
      display: block;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--color-accent);
      margin-bottom: var(--space-2);
    }

    .lesson-viewer__title {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      line-height: var(--line-height-tight);
    }

    /* Content blocks */
    .lesson-blocks {
      display: flex;
      flex-direction: column;
      gap: var(--space-5);
      margin-bottom: var(--space-8);
    }

    .lesson-block--prose {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);

      p {
        font-size: var(--font-size-base);
        line-height: var(--line-height-relaxed);
        color: var(--color-text-primary);
        margin: 0;
      }
    }

    /* Narration toggle button */
    .narration-btn {
      align-self: flex-start;
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-1) var(--space-3);
      border: 1px solid var(--color-accent);
      border-radius: var(--radius-md);
      background: transparent;
      color: var(--color-accent);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      cursor: pointer;
      transition: background var(--transition-fast), color var(--transition-fast);
    }

    .narration-btn:hover {
      background: var(--color-accent);
      color: var(--color-bg);
    }

    .narration-btn--playing {
      background: var(--color-accent);
      color: var(--color-bg);
    }

    .narration-btn--rule {
      margin-top: var(--space-2);
    }

    .narration-btn:focus-visible {
      outline: 2px solid var(--color-accent);
      outline-offset: 3px;
    }

    .narration-icon {
      flex-shrink: 0;
    }

    .lesson-block--rule-callout {
      border-left: 3px solid var(--color-accent);
      background: var(--color-surface-alt);
      border-radius: 0 var(--radius-md) var(--radius-md) 0;
      padding: var(--space-4) var(--space-5);
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .lesson-block--image,
    .lesson-block--svg {
      text-align: center;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: var(--space-4);

      figcaption {
        margin-top: var(--space-2);
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
        font-style: italic;
      }
    }

    .lesson-block--counter {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: var(--space-6);

      figcaption {
        margin-top: var(--space-3);
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
        font-style: italic;
        text-align: center;
      }
    }

    .rule-callout__text {
      font-size: var(--font-size-base);
      color: var(--color-text-primary);
      line-height: var(--line-height-relaxed);
    }

    .lesson-block__img,
    .lesson-block__svg {
      max-width: 100%;
      height: auto;
      border-radius: var(--radius-sm);
    }

    /* Worked example stepper */
    .worked-example {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: var(--space-6);
      margin-bottom: var(--space-8);
    }

    .worked-example__title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      margin-bottom: var(--space-3);
    }

    .worked-example__scenario {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      line-height: var(--line-height-normal);
      margin-bottom: var(--space-5);
    }

    .worked-example__step {
      background: var(--color-surface-alt);
      border-radius: var(--radius-md);
      padding: var(--space-5);
      margin-bottom: var(--space-5);
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
    .step-dot--done { background: var(--color-success); }

    .step-description {
      font-size: var(--font-size-base);
      color: var(--color-text-primary);
      line-height: var(--line-height-relaxed);
    }

    .worked-example__nav {
      display: flex;
      gap: var(--space-3);
      justify-content: flex-end;
    }

    /* Buttons */
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
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none !important;
    }

    .btn:focus-visible {
      outline: 2px solid var(--color-accent);
      outline-offset: 3px;
    }

    .btn--primary {
      background: var(--color-accent);
      color: var(--color-bg);
    }

    .btn--primary:hover:not(:disabled) {
      background: #d4b060;
      transform: translateY(-1px);
    }

    .btn--secondary {
      background: var(--color-surface-alt);
      color: var(--color-text-primary);
      border: 1px solid var(--color-border);
    }

    .btn--secondary:hover:not(:disabled) {
      background: var(--color-border);
    }

    .btn--success {
      background: var(--color-success);
      color: white;
    }

    .btn--success:hover:not(:disabled) {
      background: #3d9963;
      transform: translateY(-1px);
    }

    .lesson-viewer__complete {
      text-align: right;
      margin-bottom: var(--space-8);
    }

    .lesson-viewer__back {
      padding-top: var(--space-6);
      border-top: 1px solid var(--color-border);
    }

    .lesson-viewer__not-found {
      color: var(--color-text-secondary);
      margin-bottom: var(--space-4);
    }

    .back-link {
      color: var(--color-accent);
      text-decoration: none;
      font-size: var(--font-size-sm);
    }

    .back-link:hover { text-decoration: underline; }
  `],
})
export class LessonViewerComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly narrationStore = inject(NarrationStore);

  readonly lesson = signal<Lesson | null>(null);
  readonly moduleId = signal<string>('');
  readonly lessonComplete = signal<boolean>(false);

  // Worked example stepper state
  readonly currentStep = signal<number>(0);

  readonly totalSteps = computed<number>(() => {
    return this.lesson()?.workedExample?.steps.length ?? 0;
  });

  readonly stepRange = computed<number[]>(() => {
    return Array.from({ length: this.totalSteps() }, (_, i) => i);
  });

  readonly currentStepData = computed<WorkedExampleStep | null>(() => {
    const steps = this.lesson()?.workedExample?.steps;
    if (!steps) return null;
    return steps[this.currentStep()] ?? null;
  });

  readonly moduleTitle = computed<string>(() => {
    const id = this.moduleId();
    const mod = ALL_MODULES.find((m) => m.id === id);
    return mod ? mod.titleEs : '';
  });

  readonly breadcrumbs = computed<BreadcrumbItem[]>(() => {
    const modId = this.moduleId();
    const modTitle = this.moduleTitle();
    const lesson = this.lesson();
    return [
      { label: 'Curso', route: ['/modules'] },
      { label: modTitle || 'Módulo', route: ['/modules', modId] },
      { label: lesson ? lesson.titleEs : 'Lección' },
    ];
  });

  private readonly progressRepo = inject<ProgressRepository>(LESSON_PROGRESS_REPO);

  constructor() {
    // React to route param changes, not just the first load. Angular reuses this
    // component instance when only the lessonId param changes (e.g. advancing to
    // the next lesson), so reading params once in ngOnInit would leave the view
    // stuck on the previous lesson.
    this.route.paramMap
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.loadLesson());
  }

  private loadLesson(): void {
    const modId = this.route.parent?.snapshot.paramMap.get('moduleId') ?? '';
    const lessonId = this.route.snapshot.paramMap.get('lessonId') ?? '';

    this.moduleId.set(modId);

    const mod = ALL_MODULES.find((m) => m.id === modId);
    const foundLesson = mod?.lessons.find((l) => l.id === lessonId) ?? null;
    this.lesson.set(foundLesson);

    // Reset per-lesson UI state so the new lesson starts clean.
    this.currentStep.set(0);
    this.lessonComplete.set(false);

    // Check if already completed
    if (modId && lessonId) {
      this.progressRepo.getModuleProgress(modId).then((progress) => {
        if (progress.lessonsCompleted.includes(lessonId)) {
          this.lessonComplete.set(true);
        }
      });
    }
  }

  nextStep(): void {
    if (this.currentStep() < this.totalSteps() - 1) {
      this.currentStep.update((s) => s + 1);
    }
  }

  prevStep(): void {
    if (this.currentStep() > 0) {
      this.currentStep.update((s) => s - 1);
    }
  }

  async completeLesson(): Promise<void> {
    const modId = this.moduleId();
    const lesson = this.lesson();
    if (!lesson || !modId || this.lessonComplete()) return;

    await this.progressRepo.setLessonComplete(modId, lesson.id);
    this.lessonComplete.set(true);

    // Navigate to the next lesson or module home
    const mod = ALL_MODULES.find((m) => m.id === modId);
    if (mod) {
      const idx = mod.lessons.findIndex((l) => l.id === lesson.id);
      const next = mod.lessons[idx + 1];
      if (next) {
        this.router.navigate(['/modules', modId, 'lessons', next.id]);
      } else {
        // All lessons done — go to drills
        if (mod.drills.length > 0) {
          this.router.navigate(['/modules', modId, 'drills', 0]);
        } else {
          this.router.navigate(['/modules', modId]);
        }
      }
    }
  }

  // ---- Narration helpers ----

  /**
   * Returns the audio asset src for a given block, or undefined if not narratable.
   * Called from the template to conditionally render the narration button.
   */
  getNarrationSrc(lessonId: string, blockIndex: number): string | undefined {
    return getBlockNarration(lessonId, blockIndex);
  }

  /**
   * Returns true if the given block is the currently active AND playing block.
   */
  isBlockPlaying(lessonId: string, blockIndex: number): boolean {
    const key = `${lessonId}#${blockIndex}`;
    return this.narrationStore.currentKey() === key && this.narrationStore.isPlaying();
  }

  /**
   * Toggles playback for the given block.
   */
  toggleNarration(lessonId: string, blockIndex: number, src: string): void {
    const key = `${lessonId}#${blockIndex}`;
    this.narrationStore.toggle(key, src);
  }
}
