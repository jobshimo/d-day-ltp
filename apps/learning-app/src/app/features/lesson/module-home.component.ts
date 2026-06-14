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
    <div class="module-home">
      <app-breadcrumb [items]="breadcrumbs()" />

      @if (module()) {
        <header class="module-home__header">
          <span class="module-home__label">Módulo {{ module()!.order }}</span>
          <h1 class="module-home__title">{{ module()!.titleEs }}</h1>
          <p class="module-home__desc">{{ module()!.descriptionEs }}</p>
        </header>

        <section class="module-home__section" aria-labelledby="lessons-heading">
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
      max-width: var(--max-content-width);
      margin: 0 auto;
      padding: var(--space-6) var(--space-4);
    }

    .module-home__header {
      margin-bottom: var(--space-8);
    }

    .module-home__label {
      display: block;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--color-accent);
      margin-bottom: var(--space-2);
    }

    .module-home__title {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      margin-bottom: var(--space-3);
    }

    .module-home__desc {
      font-size: var(--font-size-base);
      color: var(--color-text-secondary);
      line-height: var(--line-height-normal);
    }

    .module-home__section {
      margin-bottom: var(--space-8);
    }

    .module-home__section-title {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--color-text-muted);
      margin-bottom: var(--space-3);
    }

    .lesson-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .lesson-item {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-4);
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      text-decoration: none;
      color: var(--color-text-primary);
      transition: background var(--transition-fast), border-color var(--transition-fast);
    }

    .lesson-item:hover {
      background: var(--color-surface-alt);
      border-color: var(--color-accent-dim);
    }

    .lesson-item:focus-visible {
      outline: 2px solid var(--color-accent);
      outline-offset: 2px;
    }

    .lesson-item--done {
      border-left: 3px solid var(--color-success);
    }

    .lesson-item__num {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--color-surface-alt);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-accent);
      flex-shrink: 0;
    }

    .lesson-item__title {
      flex: 1;
      font-size: var(--font-size-base);
    }

    .lesson-item__check {
      color: var(--color-success);
      font-weight: var(--font-weight-bold);
    }

    .module-home__action-link {
      display: inline-flex;
      align-items: center;
      padding: var(--space-3) var(--space-5);
      background: var(--color-accent);
      color: var(--color-bg);
      border-radius: var(--radius-md);
      font-weight: var(--font-weight-semibold);
      text-decoration: none;
      transition: background var(--transition-fast), transform var(--transition-fast);
    }

    .module-home__action-link:hover {
      background: #d4b060;
      transform: translateY(-1px);
    }

    .module-home__action-link:focus-visible {
      outline: 2px solid var(--color-accent);
      outline-offset: 3px;
    }

    .module-home__action-link--done {
      background: var(--color-success);
      color: white;
    }

    .module-home__locked-msg {
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
      padding: var(--space-3) var(--space-4);
      background: var(--color-surface);
      border: 1px dashed var(--color-border);
      border-radius: var(--radius-md);
    }

    .module-home__back {
      margin-top: var(--space-8);
      padding-top: var(--space-6);
      border-top: 1px solid var(--color-border);
    }

    .module-home__not-found {
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
