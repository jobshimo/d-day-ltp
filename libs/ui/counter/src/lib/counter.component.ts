import { Component, Input, ChangeDetectionStrategy, computed, signal, OnChanges } from '@angular/core';
import type { USUnitState, GermanUnitState } from 'content-schema';
import { UnitSymbolComponent } from './unit-symbol.component';
import { TargetSymbolComponent } from './target-symbol.component';
import { FireDotsComponent } from './fire-dots.component';

/**
 * Division fill colors for counter background.
 * Duplicated as SVG hex values — CSS vars are unreliable in SVG fill attrs across render contexts.
 */
const DIVISION_FILLS: Record<string, string> = {
  '1st':    '#2f4a28', // 1st Division — darker olive green
  '29th':   '#4f7a40', // 29th Division — lighter olive green
  default:  '#4a7040', // unknown/unset — matches board-renderer US rect fill
  german:   '#5c4a30', // German brown
};

/**
 * Unit type → Spanish label for aria-label
 */
const UNIT_TYPE_ES: Record<string, string> = {
  infantry: 'infantería',
  ranger:   'ranger',
  tank:     'tanques',
  arty:     'artillería',
  hq:       'cuartel general',
  general:  'general',
  hero:     'héroe',
  engineer: 'ingenieros',
};

/**
 * Target symbol → Spanish label for aria-label
 */
const TARGET_SYMBOL_ES: Record<string, string> = {
  circle:   'círculo',
  diamond:  'rombo',
  triangle: 'triángulo',
};

/**
 * German unit symbol → Spanish label
 */
const GERMAN_SYMBOL_ES: Record<string, string> = {
  infantry:       'infantería',
  armor:          'blindados',
  artillery:      'artillería',
  'artillery-88': 'artillería 88mm',
};

/**
 * CounterComponent (ddob-counter) — renders a wargame counter in SVG,
 * matching the REAL US counter sheet anatomy (from omaha03.jpg).
 *
 * viewBox: "0 0 60 60" (standard), "0 0 140 80" when annotated=true.
 *
 * Layout (top → bottom, verified against real counter sheet):
 * 1. Designation text — top, centered (e.g. "C/2R", "B/1/116")
 * 2. Steps dots — vertical column of filled dots to the LEFT of the unit symbol
 *    (dot count = unit.steps, 1–4)
 * 3. Unit symbol (UnitSymbolComponent) — upper-center, white glyph
 * 4. Arrival turn — small number to the RIGHT of the unit symbol
 * 5. Beach landing box — just BELOW the unit symbol, centered
 * 6. Target symbol (TargetSymbolComponent) — BOTTOM-LEFT
 * 7. Attack strength — BOTTOM-RIGHT, large bold number
 *
 * compact mode: symbol only (no text), for board mini-counters.
 */
@Component({
  standalone: true,
  selector: 'ddob-counter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UnitSymbolComponent, TargetSymbolComponent, FireDotsComponent],
  template: `
    <svg
      [attr.viewBox]="viewBox()"
      [attr.width]="size"
      [attr.height]="size"
      role="img"
      [attr.aria-label]="ariaLabel()"
      class="ddob-counter">

      <!-- 1. Background rect -->
      <rect
        x="1" y="1" width="58" height="58"
        rx="2"
        [attr.fill]="divisionFill()"
        stroke="#1a1c1e"
        stroke-width="1"
        aria-hidden="true" />

      <!-- Disrupted diagonal stripe overlay -->
      @if (isDisrupted()) {
        <line x1="1" y1="1" x2="59" y2="59"
              stroke="#e05f5f" stroke-width="2" stroke-dasharray="6,3"
              opacity="0.8" aria-hidden="true" />
      }

      <!-- Fire dots (top-left, only when present) — compact also shows them -->
      @if (hasFireDots()) {
        <g transform="translate(2, 0)" aria-hidden="true">
          <ddob-fire-dots [dots]="fireDots()" />
        </g>
      }

      <!-- 2. Designation text (full mode only, top centered) -->
      @if (variant === 'full' && designation()) {
        <text
          x="30" y="8"
          text-anchor="middle"
          dominant-baseline="middle"
          fill="#e8e8e8"
          font-size="9"
          font-weight="bold"
          font-family="sans-serif"
          aria-hidden="true">{{ designation() }}</text>
      }

      <!-- 3. Steps — vertical column of filled dots LEFT of the unit symbol (full mode only) -->
      @if (variant === 'full' && isUS()) {
        @for (dot of stepDots(); track $index; let i = $index) {
          <circle
            cx="9"
            [attr.cy]="stepDotCy(i)"
            r="2.8"
            fill="#e8e8e8"
            stroke="#1a1c1e"
            stroke-width="0.5"
            aria-hidden="true" />
        }
      }

      <!-- 4. Unit symbol glyph (upper-center; inner box x=14 y=16 w=32 h=20, center 30,26) -->
      @if (isUS()) {
        <ddob-unit-symbol
          [type]="usUnit()!.type"
          color="#ffffff"
          [strokeWidth]="2"
          aria-hidden="true" />
      } @else {
        <ddob-unit-symbol
          [type]="'infantry'"
          [germanSymbol]="germanUnit()?.germanUnitSymbol"
          [color]="germanGlyphColor()"
          [strokeWidth]="2"
          aria-hidden="true" />
      }

      <!-- 5. Arrival turn: small number to the RIGHT of the unit symbol (full mode only) -->
      <!-- Positioned at y=28 (vertical center of the symbol box which spans y=18..38) -->
      @if (variant === 'full' && arrivalTurn() !== null) {
        <text
          x="56" y="28"
          text-anchor="end"
          dominant-baseline="middle"
          fill="#e8e8e8"
          font-size="8"
          font-family="sans-serif"
          aria-hidden="true">{{ arrivalTurn() }}</text>
      }

      <!-- 6. Beach landing box: just BELOW the unit symbol, centered (full mode only) -->
      @if (variant === 'full' && beachLandingBox()) {
        <text
          x="30" y="42"
          text-anchor="middle"
          dominant-baseline="middle"
          fill="#e8e8e8"
          font-size="9"
          font-family="sans-serif"
          aria-hidden="true">{{ beachLandingBox() }}</text>
      }

      <!-- 7. Target symbol: BOTTOM-LEFT (full mode only for US) -->
      @if (variant === 'full' && isUS()) {
        <ddob-target-symbol
          [symbol]="usUnit()!.targetSymbol"
          [control]="targetControl()"
          [size]="12"
          [cx]="10"
          [cy]="52"
          aria-hidden="true" />
      }

      <!-- 8. Attack strength: BOTTOM-RIGHT, large bold (full mode only) -->
      @if (variant === 'full') {
        <text
          x="55" y="59"
          text-anchor="end"
          dominant-baseline="auto"
          fill="#e8e8e8"
          font-size="20"
          font-weight="bold"
          font-family="sans-serif"
          aria-hidden="true">{{ displayStrength() }}</text>
      }

      <!-- Annotation callouts (annotated mode, full mode only) — labels right/above the counter -->
      @if (annotated && variant === 'full') {
        <g class="counter__annotations" aria-hidden="true">

          <!-- Designación → top-center -->
          <line x1="30" y1="8" x2="70" y2="8"
                stroke="#c8a04a" stroke-width="0.8" stroke-dasharray="3,2" />
          <text x="72" y="10" fill="#c8a04a" font-size="8"
                font-family="sans-serif">Designación</text>

          <!-- Escalones → left dot column (point to x=9, y=26 midpoint of dots) -->
          <line x1="9" y1="26" x2="70" y2="70"
                stroke="#c8a04a" stroke-width="0.8" stroke-dasharray="3,2" />
          <text x="72" y="72" fill="#c8a04a" font-size="8"
                font-family="sans-serif">Escalones</text>

          <!-- Tipo de unidad → symbol top (30,18 = top of box) -->
          <line x1="30" y1="18" x2="30" y2="-2"
                stroke="#c8a04a" stroke-width="0.8" stroke-dasharray="3,2" />
          <text x="30" y="-5" text-anchor="middle" fill="#c8a04a" font-size="8"
                font-family="sans-serif">Tipo de unidad</text>

          <!-- Turno de llegada → right of symbol (y=28 = vertical center of box) -->
          <line x1="56" y1="28" x2="70" y2="28"
                stroke="#c8a04a" stroke-width="0.8" stroke-dasharray="3,2" />
          <text x="72" y="30" fill="#c8a04a" font-size="8"
                font-family="sans-serif">Turno de llegada</text>

          <!-- Caja de desembarco → below symbol -->
          <line x1="30" y1="42" x2="70" y2="42"
                stroke="#c8a04a" stroke-width="0.8" stroke-dasharray="3,2" />
          <text x="72" y="44" fill="#c8a04a" font-size="8"
                font-family="sans-serif">Caja de desembarco</text>

          <!-- Símbolo de objetivo → bottom-left -->
          <line x1="10" y1="52" x2="-5" y2="52"
                stroke="#c8a04a" stroke-width="0.8" stroke-dasharray="3,2" />
          <text x="-7" y="54" text-anchor="end" fill="#c8a04a" font-size="8"
                font-family="sans-serif">Símbolo de objetivo</text>

          <!-- Fuerza de ataque → bottom-right -->
          <line x1="55" y1="55" x2="70" y2="55"
                stroke="#c8a04a" stroke-width="0.8" stroke-dasharray="3,2" />
          <text x="72" y="57" fill="#c8a04a" font-size="8"
                font-family="sans-serif">Fuerza de ataque</text>

        </g>
      }
    </svg>
  `,
  styles: [`
    :host {
      display: inline-block;
      /* Prevent the counter from overflowing its container on narrow screens */
      max-width: 100%;
    }
    .ddob-counter {
      display: block;
      /* Allow the SVG to shrink on small screens while respecting the
         explicit width/height attributes set via [attr.width]/[attr.height] */
      max-width: 100%;
      height: auto;
    }
  `],
})
export class CounterComponent implements OnChanges {
  @Input() unit!: USUnitState | GermanUnitState;
  @Input() side: 'front' | 'back' = 'front';
  @Input() size = 120;
  @Input() annotated = false;
  @Input() variant: 'full' | 'compact' = 'full';

  // Internal signal mirrors updated via OnChanges (matches board-renderer convention)
  private readonly _unit = signal<USUnitState | GermanUnitState | null>(null);
  private readonly _side = signal<'front' | 'back'>('front');

  ngOnChanges(): void {
    this._unit.set(this.unit ?? null);
    this._side.set(this.side ?? 'front');
  }

  // ---- Computed helpers ----

  readonly isUS = computed(() => this._unit()?.kind === 'us');

  readonly usUnit = computed(() => {
    const u = this._unit();
    return u?.kind === 'us' ? (u as USUnitState) : null;
  });

  readonly germanUnit = computed(() => {
    const u = this._unit();
    return u?.kind === 'german' ? (u as GermanUnitState) : null;
  });

  /** Background fill based on division */
  readonly divisionFill = computed(() => {
    const u = this._unit();
    if (!u) return DIVISION_FILLS['default'];
    if (u.kind === 'german') return DIVISION_FILLS['german'];
    const us = u as USUnitState;
    return DIVISION_FILLS[us.division ?? 'default'] ?? DIVISION_FILLS['default'];
  });

  /** Displayed strength: front = attackStrength, back = reducedAttackStrength ?? attackStrength */
  readonly displayStrength = computed(() => {
    const u = this.usUnit();
    if (!u) {
      // German: use strength field
      return String(this.germanUnit()?.strength ?? '?');
    }
    if (this._side() === 'back') {
      return String(u.reducedAttackStrength ?? u.attackStrength);
    }
    return String(u.attackStrength);
  });

  /** Aria-label in Spanish per design spec */
  readonly ariaLabel = computed(() => {
    const u = this._unit();
    if (!u) return 'Ficha de unidad';

    if (u.kind === 'us') {
      const us = u as USUnitState;
      const tipoEs = UNIT_TYPE_ES[us.type] ?? us.type;
      const symEs = TARGET_SYMBOL_ES[us.targetSymbol] ?? us.targetSymbol;
      const control = us.targetSymbol === 'circle' ? 'control adyacente' : 'solo hexágono propio';
      let label = `Ficha de EE.UU.`;
      if (us.designation) label += ` ${us.designation},`;
      label += ` ${tipoEs}, ${us.steps} escalones, fuerza de ataque ${this.displayStrength()}, símbolo de objetivo ${symEs} (${control})`;
      if (us.arrivalTurn != null) label += `, llega turno ${us.arrivalTurn}`;
      if (us.beachLandingBox) label += ` en ${us.beachLandingBox}`;
      if (us.range != null) label += `, alcance ${us.range === 'U' ? 'ilimitado' : us.range}`;
      return label;
    } else {
      const de = u as GermanUnitState;
      const symEs = de.germanUnitSymbol ? (GERMAN_SYMBOL_ES[de.germanUnitSymbol] ?? de.germanUnitSymbol) : 'unidad';
      return `Ficha alemana, ${symEs}, división ${de.germanDivision ?? 'desconocida'}, fuerza ${de.strength}`;
    }
  });

  readonly isDisrupted = computed(() => this._unit()?.isDisrupted ?? false);

  readonly hasFireDots = computed(() => {
    const u = this.usUnit();
    return !!(u?.unitFireDots?.length);
  });

  readonly fireDots = computed(() => this.usUnit()?.unitFireDots ?? []);

  readonly designation = computed(() => this.usUnit()?.designation ?? null);

  readonly targetControl = computed<'adjacent' | 'own'>(() => {
    // Per design: circle = adjacent, diamond/triangle = own — this is a game rule
    const sym = this.usUnit()?.targetSymbol;
    return sym === 'circle' ? 'adjacent' : 'own';
  });

  readonly germanGlyphColor = computed(() => {
    const de = this.germanUnit();
    return de?.germanDivision === '716th' ? '#d8c24a' : '#e8e8e8';
  });

  /** Steps as an array of length=unit.steps for @for iteration */
  readonly stepDots = computed(() => {
    const u = this.usUnit();
    if (!u) return [];
    return Array.from({ length: u.steps });
  });

  /**
   * Y-coordinate of each step dot.
   * UnitSymbolComponent renders its box at x=14 y=18 w=32 h=20.
   * Dots align with this box vertically: y=18 to y=38, height=20.
   * With up to 4 dots, evenly distribute them across the box height.
   */
  stepDotCy(index: number): number {
    // Distribute dots aligned with symbol box (y=18 to y=38, height=20)
    const boxTop = 18;
    const boxHeight = 20;
    const totalDots = this.stepDots().length;
    const spacing = totalDots > 1 ? boxHeight / (totalDots - 1) : 0;
    return totalDots === 1 ? boxTop + boxHeight / 2 : boxTop + index * spacing;
  }

  readonly arrivalTurn = computed(() => {
    const u = this.usUnit();
    return u?.arrivalTurn ?? null;
  });

  readonly beachLandingBox = computed(() => {
    const u = this.usUnit();
    return u?.beachLandingBox ?? null;
  });

  /**
   * viewBox expands in annotated mode to accommodate right-side and top/bottom callout labels.
   * Annotated viewBox: "−20 −15 160 95" — adds negative offset for left/top labels,
   * extends right for right-side labels (need ~140px total width, ~80px total height).
   */
  readonly viewBox = computed(() => {
    return this.annotated && this.variant === 'full' ? '-20 -15 160 95' : '0 0 60 60';
  });
}
