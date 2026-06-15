import { Component, Input, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { ModuleListEntry } from 'application-course-store';
import { ALL_MODULES } from 'content';

/** Rule-section range per module — documented in libs/content modules.ts. */
const SECTION_REFS: Record<string, string> = {
  'module-1': '§1–§3',
  'module-2': '§4–§5',
  'module-3': '§6',
  'module-4': '§6.3',
  'module-5': '§7–§8',
  'module-6': '§9–§10',
  'module-7': '§11–§13',
  'module-8': '§14–§23',
};

interface ModuleDetail {
  sectionRef: string;
  lessons: number;
  drills: number;
  quiz: number;
}

@Component({
  standalone: true,
  selector: 'app-module-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <a [routerLink]="['/modules', modState().moduleId]"
       class="card card--hov mod-card"
       [attr.aria-label]="ariaLabel()">

      <div class="display mod-card__num" aria-hidden="true">{{ orderPadded() }}</div>

      <div class="mod-card__body">
        <div class="mod-card__titlerow">
          <h2 class="serif mod-card__title">{{ modState().titleEs }}</h2>
          <span class="rule-chip">{{ detail().sectionRef }}</span>
        </div>
        <p class="mod-card__desc">{{ modState().descriptionEs }}</p>
        <div class="mod-card__meta">
          <span class="kicker">{{ detail().lessons }} {{ detail().lessons === 1 ? 'lección' : 'lecciones' }}</span>
          @if (detail().drills > 0) {
            <span class="kicker">{{ detail().drills }} {{ detail().drills === 1 ? 'ejercicio' : 'ejercicios' }}</span>
          }
          @if (detail().quiz > 0) {
            <span class="kicker">examen · {{ detail().quiz }}</span>
          }
        </div>
      </div>

      <div class="mod-card__status">
        <span class="stencil mod-card__statuslabel">
          @if (modState().completionPercent >= 100) {
            <span class="mod-card__check" aria-hidden="true">✓</span> Completado · 100%
          } @else if (modState().completionPercent > 0) {
            <span class="mod-card__dot" aria-hidden="true">●</span> En curso · {{ modState().completionPercent }}%
          } @else {
            <span class="mod-card__dot" aria-hidden="true">●</span> Disponible
          }
        </span>
        @if (modState().order === 1) {
          <span class="stamp mod-card__stamp">Empieza aquí</span>
        }
        <span class="stencil mod-card__open" aria-hidden="true">Abrir →</span>
        @if (modState().completionPercent > 0 && modState().completionPercent < 100) {
          <div class="mod-card__bar" aria-hidden="true">
            <div class="mod-card__fill" [style.width.%]="modState().completionPercent"></div>
          </div>
        }
      </div>
    </a>
  `,
  styles: [`
    :host { display: block; }

    .mod-card {
      display: grid;
      grid-template-columns: 80px 1fr auto;
      align-items: center;
      gap: 28px;
      padding: 24px 30px;
      border-left: 2px solid var(--accent);
      text-decoration: none;
    }

    .mod-card__num {
      font-size: 54px;
      color: var(--steel-2);
      line-height: 0.8;
      -webkit-text-stroke: 1px var(--line-strong);
    }

    .mod-card__titlerow {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 7px;
      flex-wrap: wrap;
    }
    .mod-card__title { font-size: 23px; }
    .mod-card__desc {
      color: var(--muted);
      font-size: 15px;
      margin: 0;
      line-height: 1.55;
      max-width: 62ch;
    }
    .mod-card__meta { display: flex; gap: 16px; margin-top: 12px; flex-wrap: wrap; }

    .mod-card__status {
      text-align: right;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 12px;
      min-width: 120px;
    }
    .mod-card__statuslabel {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.14em;
      color: var(--accent);
      display: inline-flex;
      align-items: center;
      gap: 7px;
    }
    .mod-card__dot { font-size: 9px; }
    .mod-card__check { font-size: 12px; }
    .mod-card__stamp { transform: rotate(-2deg); }
    .mod-card__open {
      font-size: 13px;
      color: var(--accent);
      letter-spacing: 0.08em;
    }
    .mod-card__bar {
      width: 110px;
      height: 4px;
      background: var(--steel);
      border-radius: var(--radius-full);
      overflow: hidden;
    }
    .mod-card__fill {
      height: 100%;
      background: var(--accent);
      border-radius: var(--radius-full);
      transition: width var(--transition-slow);
    }

    @media (max-width: 680px) {
      .mod-card { grid-template-columns: 56px 1fr; gap: 16px; padding: 20px 22px; }
      .mod-card__num { font-size: 40px; }
      .mod-card__status {
        grid-column: 1 / -1;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: 100%;
      }
      .mod-card__stamp { display: none; }
    }
  `],
})
export class ModuleCardComponent {
  // @Input() with WritableSignal mirror for JIT/AOT test compatibility.
  // input.required() is AOT-only; @Input() works in both JIT (TestBed) and AOT.
  @Input({ required: true })
  set mod(value: ModuleListEntry) {
    this.modState.set(value);
  }

  readonly modState = signal<ModuleListEntry>({
    moduleId: '',
    order: 0,
    titleEs: '',
    descriptionEs: '',
    isUnlocked: true,
    isPreview: false,
    completionPercent: 0,
  });

  readonly detail = computed<ModuleDetail>(() => {
    const id = this.modState().moduleId;
    const mod = ALL_MODULES.find((m) => m.id === id);
    return {
      sectionRef: SECTION_REFS[id] ?? '',
      lessons: mod?.lessons.length ?? 0,
      drills: mod?.drills.length ?? 0,
      quiz: mod?.reviewQuiz.length ?? 0,
    };
  });

  orderPadded(): string {
    return String(this.modState().order).padStart(2, '0');
  }

  ariaLabel(): string {
    const m = this.modState();
    if (!m.moduleId) return '';
    return `Módulo ${m.order}: ${m.titleEs} — ${m.completionPercent}% completado`;
  }
}
