import {
  Component,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SessionStore } from 'application-session-store';

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * RegisterComponent — standalone registration form.
 *
 * UI copy in Spanish per app convention.
 * Mandatory non-dismissable warning: there is no password recovery (REG-07/DM-04).
 * Client-side: validates email format + password minimum 8 chars.
 * Server-side: 409 email already registered shown as friendly Spanish message.
 * On success: full page reload so app.config re-evaluates adapter selection.
 */
@Component({
  standalone: true,
  selector: 'app-register',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <h1 class="auth-card__title">Crear cuenta</h1>

        <!-- Mandatory non-dismissable password recovery warning (REG-07 / DM-04) -->
        <div class="auth-warning" role="note" aria-label="Advertencia sobre contraseña">
          <svg class="auth-warning__icon" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M9 2L16.5 15.5H1.5L9 2Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
            <path d="M9 7v4M9 12.5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <p class="auth-warning__text">
            <strong>No existe recuperación de contraseña.</strong>
            Si olvidás tu contraseña, perderás el acceso a tu progreso guardado.
            Guardá tu contraseña en un lugar seguro.
          </p>
        </div>

        <form class="auth-form" (ngSubmit)="submit()" novalidate>
          <div class="auth-form__field">
            <label for="register-email" class="auth-form__label">
              Correo electrónico
            </label>
            <input
              id="register-email"
              type="email"
              name="email"
              class="auth-form__input"
              [(ngModel)]="email"
              autocomplete="email"
              placeholder="tu@correo.com"
              [class.auth-form__input--error]="emailError()"
              aria-describedby="register-email-error"
            />
            @if (emailError()) {
              <span id="register-email-error" class="auth-form__error" role="alert">
                Ingresá un correo electrónico válido.
              </span>
            }
          </div>

          <div class="auth-form__field">
            <label for="register-password" class="auth-form__label">
              Contraseña
            </label>
            <input
              id="register-password"
              type="password"
              name="password"
              class="auth-form__input"
              [(ngModel)]="password"
              autocomplete="new-password"
              placeholder="Mínimo 8 caracteres"
              [class.auth-form__input--error]="passwordError()"
              aria-describedby="register-password-error"
            />
            @if (passwordError()) {
              <span id="register-password-error" class="auth-form__error" role="alert">
                La contraseña debe tener al menos 8 caracteres.
              </span>
            }
          </div>

          @if (serverError()) {
            <div class="auth-form__server-error" role="alert">
              {{ serverError() }}
            </div>
          }

          <button
            type="submit"
            class="auth-form__submit"
            [disabled]="submitting()"
            aria-label="Crear cuenta"
          >
            {{ submitting() ? 'Creando cuenta…' : 'Crear cuenta' }}
          </button>
        </form>

        <p class="auth-card__footer">
          ¿Ya tenés cuenta?
          <a routerLink="/login" class="auth-card__link">Iniciar sesión</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - var(--header-height));
      padding: var(--space-6) var(--space-4);
    }

    .auth-card {
      width: 100%;
      max-width: 400px;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: var(--space-8) var(--space-6);
    }

    .auth-card__title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      margin-bottom: var(--space-6);
      text-align: center;
    }

    /* Non-dismissable password recovery warning (REG-07 / DM-04) */
    .auth-warning {
      display: flex;
      gap: var(--space-3);
      padding: var(--space-4);
      background: var(--color-warning-bg, rgba(200,150,40,0.12));
      border: 1px solid var(--color-warning, #c89628);
      border-radius: var(--radius-md);
      margin-bottom: var(--space-6);
    }

    .auth-warning__icon {
      flex-shrink: 0;
      color: var(--color-warning, #c89628);
      margin-top: 2px;
    }

    .auth-warning__text {
      font-size: var(--font-size-sm);
      color: var(--color-text-primary);
      line-height: var(--line-height-normal);
      margin: 0;

      strong {
        display: block;
        margin-bottom: var(--space-1);
        color: var(--color-warning, #c89628);
      }
    }

    .auth-form__field {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
      margin-bottom: var(--space-4);
    }

    .auth-form__label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--color-text-secondary);
    }

    .auth-form__input {
      padding: var(--space-2) var(--space-3);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      background: var(--color-bg);
      color: var(--color-text-primary);
      font-size: var(--font-size-sm);
      width: 100%;
      box-sizing: border-box;
      transition: border-color var(--transition-fast);

      &:focus {
        outline: none;
        border-color: var(--color-accent);
      }

      &--error {
        border-color: var(--color-error);
      }
    }

    .auth-form__error {
      font-size: var(--font-size-xs);
      color: var(--color-error);
    }

    .auth-form__server-error {
      padding: var(--space-3) var(--space-4);
      background: var(--color-error-bg, rgba(204,68,68,0.1));
      border: 1px solid var(--color-error);
      border-radius: var(--radius-md);
      color: var(--color-error);
      font-size: var(--font-size-sm);
      margin-bottom: var(--space-4);
    }

    .auth-form__submit {
      width: 100%;
      padding: var(--space-3);
      background: var(--color-accent);
      color: var(--color-bg);
      border: none;
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      cursor: pointer;
      transition: background var(--transition-fast);

      &:hover:not(:disabled) { background: #d4b060; }
      &:disabled { opacity: 0.6; cursor: not-allowed; }
      &:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 3px; }
    }

    .auth-card__footer {
      margin-top: var(--space-6);
      text-align: center;
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
    }

    .auth-card__link {
      color: var(--color-accent);
      text-decoration: none;
      font-weight: var(--font-weight-medium);

      &:hover { text-decoration: underline; }
    }
  `],
})
export class RegisterComponent {
  email = '';
  password = '';

  readonly submitting = signal(false);
  readonly emailError = signal(false);
  readonly passwordError = signal(false);
  readonly serverError = signal<string | null>(null);

  private readonly store = inject(SessionStore);
  private readonly router = inject(Router);

  async submit(): Promise<void> {
    this.emailError.set(!isValidEmail(this.email));
    this.passwordError.set(this.password.length < 8);
    this.serverError.set(null);

    if (this.emailError() || this.passwordError()) return;

    this.submitting.set(true);
    try {
      await this.store.register(this.email, this.password);
      // Full reload so app.config re-evaluates adapter selection (design D5)
      window.location.href = '/';
    } catch (err: unknown) {
      // 409 Conflict = email already registered
      const status = (err as { status?: number })?.status;
      if (status === 409) {
        this.serverError.set(
          'Ese correo electrónico ya está registrado. Intentá iniciar sesión.',
        );
      } else {
        this.serverError.set('Error al crear la cuenta. Intentá de nuevo más tarde.');
      }
    } finally {
      this.submitting.set(false);
    }
  }
}
