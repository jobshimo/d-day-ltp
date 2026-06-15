import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
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
    <div class="screen wrap section">

      <!-- ── Header ── -->
      <header class="sechead" style="margin-bottom:48px">
        <div>
          <p class="eyebrow">Referencia de fichas</p>
          <h1 class="sechead__t">Simbología del juego</h1>
        </div>
        <div class="sechead__meta">
          <span>OTAN / APP-6</span>
          <span>+ SISTEMA PROPIO</span>
        </div>
      </header>

      <p class="lede" style="max-width:62ch;margin-bottom:40px">
        Las fichas y marcadores usan símbolos militares estándar combinados
        con la simbología propia del sistema. Esta es la referencia rápida,
        agrupada por categoría.
      </p>

      <!-- ── Category TOC ── -->
      <nav class="simbologia__toc" aria-label="Ir a sección" style="margin-bottom:64px">
        @for (cat of categories; track cat.id) {
          <button type="button" class="tag" (click)="scrollToCategory(cat.id)">
            {{ cat.titleEs }}
          </button>
        }
      </nav>

      <!-- ── Categories ── -->
      @for (cat of categories; track cat.id) {
        <section
          class="simbologia__category"
          [id]="'cat-' + cat.id"
          [attr.aria-labelledby]="'cat-heading-' + cat.id">

          <!-- Category header row -->
          <div class="simbologia__cat-header">
            <h2 class="display simbologia__category-title" [id]="'cat-heading-' + cat.id" style="font-size:26px;margin:0">
              {{ cat.titleEs }}
            </h2>
            <span class="kicker">{{ cat.entries.length }} entradas</span>
          </div>

          @if (cat.descriptionEs) {
            <p class="mono simbologia__cat-desc">↳ {{ cat.descriptionEs }}</p>
          }

          <!-- Entries grid -->
          <div class="simbologia__entries">
            @for (entry of cat.entries; track entry.key) {
              <article class="card simbologia__entry" [attr.aria-label]="entry.nameEs">

                <!-- Symbol cell -->
                <div class="simbologia__symbol" [attr.aria-label]="'Símbolo: ' + entry.nameEs">
                  @switch (entry.render.kind) {

                    @case ('unit-symbol') {
                      <!--
                        Unit-symbol glyphs live in a 60×60 coordinate space.
                        Inner box: x=14 y=18 w=32 h=20.
                        We show the full 60×60 space at 64×64 px so every glyph
                        is clearly legible without clipping.
                        Host is <svg:g ddobUnitSymbol> so the SVG render tree is unbroken.
                        symbolStyle controls tank/armor rendering: 'counter' (silhouette)
                        or 'card' (NATO oval). Defaults to 'counter' when not set.
                      -->
                      <svg viewBox="0 0 60 60" width="64" height="64"
                           role="img"
                           [attr.aria-label]="'Símbolo OTAN: ' + entry.nameEs">
                        <rect width="60" height="60"
                              [attr.fill]="unitSymbolBg(entry.render)"
                              rx="4" aria-hidden="true" />
                        <svg:g ddobUnitSymbol
                          [type]="entry.render.type"
                          [germanSymbol]="entry.render.germanSymbol"
                          [color]="entry.render.color ?? '#ffffff'"
                          [symbolStyle]="entry.render.symbolStyle ?? 'counter'"
                          [strokeWidth]="2" />
                      </svg>
                    }

                    @case ('target-symbol') {
                      <!--
                        Target symbols (circle/diamond/triangle) are rendered at
                        cx=30 cy=30 size=24 inside a 60×60 viewBox.
                        Displayed at 64×64 px for clear legibility.
                        Host is <svg:g ddobTargetSymbol> so the SVG render tree is unbroken.
                      -->
                      <svg viewBox="0 0 60 60" width="64" height="64"
                           role="img"
                           [attr.aria-label]="'Símbolo de objetivo: ' + entry.nameEs">
                        <rect width="60" height="60"
                              fill="#2a2c30" rx="4" aria-hidden="true" />
                        <svg:g ddobTargetSymbol
                          [symbol]="entry.render.symbol"
                          [control]="entry.render.control"
                          [size]="24"
                          [cx]="30"
                          [cy]="30" />
                      </svg>
                    }

                    @case ('fire-dots') {
                      <!--
                        Fire dots live at translate(5, 5) in 60×60 space (r=3).
                        For the symbology legend we crop to just the first dot area:
                        viewBox "0 0 14 14" at 56×56 px → scale ×4 → dot radius 12 px.
                        This makes intense/steady/sporadic clearly legible (color + pattern).
                        Counter rendering is NOT affected — only this legend display.
                        Host is <svg:g ddobFireDots> so the SVG render tree is unbroken.
                      -->
                      <svg viewBox="0 0 14 14" width="56" height="56"
                           role="img"
                           [attr.aria-label]="'Punto de fuego: ' + entry.nameEs">
                        <rect width="14" height="14"
                              fill="#2a2c30" rx="2" aria-hidden="true" />
                        <svg:g ddobFireDots [dots]="entry.render.dots" />
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

                <!-- Entry body -->
                <div class="simbologia__entry-body">
                  <div class="simbologia__entry-name-row">
                    <span class="serif" style="font-size:17px">{{ entry.nameEs }}</span>
                    @if (entry.ruleRef) {
                      <span class="rule-chip" aria-label="Referencia de regla {{ entry.ruleRef }}">
                        {{ entry.ruleRef }}
                      </span>
                    }
                  </div>
                  <p class="simbologia__entry-meaning">{{ entry.meaningEs }}</p>
                  @if (entry.note) {
                    <p class="simbologia__entry-note" role="note">{{ entry.note }}</p>
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
    /* ── TOC nav ── */
    .simbologia__toc {
      display: flex;
      flex-wrap: wrap;
      gap: 9px;
    }

    /* ── Category section ── */
    .simbologia__category {
      margin-bottom: 64px;
      scroll-margin-top: 80px;
    }

    .simbologia__cat-header {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      border-bottom: 1px solid var(--line);
      padding-bottom: 12px;
      margin-bottom: 16px;
    }

    .simbologia__cat-desc {
      font-size: 12.5px;
      color: var(--muted);
      margin-bottom: 20px;
      margin-top: 0;
    }

    /* ── Entries grid ── */
    .simbologia__entries {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
      gap: 14px;
    }

    .simbologia__entry {
      padding: 18px;
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }

    /* ── Symbol cell ── */
    .simbologia__symbol {
      flex: none;
      width: 64px;
      display: grid;
      place-items: center;
    }

    .simbologia__swatch {
      display: block;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 255, 0.2);
    }

    .simbologia__chip {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 4px 10px;
      background: var(--accent);
      color: var(--ink);
      border-radius: var(--radius);
      font-size: 13px;
      font-weight: 700;
      font-family: var(--font-mono);
      letter-spacing: 0.05em;
      min-width: 48px;
      text-align: center;
    }

    /* ── Entry body ── */
    .simbologia__entry-body {
      flex: 1;
      min-width: 0;
    }

    .simbologia__entry-name-row {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 8px;
      flex-wrap: wrap;
    }

    .simbologia__entry-meaning {
      font-size: 13.5px;
      color: var(--muted);
      line-height: 1.5;
      margin-top: 6px;
      margin-bottom: 0;
    }

    .simbologia__entry-note {
      font-size: 12px;
      color: var(--faint);
      border-left: 2px solid var(--line-strong);
      padding-left: 8px;
      font-style: italic;
      margin-top: 8px;
      line-height: 1.5;
    }
  `],
})
export class SimbologiaComponent {
  private readonly document = inject(DOCUMENT);

  /** All 8 symbology categories, sourced from the content lib. */
  readonly categories: SimbologiaCategory[] = SYMBOLOGY;

  /**
   * Smooth-scroll to a category section. Uses scrollIntoView instead of a bare
   * "#cat-x" anchor: with <base href="/"> a fragment-only href resolves against
   * the base URL and navigates to the site root (course map) instead of
   * scrolling within the current page.
   */
  scrollToCategory(catId: string): void {
    this.document.getElementById('cat-' + catId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

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
