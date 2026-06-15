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
    <div class="lesson-viewer screen wrap">
      <app-breadcrumb [items]="breadcrumbs()" />

      @if (lesson()) {
        <article class="lesson-viewer__article" aria-labelledby="lesson-title">
          <header class="lesson-viewer__header">
            <span class="lesson-viewer__module-label eyebrow">{{ moduleTitle() }}</span>
            <h1 id="lesson-title" class="lesson-viewer__title display">{{ lesson()!.titleEs }}</h1>
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
                    <div class="rule-callout__header">
                      <span class="rule-callout__label">Regla</span>
                      @if ((block.ruleRefs ?? []).length > 0) {
                        <div class="rule-callout__chips">
                          @for (ref of block.ruleRefs ?? []; track ref.section) {
                            <app-rule-ref-chip [ruleRef]="ref" />
                          }
                        </div>
                      }
                    </div>
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
                         loading="eager"
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
                         loading="eager"
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
                  <div class="step-progress">
                    @for (i of stepRange(); track i) {
                      <div class="step-dot"
                           [class.step-dot--active]="i === currentStep()"
                           [class.step-dot--done]="i < currentStep()"
                           [attr.aria-hidden]="true">
                      </div>
                    }
                  </div>
                  <span class="step-label">Paso {{ currentStep() + 1 }}/{{ totalSteps() }}</span>
                </div>

                <div class="step-number" aria-hidden="true">{{ currentStep() + 1 }}</div>
                <p class="step-description">
                  {{ currentStepData()?.descriptionEs }}
                </p>
              </div>

              <div class="worked-example__nav">
                @if (currentStep() > 0) {
                  <button type="button"
                          class="btn btn--ghost"
                          (click)="prevStep()"
                          aria-label="Paso anterior">
                    ← Anterior
                  </button>
                } @else {
                  <span></span>
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
      padding: 60px 0 90px;
    }

    .lesson-viewer__article {
      max-width: 760px;
    }

    .lesson-viewer__header {
      margin-bottom: 48px;
      padding-bottom: 32px;
      border-bottom: 1px solid var(--line);
    }

    .lesson-viewer__module-label {
      display: block;
      font-family: 'Oswald', sans-serif;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: .14em;
      color: var(--accent);
      margin-bottom: 10px;
    }

    .lesson-viewer__title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(28px, 4vw, 46px);
      font-weight: 900;
      color: var(--bone);
      line-height: 1.1;
      margin: 0;
    }

    /* Content blocks */
    .lesson-blocks {
      display: flex;
      flex-direction: column;
      gap: 28px;
      margin-bottom: 56px;
    }

    .lesson-block--prose {
      display: flex;
      flex-direction: column;
      gap: 10px;

      p {
        font-size: 18px;
        line-height: 1.74;
        color: var(--sand);
        margin: 0 0 22px;
      }
    }

    /* Narration toggle button */
    .narration-btn {
      align-self: flex-start;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      border: 1px solid var(--line-strong);
      border-radius: 50px;
      background: transparent;
      color: var(--sand);
      font-family: 'Space Mono', monospace;
      font-size: 11px;
      letter-spacing: .04em;
      cursor: pointer;
      transition: border-color 120ms ease, color 120ms ease, background 120ms ease;
    }

    .narration-btn:hover {
      border-color: var(--accent);
      color: var(--accent);
    }

    .narration-btn--playing {
      border-color: var(--accent);
      color: var(--accent);
      background: var(--accent-soft);
    }

    .narration-btn--rule {
      margin-top: 8px;
    }

    .narration-btn:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 3px;
    }

    .narration-icon {
      flex-shrink: 0;
    }

    .lesson-block--rule-callout {
      border-left: 2px solid var(--accent);
      background: var(--char-2);
      border-radius: 0 var(--radius) var(--radius) 0;
      padding: 20px 24px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .rule-callout__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 6px;
    }

    .rule-callout__label {
      font-family: 'Oswald', sans-serif;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: .14em;
      color: var(--accent);
    }

    .rule-callout__chips {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .lesson-block--image,
    .lesson-block--svg {
      text-align: center;
      background: var(--char);
      border: 1px solid var(--line);
      border-radius: var(--radius);
      padding: 30px;

      figcaption {
        margin-top: 12px;
        font-family: 'Space Mono', monospace;
        font-size: 12px;
        color: var(--muted);
        font-style: normal;
        letter-spacing: .03em;
      }
    }

    .lesson-block--counter {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: var(--char);
      border: 1px solid var(--line);
      border-radius: var(--radius);
      padding: 30px;

      figcaption {
        margin-top: 14px;
        font-family: 'Space Mono', monospace;
        font-size: 12px;
        color: var(--muted);
        font-style: normal;
        letter-spacing: .03em;
        text-align: center;
      }
    }

    .rule-callout__text {
      font-size: 16px;
      color: var(--bone);
      line-height: 1.65;
      margin: 0;
    }

    .lesson-block__img,
    .lesson-block__svg {
      max-width: 100%;
      height: auto;
      border-radius: var(--radius);
    }

    /* Worked example stepper */
    .worked-example {
      background: var(--char);
      border: 1px solid var(--line);
      border-radius: var(--radius);
      padding: 30px;
      margin-bottom: 56px;
    }

    .worked-example__title {
      font-family: 'Oswald', sans-serif;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: .14em;
      color: var(--accent);
      margin: 0 0 10px;
    }

    .worked-example__scenario {
      font-size: 18px;
      color: var(--sand);
      line-height: 1.7;
      margin: 0 0 28px;
    }

    .worked-example__step {
      padding: 0 0 24px;
      margin-bottom: 24px;
    }

    .step-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .step-label {
      font-family: 'Space Mono', monospace;
      font-size: 11px;
      letter-spacing: .06em;
      text-transform: uppercase;
      color: var(--muted);
    }

    .step-progress {
      display: flex;
      gap: 3px;
      align-items: center;
      flex: 1;
      margin: 0 16px;
    }

    .step-dot {
      flex: 1;
      height: 4px;
      background: var(--steel);
      border-radius: 2px;
      transition: background 150ms ease;
    }

    .step-dot--active { background: var(--accent); }
    .step-dot--done { background: var(--accent); opacity: .5; }

    .step-number {
      font-family: 'Playfair Display', serif;
      font-size: 58px;
      font-weight: 900;
      color: var(--accent);
      line-height: 1;
      margin: 0 0 12px;
    }

    .step-description {
      font-size: 18px;
      color: var(--bone);
      line-height: 1.65;
      margin: 0;
    }

    .worked-example__nav {
      display: flex;
      gap: 12px;
      align-items: center;
      justify-content: space-between;
      padding-top: 20px;
      border-top: 1px solid var(--line);
    }

    /* Buttons (scoped overrides — global .btn classes are in styles.scss) */
    .btn {
      display: inline-flex;
      align-items: center;
      padding: 10px 22px;
      border: none;
      border-radius: var(--radius);
      font-family: 'Oswald', sans-serif;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: .08em;
      text-transform: uppercase;
      cursor: pointer;
      transition: opacity 120ms ease, transform 120ms ease;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none !important;
    }

    .btn:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 3px;
    }

    .btn--primary {
      background: var(--accent);
      color: var(--ink);
    }

    .btn--primary:hover:not(:disabled) {
      opacity: .88;
      transform: translateY(-1px);
    }

    .btn--ghost {
      background: transparent;
      color: var(--sand);
      border: 1px solid var(--line-strong);
    }

    .btn--ghost:hover:not(:disabled) {
      border-color: var(--accent);
      color: var(--accent);
    }

    .btn--secondary {
      background: var(--steel);
      color: var(--sand);
      border: 1px solid var(--line);
    }

    .btn--secondary:hover:not(:disabled) {
      background: var(--steel-2);
    }

    .btn--success {
      background: var(--accent);
      color: var(--ink);
    }

    .btn--success:hover:not(:disabled) {
      opacity: .88;
      transform: translateY(-1px);
    }

    .lesson-viewer__complete {
      text-align: right;
      margin-bottom: 56px;
    }

    .lesson-viewer__back {
      padding-top: 24px;
      border-top: 1px solid var(--line);
    }

    .lesson-viewer__not-found {
      color: var(--muted);
      margin-bottom: 16px;
    }
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
