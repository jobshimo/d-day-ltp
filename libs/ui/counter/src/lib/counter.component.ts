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
 * CounterComponent (ddob-counter) — renders a complete wargame counter in SVG.
 *
 * viewBox: "0 0 60 60" (standard), "0 0 120 90" when annotated=true.
 *
 * Layer order (z-order):
 * 1. Background rect (division color; disrupted stripe overlay)
 * 2. Fire dots (top-left)
 * 3. Target symbol (top-center)
 * 4. Designation text (below target symbol, full mode only)
 * 5. Unit symbol glyph (center)
 * 6. Attack strength text (bottom-left)
 * 7. Steps bars (top-right, full mode only)
 * 8. Arrival/beach box text (bottom-center, full mode only)
 * 9. Range text (bottom-right, full mode only)
 * 10. Annotation callouts (when annotated=true, full mode only)
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

      <!-- 2. Fire dots (top-left, only when present) -->
      @if (hasFireDots()) {
        <g transform="translate(2, 0)" aria-hidden="true">
          <ddob-fire-dots [dots]="fireDots()" />
        </g>
      }

      <!-- 3. Target symbol (top-center) -->
      @if (isUS()) {
        <ddob-target-symbol
          [symbol]="usUnit()!.targetSymbol"
          [control]="targetControl()"
          [size]="12"
          [cx]="30"
          [cy]="10"
          aria-hidden="true" />
      }

      <!-- 4. Designation text (full mode only, below target symbol) -->
      @if (variant === 'full' && designation()) {
        <text
          x="30" y="20"
          text-anchor="middle"
          dominant-baseline="middle"
          fill="#e8e8e8"
          font-size="6"
          font-family="var(--font-family-mono, 'JetBrains Mono', monospace)"
          aria-hidden="true">{{ designation() }}</text>
      }

      <!-- 5. Unit symbol glyph (center, inner box x=14 y=18 w=32 h=20) -->
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

      <!-- 6. Attack strength text (bottom-left) -->
      @if (variant === 'full') {
        <text
          x="6" y="55"
          text-anchor="middle"
          dominant-baseline="auto"
          fill="#e8e8e8"
          font-size="18"
          font-weight="bold"
          font-family="var(--font-family-mono, 'JetBrains Mono', monospace)"
          aria-hidden="true">{{ displayStrength() }}</text>
      }

      <!-- 7. Steps bars (top-right, full mode only) -->
      @if (variant === 'full' && isUS()) {
        @for (bar of stepBars(); track $index; let i = $index) {
          <rect
            [attr.x]="54"
            [attr.y]="4 + i * 5"
            width="4"
            height="3"
            [attr.fill]="bar ? '#e8e8e8' : '#3d4147'"
            aria-hidden="true" />
        }
      }

      <!-- 8. Arrival/beach box text (bottom-center, full mode only) -->
      @if (variant === 'full' && arrivalInfo()) {
        <text
          x="30" y="57"
          text-anchor="middle"
          dominant-baseline="auto"
          fill="#e8e8e8"
          font-size="6"
          font-family="var(--font-family-mono, 'JetBrains Mono', monospace)"
          aria-hidden="true">{{ arrivalInfo() }}</text>
      }

      <!-- 9. Range text (bottom-right, full mode only) -->
      @if (variant === 'full' && rangeText()) {
        <text
          x="56" y="57"
          text-anchor="end"
          dominant-baseline="auto"
          fill="#e8e8e8"
          font-size="6"
          font-family="var(--font-family-mono, 'JetBrains Mono', monospace)"
          aria-hidden="true">{{ rangeText() }}</text>
      }

      <!-- 10. Annotation callouts (annotated mode, full mode only) -->
      @if (annotated && variant === 'full') {
        <g class="counter__annotations" aria-hidden="true">
          <!-- Attack strength callout -->
          <line x1="6" y1="50" x2="70" y2="50"
                stroke="#c8a04a" stroke-width="0.8" stroke-dasharray="3,2" />
          <text x="72" y="52" fill="#c8a04a" font-size="7"
                font-family="var(--font-family-mono, 'JetBrains Mono', monospace)">Fuerza de ataque</text>

          <!-- Target symbol callout -->
          <line x1="30" y1="10" x2="30" y2="-5"
                stroke="#c8a04a" stroke-width="0.8" stroke-dasharray="3,2" />
          <text x="30" y="-8" text-anchor="middle" fill="#c8a04a" font-size="7"
                font-family="var(--font-family-mono, 'JetBrains Mono', monospace)">Símbolo de objetivo</text>

          <!-- Steps callout -->
          <line x1="55" y1="10" x2="75" y2="10"
                stroke="#c8a04a" stroke-width="0.8" stroke-dasharray="3,2" />
          <text x="77" y="13" fill="#c8a04a" font-size="7"
                font-family="var(--font-family-mono, 'JetBrains Mono', monospace)">Escalones</text>

          <!-- Designation callout -->
          @if (designation()) {
            <line x1="30" y1="20" x2="70" y2="20"
                  stroke="#c8a04a" stroke-width="0.8" stroke-dasharray="3,2" />
            <text x="72" y="23" fill="#c8a04a" font-size="7"
                  font-family="var(--font-family-mono, 'JetBrains Mono', monospace)">Designación</text>
          }
        </g>
      }
    </svg>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
    .ddob-counter {
      display: block;
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

  readonly stepBars = computed(() => {
    const u = this.usUnit();
    if (!u) return [];
    const maxSteps = 4;
    const currentSteps = u.steps;
    // Fill bars from top: current steps filled, rest empty
    return Array.from({ length: maxSteps }, (_, i) => i < currentSteps);
  });

  readonly arrivalInfo = computed(() => {
    const u = this.usUnit();
    if (!u) return null;
    const parts: string[] = [];
    if (u.arrivalTurn != null) parts.push(`T${u.arrivalTurn}`);
    if (u.beachLandingBox) parts.push(u.beachLandingBox);
    return parts.length > 0 ? parts.join(' ') : null;
  });

  readonly rangeText = computed(() => {
    const u = this.usUnit();
    if (!u || u.range == null) return null;
    return String(u.range);
  });

  /** viewBox grows to 120x90 only in annotated mode to give callouts room */
  readonly viewBox = computed(() => {
    return this.annotated && this.variant === 'full' ? '0 0 120 90' : '0 0 60 60';
  });
}
