import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { SessionStore } from 'application-session-store';

@Component({
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'app-root',
  template: `
    <a class="skip-link" href="#main-content">Saltar al contenido</a>
    <nav class="nav" aria-label="Navegación principal">
      <a routerLink="/" class="nav__brand" aria-label="Inicio — D-Day en Omaha Beach">
        <span class="nav__mark" aria-hidden="true">D</span>
        <span class="nav__brandtext">
          <span class="nav__title">Omaha Beach</span>
          <span class="nav__sub">Manual de campaña</span>
        </span>
      </a>

      <div class="nav__links">
        <a
          routerLink="/"
          class="nav__link"
          routerLinkActive="nav__link--active"
          [routerLinkActiveOptions]="{ exact: true }"
          aria-label="Inicio">
          Inicio
        </a>
        <a
          routerLink="/modules"
          class="nav__link"
          routerLinkActive="nav__link--active"
          aria-label="Curso: aprende las reglas módulo a módulo">
          Curso
        </a>
        <a
          routerLink="/historia"
          class="nav__link"
          routerLinkActive="nav__link--active"
          aria-label="Historia del asalto a Omaha Beach">
          Historia
        </a>
        <a
          routerLink="/simbologia"
          class="nav__link"
          routerLinkActive="nav__link--active"
          aria-label="Referencia de simbología">
          Simbología
        </a>
        <a
          routerLink="/preparacion"
          class="nav__link"
          routerLinkActive="nav__link--active"
          aria-label="Guía de preparación de la partida">
          Preparación
        </a>
      </div>

      <div class="nav__end">
        <span class="nav__date" aria-hidden="true">6 · JUN · 1944</span>

        @if (session.isAuthenticated()) {
          <span class="nav__user" aria-label="Usuario autenticado: {{ session.email() }}">
            {{ session.email() }}
          </span>
          <button
            type="button"
            class="nav__logout"
            (click)="logout()"
            aria-label="Cerrar sesión">
            Salir
          </button>
        } @else {
          <a routerLink="/login" class="nav__login" aria-label="Iniciar sesión">
            Entrar
          </a>
        }

        <a routerLink="/settings" class="nav__settings" aria-label="Configuración">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M9 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" stroke="currentColor" stroke-width="1.5"/>
            <path d="M14.4 11.1l.9.9-1.5 1.5-.9-.9a5.96 5.96 0 0 1-1.5.6v1.3h-2.1v-1.3a5.96 5.96 0 0 1-1.5-.6l-.9.9-1.5-1.5.9-.9a5.95 5.95 0 0 1-.6-1.5H4.5V7.5h1.2a5.95 5.95 0 0 1 .6-1.5l-.9-.9L7 3.6l.9.9a5.96 5.96 0 0 1 1.5-.6V2.6h2.1v1.3a5.96 5.96 0 0 1 1.5.6l.9-.9 1.5 1.5-.9.9a5.95 5.95 0 0 1 .6 1.5h1.3v2.1h-1.3a5.95 5.95 0 0 1-.7 1.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
          </svg>
        </a>
      </div>
    </nav>
    <main id="main-content">
      <router-outlet />
    </main>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }

    .skip-link {
      position: absolute;
      top: -100%;
      left: 0;
      background: var(--accent);
      color: #190f02;
      padding: var(--space-2) var(--space-4);
      font-family: var(--font-stencil);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-size: 13px;
      font-weight: 600;
      z-index: 9999;
      transition: top var(--transition-fast);

      &:focus { top: 0; }
    }

    .nav {
      position: sticky;
      top: 0;
      z-index: 200;
      height: var(--nav-h);
      display: flex;
      align-items: center;
      gap: 28px;
      padding: 0 28px;
      background: rgba(10, 12, 13, 0.82);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border-bottom: 1px solid var(--line);
    }

    .nav__brand {
      display: flex;
      align-items: center;
      gap: 13px;
      margin-right: 6px;
    }

    .nav__mark {
      width: 34px;
      height: 34px;
      flex: none;
      border: 1.5px solid var(--accent);
      display: grid;
      place-items: center;
      color: var(--accent);
      font-family: var(--font-display);
      font-weight: 900;
      font-size: 19px;
      line-height: 1;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        inset: 3px;
        border: 1px solid var(--accent);
        opacity: 0.35;
      }
    }

    .nav__brandtext {
      display: flex;
      flex-direction: column;
      line-height: 1;
    }

    .nav__title {
      font-family: var(--font-stencil);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      font-size: 13px;
      color: var(--bone);
    }

    .nav__sub {
      font-family: var(--font-mono);
      font-size: 10px;
      letter-spacing: 0.14em;
      color: var(--muted);
      margin-top: 3px;
      text-transform: uppercase;
    }

    .nav__links {
      display: flex;
      gap: 2px;
    }

    .nav__link {
      font-family: var(--font-stencil);
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-weight: 500;
      font-size: 13px;
      color: var(--sand);
      padding: 9px 14px;
      border-radius: 2px;
      transition: color var(--transition-fast), background var(--transition-fast);
      position: relative;
      white-space: nowrap;

      &:hover { color: var(--bone); background: rgba(255, 255, 255, 0.04); }

      &:focus-visible {
        outline: 2px solid var(--accent);
        outline-offset: -2px;
      }
    }

    .nav__link--active {
      color: var(--accent);

      &::after {
        content: '';
        position: absolute;
        left: 14px;
        right: 14px;
        bottom: 2px;
        height: 2px;
        background: var(--accent);
      }
    }

    .nav__end {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-left: auto;
    }

    .nav__date {
      font-family: var(--font-mono);
      font-size: 11px;
      letter-spacing: 0.1em;
      color: var(--muted);
      white-space: nowrap;
    }

    .nav__user {
      font-family: var(--font-mono);
      font-size: 11px;
      letter-spacing: 0.04em;
      color: var(--sand);
      max-width: 180px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding-left: 16px;
      border-left: 1px solid var(--line);
    }

    .nav__logout,
    .nav__login {
      font-family: var(--font-stencil);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-size: 11px;
      font-weight: 600;
      padding: 6px 13px;
      border-radius: 2px;
      cursor: pointer;
      transition: color var(--transition-fast), border-color var(--transition-fast), background var(--transition-fast);
    }

    .nav__logout {
      color: var(--sand);
      background: none;
      border: 1px solid var(--line-strong);

      &:hover { color: var(--bone); border-color: var(--sand); }
    }

    .nav__login {
      color: var(--accent);
      border: 1px solid var(--accent);

      &:hover { background: var(--accent); color: #190f02; }
    }

    .nav__logout:focus-visible,
    .nav__login:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
    }

    .nav__settings {
      display: flex;
      align-items: center;
      color: var(--muted);
      padding: var(--space-2);
      border-radius: 2px;
      transition: color var(--transition-fast);

      &:hover { color: var(--accent); }
      &:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
    }

    main {
      min-height: calc(100vh - var(--nav-h));
    }

    @media (max-width: 880px) {
      .nav { gap: 14px; padding: 0 16px; overflow-x: auto; }
      .nav__sub { display: none; }
      .nav__date { display: none; }
      .nav__user { display: none; }
    }
  `],
})
export class App {
  readonly session = inject(SessionStore);

  logout(): void {
    this.session.logout();
    // Full reload so app.config re-evaluates adapter selection (design D5)
    window.location.href = '/';
  }
}
