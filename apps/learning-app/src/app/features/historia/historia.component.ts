import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HISTORY } from 'content';
import type { HistoriaSection } from 'content';

/**
 * HistoriaComponent — narrative history of the Omaha Beach assault.
 *
 * Route: /historia (ungated — no canActivate guard).
 * Content comes from HISTORY constant in libs/content, sourced from the
 * Butterfield DDOB Campaign Analysis.
 *
 * Section nav uses scrollIntoView (via DOCUMENT injection) instead of bare
 * href="#..." anchors: with <base href="/"> fragment-only hrefs navigate to
 * the site root rather than scrolling within the current page.
 */
@Component({
  standalone: true,
  selector: 'app-historia',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <div class="historia">
      <header class="historia__header">
        <h1 class="historia__title">Historia: El asalto a Omaha Beach</h1>
        <p class="historia__intro">
          El 6 de junio de 1944, las fuerzas estadounidenses asaltaron una franja de arena
          en la costa del Calvados que desde entonces lleva su nombre en clave: Omaha Beach.
          Esta página narra los hechos del día D según el análisis de campaña del diseñador
          del juego, John H. Butterfield.
        </p>

        <!-- Section TOC — buttons with scrollIntoView, not bare href anchors -->
        <nav class="historia__toc" aria-label="Ir a sección">
          @for (section of sections; track section.id) {
            <button
              type="button"
              class="historia__toc-link"
              (click)="scrollToSection(section.id)">
              {{ section.titleEs }}
            </button>
          }
        </nav>
      </header>

      @for (section of sections; track section.id) {
        <section
          class="historia__section"
          [id]="'historia-' + section.id"
          [attr.aria-labelledby]="'historia-heading-' + section.id">

          <h2
            class="historia__section-title"
            [id]="'historia-heading-' + section.id">
            {{ section.titleEs }}
          </h2>

          @for (block of section.blocks; track $index) {
            @switch (block.type) {
              @case ('image') {
                <figure class="historia__figure">
                  <img
                    [src]="block.content"
                    [alt]="block.altText ?? ''"
                    class="historia__image"
                    loading="eager"
                  />
                  @if (block.caption) {
                    <figcaption class="historia__figcaption">{{ block.caption }}</figcaption>
                  }
                </figure>
              }
              @case ('pull-quote') {
                <blockquote class="historia__pull-quote">
                  <p>{{ block.content }}</p>
                  @if (block.sourceRef) {
                    <footer class="historia__pull-quote-source">
                      <cite>{{ block.sourceRef }}</cite>
                    </footer>
                  }
                </blockquote>
              }
              @default {
                <p class="historia__prose">{{ block.content }}</p>
              }
            }
          }
        </section>
      }
    </div>
  `,
  styles: [`
    .historia {
      max-width: var(--max-content-width);
      margin: 0 auto;
      padding: var(--space-8) var(--space-4);
    }

    /* ---- Header ---- */
    .historia__header {
      margin-bottom: var(--space-10);
    }

    .historia__title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      letter-spacing: -0.02em;
      margin-bottom: var(--space-3);
    }

    .historia__intro {
      font-size: var(--font-size-base);
      color: var(--color-text-primary);
      line-height: var(--line-height-relaxed);
      max-width: 68ch;
      margin-bottom: var(--space-6);
    }

    /* ---- TOC nav ---- */
    .historia__toc {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
    }

    .historia__toc-link {
      background: none;
      cursor: pointer;
      font-family: inherit;
      font-size: var(--font-size-sm);
      color: var(--color-accent);
      text-decoration: none;
      border: 1px solid var(--color-accent);
      border-radius: var(--radius-sm);
      padding: var(--space-1) var(--space-2);
      transition: background var(--transition-fast), color var(--transition-fast);

      &:hover {
        background: var(--color-accent);
        color: var(--color-bg);
      }

      &:focus-visible {
        outline: 2px solid var(--color-accent);
        outline-offset: 2px;
      }
    }

    /* ---- Sections ---- */
    .historia__section {
      margin-bottom: var(--space-12);
      scroll-margin-top: calc(var(--header-height) + var(--space-4));
    }

    .historia__section-title {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      border-bottom: 1px solid var(--color-border);
      padding-bottom: var(--space-2);
      margin-bottom: var(--space-5);
    }

    /* ---- Prose blocks ---- */
    .historia__prose {
      font-size: var(--font-size-base);
      color: var(--color-text-primary);
      line-height: var(--line-height-relaxed);
      max-width: 68ch;
      margin-bottom: var(--space-4);
    }

    /* ---- Images ---- */
    .historia__figure {
      margin: var(--space-6) 0;
    }

    .historia__image {
      width: 100%;
      height: auto;
      max-height: 400px;
      object-fit: cover;
      border-radius: var(--radius-md);
      display: block;
    }

    .historia__figcaption {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      font-family: var(--font-family-mono, monospace);
      text-align: center;
      margin-top: var(--space-2);
      line-height: var(--line-height-normal);
    }

    /* ---- Pull quotes ---- */
    .historia__pull-quote {
      border-left: 3px solid var(--color-accent);
      background: var(--color-surface-alt);
      border-radius: 0 var(--radius-md) var(--radius-md) 0;
      padding: var(--space-4) var(--space-5);
      margin: var(--space-5) 0;

      p {
        font-size: var(--font-size-lg);
        font-style: italic;
        color: var(--color-text-primary);
        line-height: var(--line-height-relaxed);
      }
    }

    .historia__pull-quote-source {
      margin-top: var(--space-2);

      cite {
        font-size: var(--font-size-xs);
        color: var(--color-text-muted);
        font-style: normal;
      }
    }

    /* ---- Responsive ---- */
    @media (max-width: 480px) {
      .historia__toc {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `],
})
export default class HistoriaComponent {
  private readonly document = inject(DOCUMENT);

  /** All 6 history sections from the content lib. */
  readonly sections: HistoriaSection[] = HISTORY;

  /**
   * Smooth-scroll to a history section. Uses scrollIntoView instead of bare
   * href="#historia-{id}" anchors: with <base href="/"> fragment-only hrefs
   * resolve against the base URL and navigate to the site root.
   */
  scrollToSection(sectionId: string): void {
    this.document
      .getElementById('historia-' + sectionId)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
