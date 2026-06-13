import {
  Component,
  Input,
  Output,
  EventEmitter,
  computed,
  signal,
  ChangeDetectionStrategy,
  ElementRef,
  viewChild,
  AfterViewInit,
  OnChanges,
} from '@angular/core';
import type { BoardSnippet, HexState, HexHighlight } from 'content-schema';
import type { USUnitState, GermanUnitState } from 'content-schema';
import { UnitSymbolComponent } from 'counter';

/**
 * BoardSnippetComponent — renders a compact SVG hex grid for drill scenarios.
 *
 * Supports:
 * - 5–15 hexes with correct flat-top hex geometry
 * - Terrain fill via design-token palette
 * - US/German unit counter overlays
 * - Fire-dot intensity markers (color + icon, never color alone per a11y)
 * - HexHighlight overlays for drill feedback (correct/incorrect/selected)
 * - Keyboard navigation (arrow keys + Tab between interactive hexes)
 * - ARIA roles and labels per hex (terrain + occupant in Spanish)
 * - Click/keyboard hex selection for interactive-select drills
 */

export interface HexCoord {
  hexId: string;
  x: number;
  y: number;
}

// Flat-top hex geometry constants
const HEX_SIZE = 36; // outer radius in pixels
const HEX_HEIGHT = Math.sqrt(3) * HEX_SIZE;
const H_SPACING = HEX_SIZE * 2 * 0.75;

/**
 * Compute the six flat-top hex corners relative to center (cx, cy).
 */
function hexPoints(cx: number, cy: number, size: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i);
    pts.push(`${cx + size * Math.cos(angle)},${cy + size * Math.sin(angle)}`);
  }
  return pts.join(' ');
}

/**
 * Lay out hexes in a simple row-offset grid (max 5 per row).
 */
function layoutHexes(hexIds: string[]): HexCoord[] {
  const coords: HexCoord[] = [];
  const count = Math.min(hexIds.length, 15);
  const cols = Math.min(count, 5);
  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const cx = HEX_SIZE + col * H_SPACING;
    const cy = HEX_SIZE + row * HEX_HEIGHT + (col % 2 === 1 ? HEX_HEIGHT / 2 : 0);
    coords.push({ hexId: hexIds[i], x: cx, y: cy });
  }
  return coords;
}

/**
 * Terrain → fill color using the real Devir board TERRAIN KEY palette.
 * Keep in sync with libs/content/src/lib/terrain-palette.ts TERRAIN_COLORS.
 */
const TERRAIN_COLORS: Record<string, string> = {
  beach:    '#e6dcc0',
  pavilion: '#cbccba',
  draw:     '#cbccba',
  slope:    '#c2c79a',
  bluff:    '#c2c79a',
  bocage:   '#b3bd8c',
  cliff:    '#a8a89a',
  building: '#b0a898',
  rough:    '#cdb98c',
};

/** Fire-dot intensity → ring color (color is supplementary; icon carries meaning) */
const FIRE_DOT_COLORS: Record<string, string> = {
  intense:  '#e05f5f',
  steady:   '#e0a050',
  sporadic: '#c8a04a',
};

/** Fire-dot intensity → label in Spanish */
const FIRE_DOT_LABELS: Record<string, string> = {
  intense:  'Intenso',
  steady:   'Sostenido',
  sporadic: 'Esporádico',
};

/** German position color → outline color */
const GERMAN_POS_COLORS: Record<string, string> = {
  red:    '#e05f5f',
  blue:   '#5f9fe0',
  green:  '#4caf78',
  orange: '#e0a050',
  purple: '#9b59b6',
  brown:  '#8b6f47',
};

/** Highlight style → overlay fill/stroke */
const HIGHLIGHT_STYLES: Record<string, { fill: string; stroke: string }> = {
  'fire-dot': { fill: 'rgba(224,95,95,0.15)', stroke: '#e05f5f' },
  selected:   { fill: 'rgba(200,160,74,0.25)', stroke: '#c8a04a' },
  correct:    { fill: 'rgba(76,175,120,0.25)', stroke: '#4caf78' },
  incorrect:  { fill: 'rgba(224,95,95,0.25)', stroke: '#e05f5f' },
};

@Component({
  standalone: true,
  selector: 'ddob-board-snippet',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UnitSymbolComponent],
  template: `
    <div class="board-snippet"
         [style.width.px]="svgWidth()"
         [style.height.px]="svgHeight()">
      <svg
        #svgEl
        [attr.viewBox]="viewBox()"
        [attr.width]="svgWidth()"
        [attr.height]="svgHeight()"
        role="group"
        [attr.aria-label]="boardAriaLabel()"
        class="board-snippet__svg"
        (keydown)="onKeyDown($event)">

        <defs>
          <style>
            @media (prefers-reduced-motion: reduce) {
              .hex-overlay { transition: none !important; }
            }
          </style>
        </defs>

        <!-- Render hexes -->
        @for (coord of hexCoords(); track coord.hexId) {
          @let hex = hexMapSig()[coord.hexId];
          @let highlight = highlightMapSig()[coord.hexId];

          <g class="hex-group"
             [attr.data-hex-id]="coord.hexId">

            <!-- Base hex polygon -->
            <polygon
              [attr.points]="hexPointsFor(coord)"
              [attr.fill]="hexFill(hex)"
              [attr.stroke]="hexStroke(hex, highlight)"
              [attr.stroke-width]="hexStrokeWidth(hex, highlight)"
              class="hex-base" />

            <!-- Highlight overlay -->
            @if (highlight) {
              <polygon
                [attr.points]="hexPointsFor(coord)"
                [attr.fill]="highlightFill(highlight)"
                [attr.stroke]="highlightStroke(highlight)"
                stroke-width="2"
                class="hex-overlay"
                aria-hidden="true" />
            }

            <!-- Selected overlay (no highlight) -->
            @if (isHexSelected(coord.hexId) && !highlight) {
              <polygon
                [attr.points]="hexPointsFor(coord)"
                fill="rgba(200,160,74,0.25)"
                stroke="#c8a04a"
                stroke-width="2.5"
                class="hex-overlay"
                aria-hidden="true" />
            }

            <!-- Focus ring -->
            @if (focusedHexIdSig() === coord.hexId && interactiveSig()) {
              <polygon
                [attr.points]="hexPointsFor(coord)"
                fill="none"
                stroke="#ffffff"
                stroke-width="2"
                stroke-dasharray="4 2"
                class="hex-focus-ring"
                aria-hidden="true" />
            }

            <!-- German position badge -->
            @if (hex?.isGermanPosition && hex?.germanPositionColor) {
              <circle
                [attr.cx]="coord.x"
                [attr.cy]="coord.y - HEX_SIZE * 0.55"
                r="7"
                [attr.fill]="germanPositionFill(hex!.germanPositionColor!)"
                stroke="#1a1c1e"
                stroke-width="1"
                aria-hidden="true" />
              <text
                [attr.x]="coord.x"
                [attr.y]="coord.y - HEX_SIZE * 0.55 + 4"
                text-anchor="middle"
                fill="#ffffff"
                font-size="7"
                font-weight="bold"
                aria-hidden="true">WN</text>
            }

            <!-- Fire dot markers (color + icon, never color alone) -->
            @for (fd of hex?.fireDots ?? []; track fd.positionId; let fi = $index) {
              <g class="fire-dot-marker"
                 [attr.transform]="fireDotTransform(coord, fi)"
                 aria-hidden="true">
                <circle r="5"
                  [attr.fill]="fireDotColor(fd.intensity)"
                  stroke="#1a1c1e"
                  stroke-width="0.5" />
                @if (fd.intensity === 'intense') {
                  <circle r="2.5" fill="#ffffff" opacity="0.9" />
                  <circle r="4.5" fill="none" stroke="#ffffff" stroke-width="0.8" opacity="0.6" />
                } @else if (fd.intensity === 'steady') {
                  <circle r="2" fill="#ffffff" opacity="0.8" />
                } @else {
                  <circle r="1.5" fill="#ffffff" opacity="0.6" />
                }
              </g>
            }

            <!-- US unit counters -->
            @for (unit of unitsInHex(coord.hexId, 'us'); track unit.id; let ui = $index) {
              @let usUnit = asUSUnit(unit);
              <g class="unit-counter unit-counter--us"
                 [attr.transform]="unitTransform(coord, ui, 'us')"
                 aria-hidden="true">
                <rect x="-10" y="-8" width="20" height="16"
                      [attr.fill]="usDivisionFill(usUnit)"
                      stroke="#e8e8e8" stroke-width="1" rx="2" />
                <!-- NATO glyph via UnitSymbolComponent nested in an inner SVG viewport -->
                <svg viewBox="0 0 60 60" width="20" height="16" x="-10" y="-8">
                  <svg:g ddobUnitSymbol [type]="usUnit.type" color="#ffffff" [strokeWidth]="2.5" />
                </svg>
              </g>
            }

            <!-- German unit counters -->
            @for (unit of unitsInHex(coord.hexId, 'german'); track unit.id; let gi = $index) {
              @let deUnit = asGermanUnit(unit);
              <g class="unit-counter unit-counter--german"
                 [attr.transform]="unitTransform(coord, gi, 'german')"
                 aria-hidden="true">
                <rect x="-9" y="-7" width="18" height="14"
                      fill="#5c4a30" stroke="#e8e8e8" stroke-width="1" rx="2" />
                @if (deUnit.germanUnitSymbol) {
                  <!-- NATO glyph available — use UnitSymbolComponent -->
                  <svg viewBox="0 0 60 60" width="18" height="14" x="-9" y="-7">
                    <svg:g ddobUnitSymbol
                      [germanSymbol]="deUnit.germanUnitSymbol"
                      [color]="germanGlyphColor(deUnit)"
                      [strokeWidth]="2.5" />
                  </svg>
                } @else {
                  <!-- Fallback text for existing drills without germanUnitSymbol -->
                  <text text-anchor="middle" y="3"
                        fill="#e8e8e8" font-size="6" font-weight="bold">DE</text>
                }
              </g>
            }

            <!-- Interactive hit zone (transparent, top layer) -->
            @if (interactiveSig()) {
              <polygon
                [attr.points]="hexPointsFor(coord)"
                fill="transparent"
                class="hex-hit-zone"
                tabindex="0"
                role="button"
                [attr.aria-pressed]="isHexSelected(coord.hexId)"
                [attr.aria-label]="hexAriaLabel(coord.hexId)"
                (click)="onHexClick(coord.hexId)"
                (keydown.enter)="onHexClick(coord.hexId)"
                (keydown.space)="onHexClick(coord.hexId); $event.preventDefault()"
                (focus)="onHexFocus(coord.hexId)" />
            }
          </g>
        }
      </svg>
    </div>
  `,
  styles: [`
    .board-snippet {
      display: inline-block;
      max-width: 100%;
      overflow: auto;
    }

    .board-snippet__svg {
      display: block;
      max-width: 100%;
      height: auto;
    }

    .hex-hit-zone {
      cursor: pointer;
      outline: none;
    }

    .hex-group {
      transition: opacity 0.15s ease;
    }
  `],
})
export class BoardSnippetComponent implements AfterViewInit, OnChanges {
  // ---- Angular inputs (@Input() for JIT-test compatibility) ----

  /** The board data to render. Null/undefined renders an empty board. */
  @Input() snippet: BoardSnippet | null = null;

  /** When true, hexes are keyboard/click-selectable */
  @Input() interactive = false;

  /** Currently selected hex IDs */
  @Input() selectedHexIds: string[] = [];

  /** Emits the hex ID when the user selects a hex */
  @Output() readonly hexSelected = new EventEmitter<string>();

  // ---- Internal signal mirrors (updated via OnChanges) ----

  readonly snippetSig = signal<BoardSnippet | null>(null);
  readonly interactiveSig = signal<boolean>(false);
  readonly selectedHexIdsSig = signal<string[]>([]);
  readonly focusedHexIdSig = signal<string | null>(null);

  protected readonly HEX_SIZE = HEX_SIZE;

  readonly svgEl = viewChild<ElementRef<SVGElement>>('svgEl');

  // ---- Computed signals ----

  readonly hexCoords = computed<HexCoord[]>(() => {
    const s = this.snippetSig();
    if (!s) return [];
    return layoutHexes(s.hexes.map((h) => h.hexId));
  });

  readonly hexMapSig = computed<Record<string, HexState>>(() => {
    const s = this.snippetSig();
    if (!s) return {};
    const map: Record<string, HexState> = {};
    for (const h of s.hexes) map[h.hexId] = h;
    return map;
  });

  readonly highlightMapSig = computed<Record<string, HexHighlight>>(() => {
    const s = this.snippetSig();
    if (!s) return {};
    const map: Record<string, HexHighlight> = {};
    for (const hl of s.highlights ?? []) map[hl.hexId] = hl;
    return map;
  });

  readonly svgWidth = computed<number>(() => {
    const coords = this.hexCoords();
    if (coords.length === 0) return 0;
    return Math.max(...coords.map((c) => c.x)) + HEX_SIZE + 8;
  });

  readonly svgHeight = computed<number>(() => {
    const coords = this.hexCoords();
    if (coords.length === 0) return 0;
    return Math.max(...coords.map((c) => c.y)) + HEX_SIZE + 8;
  });

  readonly viewBox = computed<string>(() => `0 0 ${this.svgWidth()} ${this.svgHeight()}`);

  readonly boardAriaLabel = computed<string>(() => {
    const count = this.snippetSig()?.hexes.length ?? 0;
    return this.interactiveSig()
      ? `Tablero interactivo con ${count} hexágonos. Usa las flechas para navegar, Enter o Espacio para seleccionar.`
      : `Vista del tablero con ${count} hexágonos`;
  });

  // ---- Lifecycle ----

  ngOnChanges(): void {
    // Mirror @Input() values into WritableSignals so computed signals react
    this.snippetSig.set(this.snippet ?? null);
    this.interactiveSig.set(this.interactive ?? false);
    this.selectedHexIdsSig.set(this.selectedHexIds ?? []);
    queueMicrotask(() => this.updateRovingTabindex());
  }

  ngAfterViewInit(): void {
    this.updateRovingTabindex();
  }

  // ---- Template helpers ----

  hexPointsFor(coord: HexCoord): string {
    return hexPoints(coord.x, coord.y, HEX_SIZE - 1);
  }

  hexFill(hex: HexState | undefined): string {
    if (!hex) return '#3d4147';
    return TERRAIN_COLORS[hex.terrain] ?? '#3d4147';
  }

  hexStroke(hex: HexState | undefined, highlight: HexHighlight | undefined): string {
    if (highlight) return HIGHLIGHT_STYLES[highlight.style]?.stroke ?? '#3d4147';
    if (hex?.isGermanPosition && hex.germanPositionColor) {
      return GERMAN_POS_COLORS[hex.germanPositionColor] ?? '#3d4147';
    }
    return '#3d4147';
  }

  hexStrokeWidth(hex: HexState | undefined, highlight: HexHighlight | undefined): number {
    if (highlight) return 2;
    if (hex?.isGermanPosition) return 2;
    return 1;
  }

  highlightFill(highlight: HexHighlight): string {
    return HIGHLIGHT_STYLES[highlight.style]?.fill ?? 'transparent';
  }

  highlightStroke(highlight: HexHighlight): string {
    return HIGHLIGHT_STYLES[highlight.style]?.stroke ?? 'transparent';
  }

  germanPositionFill(color: string): string {
    return GERMAN_POS_COLORS[color] ?? '#6b7280';
  }

  fireDotColor(intensity: string): string {
    return FIRE_DOT_COLORS[intensity] ?? '#c8a04a';
  }

  fireDotLabel(intensity: string): string {
    return FIRE_DOT_LABELS[intensity] ?? intensity;
  }

  fireDotTransform(coord: HexCoord, index: number): string {
    const offsetX = (index % 3) * 12 - 12;
    const offsetY = HEX_SIZE * 0.4 + Math.floor(index / 3) * 12;
    return `translate(${coord.x + offsetX}, ${coord.y + offsetY})`;
  }

  unitTransform(coord: HexCoord, index: number, side: 'us' | 'german'): string {
    const baseY = side === 'us' ? -HEX_SIZE * 0.15 : HEX_SIZE * 0.15;
    const offsetX = (index - 0.5) * 22;
    return `translate(${coord.x + offsetX}, ${coord.y + baseY})`;
  }

  unitsInHex(hexId: string, side: 'us' | 'german'): (USUnitState | GermanUnitState)[] {
    return (this.snippetSig()?.units ?? []).filter((u) => u.hexId === hexId && u.kind === side);
  }

  unitSymbol(unit: USUnitState | GermanUnitState): string {
    if (unit.kind !== 'us') return 'DE';
    const us = unit as USUnitState;
    const symbolMap: Record<string, string> = {
      infantry: 'INF', ranger: 'RGR', tank: 'TK',
      arty: 'ART', hq: 'HQ', engineer: 'ENG',
    };
    return symbolMap[us.type] ?? us.type.slice(0, 3).toUpperCase();
  }

  /** Cast to USUnitState — used in template @let bindings */
  asUSUnit(unit: USUnitState | GermanUnitState): USUnitState {
    return unit as USUnitState;
  }

  /** Cast to GermanUnitState — used in template @let bindings */
  asGermanUnit(unit: USUnitState | GermanUnitState): GermanUnitState {
    return unit as GermanUnitState;
  }

  /**
   * Division-aware fill color for US unit counters.
   * Falls back to the default US green when division is unset (back-compat).
   */
  usDivisionFill(unit: USUnitState): string {
    const FILLS: Record<string, string> = {
      '1st':  '#2f4a28',
      '29th': '#4f7a40',
    };
    return FILLS[unit.division ?? ''] ?? '#4a7040';
  }

  /**
   * Glyph color for German unit counters.
   * 716th Division uses yellow; all others use light grey.
   */
  germanGlyphColor(unit: GermanUnitState): string {
    return unit.germanDivision === '716th' ? '#d8c24a' : '#e8e8e8';
  }

  hexAriaLabel(hexId: string): string {
    const hex = this.hexMapSig()[hexId];
    if (!hex) return hexId;

    const terrainLabel = this.terrainLabel(hex.terrain);
    const units = (this.snippetSig()?.units ?? []).filter((u) => u.hexId === hexId);
    const unitDesc = units.length > 0
      ? `, ${units.length} unidad${units.length !== 1 ? 'es' : ''}`
      : '';
    const fireDotDesc = hex.fireDots.length > 0
      ? `, fuego ${hex.fireDots.map((fd) => this.fireDotLabel(fd.intensity)).join(' y ')}`
      : '';
    const wpDesc = hex.isGermanPosition && hex.germanPositionColor
      ? `, posición alemana (${hex.germanPositionColor})`
      : '';
    const selectedDesc = this.isHexSelected(hexId) ? ', seleccionado' : '';

    return `Hexágono ${hexId}: terreno ${terrainLabel}${unitDesc}${fireDotDesc}${wpDesc}${selectedDesc}`;
  }

  isHexSelected(hexId: string): boolean {
    return this.selectedHexIdsSig().includes(hexId);
  }

  private terrainLabel(terrain: string): string {
    const labels: Record<string, string> = {
      beach: 'playa', pavilion: 'pabellón', draw: 'hondonada',
      slope: 'pendiente', bluff: 'barranco', bocage: 'bocaje',
      cliff: 'acantilado', building: 'edificio', rough: 'terreno accidentado',
    };
    return labels[terrain] ?? terrain;
  }

  // ---- Interaction ----

  onHexClick(hexId: string): void {
    if (!this.interactiveSig()) return;
    this.hexSelected.emit(hexId);
  }

  onHexFocus(hexId: string): void {
    this.focusedHexIdSig.set(hexId);
  }

  /** Arrow key navigation between interactive hexes */
  onKeyDown(event: KeyboardEvent): void {
    if (!this.interactiveSig()) return;
    const coords = this.hexCoords();
    const currentId = this.focusedHexIdSig();
    if (!currentId) return;

    const currentIdx = coords.findIndex((c) => c.hexId === currentId);
    if (currentIdx < 0) return;

    let nextIdx = currentIdx;
    switch (event.key) {
      case 'ArrowRight': nextIdx = Math.min(currentIdx + 1, coords.length - 1); break;
      case 'ArrowLeft':  nextIdx = Math.max(currentIdx - 1, 0); break;
      case 'ArrowDown':  nextIdx = Math.min(currentIdx + 5, coords.length - 1); break;
      case 'ArrowUp':    nextIdx = Math.max(currentIdx - 5, 0); break;
      default: return;
    }

    if (nextIdx !== currentIdx) {
      event.preventDefault();
      const nextHexId = coords[nextIdx].hexId;
      this.focusedHexIdSig.set(nextHexId);
      const svgNative = this.svgEl()?.nativeElement;
      if (svgNative) {
        const target = svgNative.querySelector(
          `[data-hex-id="${nextHexId}"] .hex-hit-zone`,
        ) as SVGElement | null;
        target?.focus();
      }
    }
  }

  private updateRovingTabindex(): void {
    const svgNative = this.svgEl()?.nativeElement;
    if (!svgNative || !this.interactiveSig()) return;
    const hitZones = svgNative.querySelectorAll('.hex-hit-zone');
    hitZones.forEach((el, idx) => {
      (el as SVGElement).setAttribute('tabindex', idx === 0 ? '0' : '-1');
    });
  }
}
