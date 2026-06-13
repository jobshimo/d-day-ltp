import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
  UnitSymbolComponent,
  TargetSymbolComponent,
  FireDotsComponent,
} from 'counter';
import { SYMBOLOGY } from 'content';
import type { SimbologiaCategory, SimbologiaRenderAs } from 'content';

/**
 * SimbologiaComponent — static reference page listing every game symbol
 * grouped by category, rendered with Phase-1 counter components.
 *
 * Route: /simbologia (ungated — no canActivate guard).
 * Symbols follow NATO/APP-6 standard as implemented in the game counters.
 */
@Component({
  standalone: true,
  selector: 'app-simbologia',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UnitSymbolComponent, TargetSymbolComponent, FireDotsComponent],
  template: `
    <div class="simbologia">
      <header class="simbologia__header">
        <h1 class="simbologia__title">Simbología del juego</h1>
        <p class="simbologia__intro">
          Las fichas y marcadores de <em>D-Day en Omaha Beach</em> utilizan
          símbolos militares estándar (OTAN/APP-6) combinados con símbolos
          propios del sistema de juego. Esta página es una referencia rápida
          de todos los símbolos, agrupados por categoría.
        </p>

        <!-- Section anchor navigation -->
        <nav class="simbologia__toc" aria-label="Ir a sección">
          @for (cat of categories; track cat.id) {
            <a class="simbologia__toc-link" [href]="'#cat-' + cat.id">
              {{ cat.titleEs }}
            </a>
          }
        </nav>
      </header>

      @for (cat of categories; track cat.id) {
        <section
          class="simbologia__category"
          [id]="'cat-' + cat.id"
          [attr.aria-labelledby]="'cat-heading-' + cat.id">

          <h2 class="simbologia__category-title" [id]="'cat-heading-' + cat.id">
            {{ cat.titleEs }}
          </h2>

          <div class="simbologia__entries">
            @for (entry of cat.entries; track entry.key) {
              <article class="simbologia__entry" [attr.aria-label]="entry.nameEs">

                <!-- Symbol renderer -->
                <div class="simbologia__symbol" [attr.aria-label]="'Símbolo: ' + entry.nameEs">
                  @switch (entry.render.kind) {

                    @case ('unit-symbol') {
                      <svg viewBox="0 0 60 60" width="52" height="52"
                           role="img"
                           [attr.aria-label]="'Símbolo OTAN: ' + entry.nameEs">
                        <rect width="60" height="60"
                              [attr.fill]="unitSymbolBg(entry.render)"
                              rx="4" aria-hidden="true" />
                        <ddob-unit-symbol
                          [type]="entry.render.type"
                          [germanSymbol]="entry.render.germanSymbol"
                          [color]="entry.render.color ?? '#ffffff'"
                          [strokeWidth]="2" />
                      </svg>
                    }

                    @case ('target-symbol') {
                      <svg viewBox="0 0 60 28" width="52" height="24"
                           role="img"
                           [attr.aria-label]="'Símbolo de objetivo: ' + entry.nameEs">
                        <rect width="60" height="28"
                              fill="#2a2c30" rx="4" aria-hidden="true" />
                        <ddob-target-symbol
                          [symbol]="entry.render.symbol"
                          [control]="entry.render.control"
                          [size]="18"
                          [cx]="30"
                          [cy]="14" />
                      </svg>
                    }

                    @case ('fire-dots') {
                      <svg viewBox="0 0 60 16" width="52" height="14"
                           role="img"
                           [attr.aria-label]="'Punto de fuego: ' + entry.nameEs">
                        <rect width="60" height="16"
                              fill="#2a2c30" rx="4" aria-hidden="true" />
                        <ddob-fire-dots [dots]="entry.render.dots" />
                      </svg>
                    }

                    @case ('color-swatch') {
                      <span class="simbologia__swatch"
                            role="img"
                            [attr.aria-label]="'Color: ' + entry.render.label"
                            [style.background]="entry.render.color">
                      </span>
                    }

                    @case ('text-chip') {
                      <span class="simbologia__chip"
                            role="img"
                            [attr.aria-label]="'Código: ' + entry.render.text">
                        {{ entry.render.text }}
                      </span>
                    }

                  }
                </div>

                <!-- Entry metadata -->
                <div class="simbologia__entry-body">
                  <p class="simbologia__entry-name">{{ entry.nameEs }}</p>
                  <p class="simbologia__entry-meaning">{{ entry.meaningEs }}</p>

                  @if (entry.ruleRef) {
                    <span class="simbologia__rule-ref" aria-label="Referencia de regla {{ entry.ruleRef }}">
                      {{ entry.ruleRef }}
                    </span>
                  }

                  @if (entry.note) {
                    <p class="simbologia__entry-note" role="note">
                      {{ entry.note }}
                    </p>
                  }
                </div>

              </article>
            }
          </div>
        </section>
      }
    </div>
  `,
  styles: [`
    .simbologia {
      max-width: var(--max-content-width);
      margin: 0 auto;
      padding: var(--space-8) var(--space-4);
    }

    /* ---- Header ---- */
    .simbologia__header {
      margin-bottom: var(--space-10);
    }

    .simbologia__title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      letter-spacing: -0.02em;
      margin-bottom: var(--space-3);
    }

    .simbologia__intro {
      font-size: var(--font-size-base);
      color: var(--color-text-secondary);
      line-height: var(--line-height-normal);
      max-width: 68ch;
      margin-bottom: var(--space-6);
    }

    /* ---- Section anchor nav ---- */
    .simbologia__toc {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
    }

    .simbologia__toc-link {
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

    /* ---- Category sections ---- */
    .simbologia__category {
      margin-bottom: var(--space-12);
      scroll-margin-top: calc(var(--header-height) + var(--space-4));
    }

    .simbologia__category-title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      border-bottom: 1px solid var(--color-border);
      padding-bottom: var(--space-2);
      margin-bottom: var(--space-5);
    }

    /* ---- Entry grid ---- */
    .simbologia__entries {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: var(--space-4);
    }

    .simbologia__entry {
      display: flex;
      gap: var(--space-3);
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: var(--space-4);
      align-items: flex-start;
    }

    /* ---- Symbol cell ---- */
    .simbologia__symbol {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      background: #2a2c30;
      border-radius: var(--radius-sm);
    }

    .simbologia__swatch {
      display: block;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 255, 0.2);
      flex-shrink: 0;
    }

    .simbologia__chip {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-1) var(--space-2);
      background: var(--color-accent);
      color: var(--color-bg);
      border-radius: var(--radius-sm);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      font-family: var(--font-family-mono, monospace);
      letter-spacing: 0.05em;
      min-width: 36px;
      text-align: center;
    }

    /* ---- Entry body ---- */
    .simbologia__entry-body {
      flex: 1;
      min-width: 0;
    }

    .simbologia__entry-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      margin-bottom: var(--space-1);
    }

    .simbologia__entry-meaning {
      font-size: var(--font-size-xs, 0.75rem);
      color: var(--color-text-secondary);
      line-height: var(--line-height-normal);
      margin-bottom: var(--space-2);
    }

    .simbologia__rule-ref {
      display: inline-block;
      font-size: var(--font-size-xs, 0.75rem);
      color: var(--color-accent);
      border: 1px solid var(--color-accent);
      border-radius: var(--radius-sm);
      padding: 0 var(--space-1);
      font-family: var(--font-family-mono, monospace);
      opacity: 0.8;
      margin-bottom: var(--space-2);
    }

    .simbologia__entry-note {
      font-size: var(--font-size-xs, 0.75rem);
      color: var(--color-text-secondary);
      border-left: 2px solid var(--color-border);
      padding-left: var(--space-2);
      font-style: italic;
      margin-top: var(--space-1);
      line-height: var(--line-height-normal);
    }

    /* ---- Responsive ---- */
    @media (max-width: 480px) {
      .simbologia__toc {
        flex-direction: column;
        align-items: flex-start;
      }

      .simbologia__entries {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class SimbologiaComponent {
  /** All 8 symbology categories, sourced from the content lib. */
  readonly categories: SimbologiaCategory[] = SYMBOLOGY;

  /**
   * Background color for the SVG wrapper of unit-symbol entries.
   * German units get a dark ochre to match the counter appearance;
   * US units get the standard dark board background.
   */
  unitSymbolBg(render: SimbologiaRenderAs & { kind: 'unit-symbol' }): string {
    return render.germanSymbol ? '#3d2e1a' : '#2a2c30';
  }
}

// Re-export for the lazy route
export default SimbologiaComponent;
