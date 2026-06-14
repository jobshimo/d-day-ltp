import { Component, Input, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';
import type { ModuleListEntry } from 'application-course-store';

@Component({
  standalone: true,
  selector: 'app-module-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NgTemplateOutlet],
  template: `
    <a [routerLink]="['/modules', modState().moduleId]"
       class="card card--link"
       [attr.aria-label]="ariaLabel()">
      <ng-container *ngTemplateOutlet="body" />
    </a>

    <ng-template #body>
      <div class="card__header">
        <span class="card__order">Módulo {{ modState().order }}</span>
        <span class="card__icon" aria-hidden="true">
          @if (modState().completionPercent === 100) { ✓ }
          @else { ● }
        </span>
      </div>

      <h2 class="card__title">{{ modState().titleEs }}</h2>
      <p class="card__desc">{{ modState().descriptionEs }}</p>

      <div class="card__progress"
           role="progressbar"
           [attr.aria-valuenow]="modState().completionPercent"
           aria-valuemin="0"
           aria-valuemax="100"
           [attr.aria-label]="'Progreso: ' + modState().completionPercent + '%'">
        <div class="card__bar">
          <div class="card__fill" [style.width.%]="modState().completionPercent"></div>
        </div>
        <span class="card__pct">{{ modState().completionPercent }}%</span>
      </div>
    </ng-template>
  `,
  styles: [`
    :host { display: block; height: 100%; }

    .card {
      display: flex;
      flex-direction: column;
      padding: var(--space-5);
      height: 100%;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      color: inherit;
      text-decoration: none;
      transition: background var(--transition-fast), border-color var(--transition-fast),
                  transform var(--transition-fast), box-shadow var(--transition-fast);
    }

    .card--link:hover {
      background: var(--color-surface-alt);
      border-color: var(--color-accent-dim);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .card--link:focus-visible {
      outline: 2px solid var(--color-accent);
      outline-offset: 2px;
    }

    .card__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--space-3);
    }

    .card__order {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--color-accent);
    }

    .card__icon { font-size: var(--font-size-base); }

    .card__title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      margin-bottom: var(--space-2);
      line-height: var(--line-height-tight);
    }

    .card__desc {
      flex: 1;
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      line-height: var(--line-height-normal);
      margin-bottom: var(--space-4);
    }

    .card__progress {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .card__bar {
      flex: 1;
      height: 6px;
      background: var(--color-progress-track);
      border-radius: var(--radius-full);
      overflow: hidden;
    }

    .card__fill {
      height: 100%;
      background: var(--color-progress-fill);
      border-radius: var(--radius-full);
      transition: width var(--transition-slow);
    }

    .card__pct {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-secondary);
      min-width: 2.5rem;
      text-align: right;
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

  ariaLabel(): string {
    const m = this.modState();
    if (!m.moduleId) return '';
    return `Módulo ${m.order}: ${m.titleEs} — ${m.completionPercent}% completado`;
  }
}
