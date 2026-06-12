import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';
import type { ModuleListEntry } from 'application-course-store';

@Component({
  standalone: true,
  selector: 'app-module-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NgTemplateOutlet],
  template: `
    @if (isAccessible()) {
      <a [routerLink]="['/modules', mod().moduleId]"
         class="card card--link"
         [class.card--preview]="mod().isPreview"
         [attr.aria-label]="ariaLabel()">
        <ng-container *ngTemplateOutlet="body" />
      </a>
    } @else {
      <div class="card card--disabled"
           [attr.aria-label]="ariaLabel()"
           role="article"
           aria-disabled="true">
        <ng-container *ngTemplateOutlet="body" />
      </div>
    }

    <ng-template #body>
      <div class="card__header">
        <span class="card__order">Módulo {{ mod().order }}</span>
        <span class="card__icon" aria-hidden="true">
          @if (mod().isPreview) { 👁 }
          @else if (mod().isUnlocked && mod().completionPercent === 100) { ✓ }
          @else if (mod().isUnlocked) { ● }
          @else { 🔒 }
        </span>
      </div>

      <h2 class="card__title">{{ mod().titleEs }}</h2>
      <p class="card__desc">{{ mod().descriptionEs }}</p>

      @if (mod().isPreview) {
        <span class="card__badge">Avance</span>
      } @else if (!mod().isUnlocked) {
        <p class="card__locked">Completa el módulo anterior para desbloquear</p>
      } @else {
        <div class="card__progress"
             role="progressbar"
             [attr.aria-valuenow]="mod().completionPercent"
             aria-valuemin="0"
             aria-valuemax="100"
             [attr.aria-label]="'Progreso: ' + mod().completionPercent + '%'">
          <div class="card__bar">
            <div class="card__fill" [style.width.%]="mod().completionPercent"></div>
          </div>
          <span class="card__pct">{{ mod().completionPercent }}%</span>
        </div>
      }
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

    .card--preview { border-color: var(--color-accent-dim); }

    .card--disabled {
      cursor: not-allowed;
      opacity: 0.55;
      border-color: var(--color-locked);
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

    .card__badge {
      display: inline-block;
      padding: var(--space-1) var(--space-3);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      background: rgba(200, 160, 74, 0.15);
      color: var(--color-accent);
      border: 1px solid var(--color-accent-dim);
    }

    .card__locked {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      font-style: italic;
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
  readonly mod = input.required<ModuleListEntry>();

  isAccessible(): boolean {
    return this.mod().isUnlocked || this.mod().isPreview;
  }

  ariaLabel(): string {
    const m = this.mod();
    if (m.isPreview) return `Módulo ${m.order}: ${m.titleEs} (Avance)`;
    if (!m.isUnlocked) return `Módulo ${m.order}: ${m.titleEs} — bloqueado`;
    return `Módulo ${m.order}: ${m.titleEs} — ${m.completionPercent}% completado`;
  }
}
