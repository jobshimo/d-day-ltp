import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * HomeComponent — landing hub for the D-Day at Omaha Beach learning app.
 *
 * Route: '' (root path, replaces the old redirectTo 'modules').
 * Shows a hero section (cover image + title + tagline) and 4 nav cards
 * linking to the main sections: Curso, Historia, Simbología, Preparación.
 */
@Component({
  standalone: true,
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="home">
      <!-- Hero -->
      <section class="home-hero" aria-label="Portada del juego">
        <div class="home-hero__overlay" aria-hidden="true"></div>
        <img
          class="home-hero__image"
          src="assets/images/omahafront.jpg"
          alt="Portada del juego D-Day en Omaha Beach"
          loading="eager"
        />
        <div class="home-hero__content">
          <h1 class="home-hero__title">D-Day en Omaha Beach</h1>
          <p class="home-hero__tagline">
            Aprende las reglas del juego de forma interactiva. Empieza por el curso
            o explora la historia de la batalla.
          </p>
        </div>
      </section>

      <!-- Hub cards -->
      <nav class="home-hub" aria-label="Secciones principales">
        <a routerLink="/modules" class="hub-card hub-card--curso">
          <span class="hub-card__icon" aria-hidden="true">📘</span>
          <span class="hub-card__title">Curso</span>
          <span class="hub-card__desc">Aprende las reglas módulo a módulo</span>
        </a>

        <a routerLink="/historia" class="hub-card hub-card--historia">
          <span class="hub-card__icon" aria-hidden="true">📜</span>
          <span class="hub-card__title">Historia</span>
          <span class="hub-card__desc">El asalto a Omaha: contexto y análisis</span>
        </a>

        <a routerLink="/simbologia" class="hub-card hub-card--simbologia">
          <span class="hub-card__icon" aria-hidden="true">🎖</span>
          <span class="hub-card__title">Simbología</span>
          <span class="hub-card__desc">Referencia de fichas y marcadores</span>
        </a>

        <a routerLink="/preparacion" class="hub-card hub-card--preparacion">
          <span class="hub-card__icon" aria-hidden="true">📋</span>
          <span class="hub-card__title">Preparación</span>
          <span class="hub-card__desc">Guía de puesta a punto del tablero</span>
        </a>
      </nav>
    </div>
  `,
  styles: [`
    .home {
      min-height: calc(100vh - var(--header-height));
    }

    /* ---- Hero ---- */
    .home-hero {
      position: relative;
      height: 420px;
      overflow: hidden;
      display: flex;
      align-items: flex-end;
    }

    .home-hero__image {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center top;
    }

    .home-hero__overlay {
      position: absolute;
      inset: 0;
      background: var(--color-hero-overlay, rgba(26, 28, 30, 0.65));
      z-index: 1;
    }

    .home-hero__content {
      position: relative;
      z-index: 2;
      padding: var(--space-8) var(--space-6) var(--space-10);
      max-width: var(--max-content-width);
      margin: 0 auto;
      width: 100%;
    }

    .home-hero__title {
      font-size: var(--font-size-4xl, 2.25rem);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      letter-spacing: -0.02em;
      line-height: var(--line-height-tight);
      margin-bottom: var(--space-3);
    }

    .home-hero__tagline {
      font-size: var(--font-size-lg);
      color: var(--color-text-secondary);
      max-width: 60ch;
      line-height: var(--line-height-relaxed);
    }

    /* ---- Hub nav ---- */
    .home-hub {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: var(--space-5);
      padding: var(--space-10) var(--space-6);
      max-width: var(--max-content-width);
      margin: 0 auto;
    }

    /* ---- Hub cards ---- */
    .hub-card {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-2);
      padding: var(--space-5) var(--space-5) var(--space-6);
      min-height: 140px;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-top: 3px solid var(--color-accent);
      border-radius: var(--radius-lg);
      color: inherit;
      text-decoration: none;
      transition:
        background var(--transition-fast),
        border-color var(--transition-fast),
        transform var(--transition-fast),
        box-shadow var(--transition-fast);

      &:hover {
        background: var(--color-surface-alt);
        border-color: var(--color-accent-dim);
        transform: translateY(-2px);
        box-shadow: var(--shadow-lg);
      }

      &:focus-visible {
        outline: 2px solid var(--color-accent);
        outline-offset: 2px;
      }
    }

    .hub-card__icon {
      font-size: var(--font-size-2xl);
      line-height: 1;
    }

    .hub-card__title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      line-height: var(--line-height-tight);
    }

    .hub-card__desc {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      line-height: var(--line-height-relaxed);
    }

    /* ---- Responsive ---- */
    @media (max-width: 600px) {
      .home-hero {
        height: 280px;
      }

      .home-hero__title {
        font-size: var(--font-size-2xl);
      }

      .home-hub {
        grid-template-columns: 1fr 1fr;
        padding: var(--space-6) var(--space-4);
        gap: var(--space-4);
      }
    }
  `],
})
export default class HomeComponent {}
