import {
  Component,
  inject,
  signal,
  ChangeDetectionStrategy,
  InjectionToken,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { PROGRESS_REPO_TOKEN_ID } from 'domain-progress';
import type { ProgressRepository } from 'domain-progress';
import { BreadcrumbComponent } from '../../shared/breadcrumb.component';

export const SETTINGS_PROGRESS_REPO = new InjectionToken<ProgressRepository>(
  PROGRESS_REPO_TOKEN_ID,
);

@Component({
  standalone: true,
  selector: 'app-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, BreadcrumbComponent],
  template: `
    <div class="settings">
      <app-breadcrumb [items]="[{ label: 'Curso', route: ['/modules'] }, { label: 'Configuración' }]" />

      <h1 class="settings__title">Configuración</h1>

      <section class="settings__section" aria-labelledby="reset-heading">
        <h2 id="reset-heading" class="settings__section-title">Progreso</h2>
        <p class="settings__desc">
          Reiniciar el progreso eliminará todo el avance registrado en todos los módulos.
          Esta acción no se puede deshacer.
        </p>

        @if (!confirming()) {
          <button type="button"
                  class="btn btn--danger"
                  (click)="startConfirm()"
                  aria-label="Reiniciar todo el progreso">
            Reiniciar progreso
          </button>
        } @else {
          <div class="settings__confirm"
               role="alertdialog"
               aria-modal="false"
               aria-labelledby="confirm-heading"
               aria-describedby="confirm-desc">
            <h3 id="confirm-heading" class="settings__confirm-title">
              ¿Confirmar reinicio?
            </h3>
            <p id="confirm-desc" class="settings__confirm-desc">
              Se eliminará todo el progreso. Esta acción no se puede deshacer.
            </p>
            <div class="settings__confirm-actions">
              <button type="button"
                      class="btn btn--secondary"
                      (click)="cancelConfirm()"
                      aria-label="Cancelar">
                Cancelar
              </button>
              <button type="button"
                      class="btn btn--danger"
                      [disabled]="resetting()"
                      (click)="confirmReset()"
                      aria-label="Confirmar reinicio de progreso">
                {{ resetting() ? 'Reiniciando…' : 'Sí, reiniciar' }}
              </button>
            </div>
          </div>
        }

        @if (resetDone()) {
          <div class="settings__success"
               role="status"
               aria-live="polite">
            ✓ Progreso reiniciado. Módulo 1 desbloqueado.
          </div>
        }
      </section>

      <div class="settings__back">
        <a routerLink="/modules" class="back-link">← Volver al curso</a>
      </div>
    </div>
  `,
  styles: [`
    .settings {
      max-width: var(--max-content-width);
      margin: 0 auto;
      padding: var(--space-6) var(--space-4);
    }

    .settings__title {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      margin-bottom: var(--space-8);
    }

    .settings__section {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: var(--space-6);
      margin-bottom: var(--space-6);
    }

    .settings__section-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      margin-bottom: var(--space-3);
    }

    .settings__desc {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      line-height: var(--line-height-normal);
      margin-bottom: var(--space-4);
    }

    .settings__confirm {
      background: var(--color-surface-alt);
      border: 1px solid var(--color-error);
      border-radius: var(--radius-md);
      padding: var(--space-4) var(--space-5);
      margin-top: var(--space-4);
    }

    .settings__confirm-title {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--color-error);
      margin-bottom: var(--space-2);
    }

    .settings__confirm-desc {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      margin-bottom: var(--space-4);
    }

    .settings__confirm-actions {
      display: flex;
      gap: var(--space-3);
    }

    .settings__success {
      margin-top: var(--space-4);
      padding: var(--space-3) var(--space-4);
      background: var(--color-success-bg);
      border: 1px solid var(--color-success);
      border-radius: var(--radius-md);
      color: var(--color-success);
      font-weight: var(--font-weight-medium);
    }

    .settings__back {
      padding-top: var(--space-6);
      border-top: 1px solid var(--color-border);
    }

    .back-link {
      color: var(--color-accent);
      text-decoration: none;
      font-size: var(--font-size-sm);

      &:hover { text-decoration: underline; }
    }

    /* Buttons */
    .btn {
      display: inline-flex;
      align-items: center;
      padding: var(--space-2) var(--space-5);
      border: none;
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      cursor: pointer;
      transition: background var(--transition-fast), transform var(--transition-fast);

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      &:focus-visible {
        outline: 2px solid var(--color-accent);
        outline-offset: 3px;
      }

      &--danger {
        background: var(--color-error);
        color: white;

        &:hover:not(:disabled) { background: #c44; }
      }

      &--secondary {
        background: var(--color-surface-alt);
        color: var(--color-text-primary);
        border: 1px solid var(--color-border);

        &:hover:not(:disabled) { background: var(--color-border); }
      }
    }
  `],
})
export class SettingsComponent {

  readonly confirming = signal(false);
  readonly resetting = signal(false);
  readonly resetDone = signal(false);

  private readonly progressRepo = inject<ProgressRepository>(SETTINGS_PROGRESS_REPO);

  startConfirm(): void {
    this.confirming.set(true);
    this.resetDone.set(false);
  }

  cancelConfirm(): void {
    this.confirming.set(false);
  }

  async confirmReset(): Promise<void> {
    this.resetting.set(true);
    try {
      await this.progressRepo.resetProgress();
      this.resetDone.set(true);
      this.confirming.set(false);
    } finally {
      this.resetting.set(false);
    }
  }
}
