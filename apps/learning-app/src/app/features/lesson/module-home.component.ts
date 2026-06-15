import {
  Component,
  OnInit,
  inject,
  computed,
  signal,
  ChangeDetectionStrategy,
  InjectionToken,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ALL_MODULES } from 'content';
import type { CourseModule, ModuleProgress } from 'content-schema';
import { PROGRESS_REPO_TOKEN_ID } from 'domain-progress';
import type { ProgressRepository } from 'domain-progress';
import { BreadcrumbComponent } from '../../shared/breadcrumb.component';
import type { BreadcrumbItem } from '../../shared/breadcrumb.component';

export const MODULE_PROGRESS_REPO = new InjectionToken<ProgressRepository>(
  PROGRESS_REPO_TOKEN_ID,
);

@Component({
  standalone: true,
  selector: 'app-module-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, BreadcrumbComponent],
  template: `
    <div class="module-home screen wrap">
      <app-breadcrumb [items]="breadcrumbs()" />

      @if (module()) {
        <header class="module-home__header">
          <span class="module-home__label eyebrow">Módulo {{ module()!.order }}</span>
          <h1 class="module-home__title display">{{ module()!.titleEs }}</h1>
          <p class="module-home__desc lede">{{ module()!.descriptionEs }}</p>
        </header>

        <section class="module-home__section" aria-labelledby="lessons-heading">
          <p class="module-home__section-kicker" aria-hidden="true">Contenido</p>
          <h2 id="lessons-heading" class="module-home__section-title">Lecciones</h2>
          <ol class="lesson-list" aria-label="Lista de lecciones">
            @for (lesson of module()!.lessons; track lesson.id; let i = $index) {
              <li>
                <a [routerLink]="['lessons', lesson.id]"
                   class="lesson-item"
                   [class.lesson-item--done]="isLessonDone(lesson.id)"
                   [attr.aria-label]="lesson.titleEs + (isLessonDone(lesson.id) ? ' — completada' : '')">
                  <span class="lesson-item__num">{{ i + 1 }}</span>
                  <span class="lesson-item__title">{{ lesson.titleEs }}</span>
                  @if (isLessonDone(lesson.id)) {
                    <span class="lesson-item__check" aria-hidden="true">✓</span>
                  }
                </a>
              </li>
            }
          </ol>
        </section>

        @if (module()!.drills.length > 0) {
          <section class="module-home__section" aria-labelledby="drills-heading">
            <p class="module-home__section-kicker" aria-hidden="true">Práctica</p>
            <h2 id="drills-heading" class="module-home__section-title">Ejercicios</h2>
            <a [routerLink]="['drills', 0]"
               class="module-home__action-link"
               [class.module-home__action-link--done]="allDrillsDone()">
              {{ allDrillsDone() ? 'Repasar ejercicios' : 'Comenzar ejercicios' }}
              ({{ completedDrillCount() }}/{{ module()!.drills.length }})
            </a>
          </section>
        }

        @if (module()!.reviewQuiz.length > 0) {
          <section class="module-home__section" aria-labelledby="quiz-heading">
            <p class="module-home__section-kicker" aria-hidden="true">Evaluación</p>
            <h2 id="quiz-heading" class="module-home__section-title">Examen de repaso</h2>
            @if (allDrillsDone()) {
              <a [routerLink]="['quiz']"
                 class="module-home__action-link"
                 [class.module-home__action-link--done]="quizPassed()">
                {{ quizPassed() ? 'Examen superado ✓' : 'Ir al examen' }}
              </a>
            } @else {
              <p class="module-home__locked-msg">
                Completa todos los ejercicios para desbloquear el examen
              </p>
            }
          </section>
        }

        <div class="module-home__back">
          <a routerLink="/modules" class="back-link" aria-label="Volver a la lista de módulos">
            ← Volver al curso
          </a>
        </div>
      } @else {
        <p class="module-home__not-found">Módulo no encontrado.</p>
        <a routerLink="/modules" class="back-link">← Volver al curso</a>
      }
    </div>
  `,
  styles: [`
    .module-home {
      padding: 60px 0 90px;
    }

    .module-home__header {
      margin-bottom: 56px;
    }

    .module-home__label {
      display: block;
      font-family: 'Oswald', sans-serif;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: .14em;
      color: var(--accent);
      margin-bottom: 10px;
    }

    .module-home__title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(32px, 4vw, 52px);
      font-weight: 900;
      color: var(--bone);
      line-height: 1.1;
      margin: 0 0 18px;
    }

    .module-home__desc {
      font-size: 18px;
      color: var(--sand);
      line-height: 1.7;
      max-width: 640px;
      margin: 0;
    }

    .module-home__section {
      margin-bottom: 56px;
    }

    .module-home__section-kicker {
      font-family: 'Oswald', sans-serif;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: .14em;
      color: var(--faint);
      margin: 0 0 6px;
    }

    .module-home__section-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(22px, 3vw, 32px);
      font-weight: 700;
      color: var(--bone);
      margin: 0 0 20px;
    }

    .lesson-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .lesson-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 18px 22px;
      background: var(--char);
      border: 1px solid var(--line);
      border-radius: var(--radius);
      text-decoration: none;
      color: var(--sand);
      transition: background 120ms ease, border-color 120ms ease;
    }

    .lesson-item:hover {
      background: var(--char-2);
      border-color: var(--line-strong);
    }

    .lesson-item:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
    }

    .lesson-item--done {
      border-left: 2px solid var(--accent);
    }

    .lesson-item__num {
      font-family: 'Space Mono', monospace;
      font-size: 12px;
      color: var(--faint);
      flex-shrink: 0;
      min-width: 20px;
    }

    .lesson-item__title {
      flex: 1;
      font-family: 'Playfair Display', serif;
      font-size: 17px;
      color: var(--sand);
    }

    .lesson-item__check {
      color: var(--accent);
      font-size: 13px;
    }

    .module-home__action-link {
      display: inline-flex;
      align-items: center;
      padding: 11px 24px;
      background: var(--accent);
      color: var(--ink);
      border-radius: var(--radius);
      font-family: 'Oswald', sans-serif;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: .08em;
      text-transform: uppercase;
      text-decoration: none;
      transition: opacity 120ms ease, transform 120ms ease;
    }

    .module-home__action-link:hover {
      opacity: .88;
      transform: translateY(-1px);
    }

    .module-home__action-link:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 3px;
    }

    .module-home__action-link--done {
      background: var(--steel-2);
      color: var(--muted);
    }

    .module-home__locked-msg {
      font-family: 'Space Mono', monospace;
      font-size: 12px;
      color: var(--faint);
      letter-spacing: .04em;
      padding: 14px 18px;
      background: var(--char);
      border: 1px dashed var(--line);
      border-radius: var(--radius);
    }

    .module-home__back {
      margin-top: 56px;
      padding-top: 24px;
      border-top: 1px solid var(--line);
    }

    .module-home__not-found {
      color: var(--muted);
      margin-bottom: 16px;
    }
  `],
})
export class ModuleHomeComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly _moduleId = signal<string>('');
  private readonly _progress = signal<ModuleProgress | null>(null);

  readonly module = computed<CourseModule | null>(() => {
    const id = this._moduleId();
    return ALL_MODULES.find((m) => m.id === id) ?? null;
  });

  readonly breadcrumbs = computed<BreadcrumbItem[]>(() => {
    const mod = this.module();
    return [
      { label: 'Curso', route: ['/modules'] },
      { label: mod ? mod.titleEs : 'Módulo' },
    ];
  });

  readonly completedDrillCount = computed<number>(() => {
    const p = this._progress();
    if (!p) return 0;
    return Object.keys(p.drillResults).length;
  });

  readonly allDrillsDone = computed<boolean>(() => {
    const mod = this.module();
    if (!mod) return false;
    return this.completedDrillCount() >= mod.drills.length;
  });

  readonly quizPassed = computed<boolean>(() => {
    return this._progress()?.quizResult?.passed ?? false;
  });

  private readonly progressRepo = inject<ProgressRepository>(MODULE_PROGRESS_REPO);

  ngOnInit(): void {
    const id = this.route.parent?.snapshot.paramMap.get('moduleId') ?? '';
    this._moduleId.set(id);
    this.loadProgress(id);
  }

  private async loadProgress(moduleId: string): Promise<void> {
    try {
      const progress = await this.progressRepo.getModuleProgress(moduleId);
      this._progress.set(progress);
    } catch {
      this._progress.set(null);
    }
  }

  isLessonDone(lessonId: string): boolean {
    return this._progress()?.lessonsCompleted.includes(lessonId) ?? false;
  }
}
