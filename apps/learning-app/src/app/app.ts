import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  selector: 'app-root',
  template: `
    <a class="skip-link" href="#main-content">Saltar al contenido</a>
    <nav class="app-nav" aria-label="Navegación principal">
      <a routerLink="/modules" class="app-nav__brand">D-Day en Omaha Beach</a>
      <a routerLink="/settings" class="app-nav__settings" aria-label="Configuración">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M9 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" stroke="currentColor" stroke-width="1.5"/>
          <path d="M14.4 11.1l.9.9-1.5 1.5-.9-.9a5.96 5.96 0 0 1-1.5.6v1.3h-2.1v-1.3a5.96 5.96 0 0 1-1.5-.6l-.9.9-1.5-1.5.9-.9a5.95 5.95 0 0 1-.6-1.5H4.5V7.5h1.2a5.95 5.95 0 0 1 .6-1.5l-.9-.9L7 3.6l.9.9a5.96 5.96 0 0 1 1.5-.6V2.6h2.1v1.3a5.96 5.96 0 0 1 1.5.6l.9-.9 1.5 1.5-.9.9a5.95 5.95 0 0 1 .6 1.5h1.3v2.1h-1.3a5.95 5.95 0 0 1-.7 1.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
        </svg>
      </a>
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
      background: var(--color-accent);
      color: var(--color-bg);
      padding: var(--space-2) var(--space-4);
      font-weight: var(--font-weight-semibold);
      z-index: 9999;
      transition: top var(--transition-fast);

      &:focus { top: 0; }
    }

    .app-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 var(--space-4);
      height: var(--header-height);
      background: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .app-nav__brand {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-accent);
      text-decoration: none;
      letter-spacing: 0.02em;

      &:hover { color: #d4b060; }
    }

    .app-nav__settings {
      display: flex;
      align-items: center;
      color: var(--color-text-secondary);
      padding: var(--space-2);
      border-radius: var(--radius-sm);
      transition: color var(--transition-fast);

      &:hover { color: var(--color-text-primary); }
      &:focus-visible {
        outline: 2px solid var(--color-accent);
        outline-offset: 2px;
      }
    }

    main {
      min-height: calc(100vh - var(--header-height));
    }
  `],
})
export class App {}
