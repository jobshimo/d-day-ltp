import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import type { UnitType, GermanUnitSymbol } from 'content-schema';

/**
 * UnitSymbolComponent — renders NATO APP-6 glyphs for US and German units.
 *
 * All geometry is authored in a 60x60 viewBox space.
 * Inner symbol box: x=14 y=18 w=32 h=20, center 30,28.
 *
 * This component renders ONLY the glyph — no outer counter rect.
 * Callers (CounterComponent, board-renderer) provide their own background.
 *
 * Board-renderer reuse contract:
 *   @Input() type: UnitType           — US glyph selector
 *   @Input() germanSymbol?: GermanUnitSymbol — when set, renders German glyph
 *   @Input() color: string            — stroke/fill color of the glyph
 *   @Input() strokeWidth: number      — line weight in 60x60 units
 */
@Component({
  standalone: true,
  selector: 'ddob-unit-symbol',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Inner symbol box outline (shared by infantry, ranger, tank, arty, engineer, hq) -->
    @if (showBox) {
      <rect
        x="14" y="18" width="32" height="20"
        fill="none"
        [attr.stroke]="color"
        [attr.stroke-width]="strokeWidth"
        aria-hidden="true" />
    }

    <!-- US infantry / ranger: crossed diagonals inside box -->
    @if (isUS && (type === 'infantry' || type === 'ranger')) {
      <line x1="14" y1="18" x2="46" y2="38"
            [attr.stroke]="color" [attr.stroke-width]="strokeWidth"
            aria-hidden="true" />
      <line x1="46" y1="18" x2="14" y2="38"
            [attr.stroke]="color" [attr.stroke-width]="strokeWidth"
            aria-hidden="true" />
    }

    <!-- US tank (armor): horizontal ellipse -->
    @if (isUS && type === 'tank') {
      <ellipse cx="30" cy="28" rx="12" ry="6"
               fill="none"
               [attr.stroke]="color" [attr.stroke-width]="strokeWidth"
               aria-hidden="true" />
    }

    <!-- US arty (artillery): filled center dot -->
    @if (isUS && type === 'arty') {
      <circle cx="30" cy="28" r="4"
              [attr.fill]="color"
              stroke="none"
              aria-hidden="true" />
    }

    <!-- US engineer: open bracket shape (APP-6 approximation) -->
    @if (isUS && type === 'engineer') {
      <polyline
        points="22,34 22,22 38,22 38,34"
        fill="none"
        [attr.stroke]="color" [attr.stroke-width]="strokeWidth"
        stroke-linejoin="round"
        aria-hidden="true" />
      <!-- Center vertical tick -->
      <line x1="30" y1="22" x2="30" y2="30"
            [attr.stroke]="color" [attr.stroke-width]="strokeWidth"
            aria-hidden="true" />
    }

    <!-- US hq: vertical flagstaff on left edge of box -->
    @if (isUS && type === 'hq') {
      <line x1="14" y1="38" x2="14" y2="14"
            [attr.stroke]="color" [attr.stroke-width]="strokeWidth"
            aria-hidden="true" />
      <!-- Horizontal pennant -->
      <line x1="14" y1="14" x2="24" y2="14"
            [attr.stroke]="color" [attr.stroke-width]="strokeWidth"
            aria-hidden="true" />
    }

    <!-- US general: 5-point star (no box) -->
    @if (isUS && type === 'general') {
      <polygon
        [attr.points]="starPoints(30, 28, 10, 4)"
        [attr.fill]="color"
        stroke="none"
        aria-hidden="true" />
    }

    <!-- US hero: circle + inner star -->
    @if (isUS && type === 'hero') {
      <circle cx="30" cy="28" r="9"
              fill="none"
              [attr.stroke]="color" [attr.stroke-width]="strokeWidth"
              aria-hidden="true" />
      <polygon
        [attr.points]="starPoints(30, 28, 5, 2)"
        [attr.fill]="color"
        stroke="none"
        aria-hidden="true" />
    }

    <!-- German infantry: crossed-box (same geometry as US infantry) -->
    @if (!isUS && germanSymbol === 'infantry') {
      <line x1="14" y1="18" x2="46" y2="38"
            [attr.stroke]="color" [attr.stroke-width]="strokeWidth"
            aria-hidden="true" />
      <line x1="46" y1="18" x2="14" y2="38"
            [attr.stroke]="color" [attr.stroke-width]="strokeWidth"
            aria-hidden="true" />
    }

    <!-- German armor: box + ellipse (same as US tank) -->
    @if (!isUS && germanSymbol === 'armor') {
      <ellipse cx="30" cy="28" rx="12" ry="6"
               fill="none"
               [attr.stroke]="color" [attr.stroke-width]="strokeWidth"
               aria-hidden="true" />
    }

    <!-- German artillery: box + filled center dot -->
    @if (!isUS && (germanSymbol === 'artillery' || germanSymbol === 'artillery-88')) {
      <circle cx="30" cy="28" r="4"
              [attr.fill]="color"
              stroke="none"
              aria-hidden="true" />
    }

    <!-- German artillery-88: additional "88" text below box -->
    @if (!isUS && germanSymbol === 'artillery-88') {
      <text
        x="30" y="47"
        text-anchor="middle"
        dominant-baseline="middle"
        [attr.fill]="color"
        font-size="8"
        font-weight="bold"
        font-family="var(--font-family-mono, 'JetBrains Mono', monospace)"
        aria-hidden="true">88</text>
    }
  `,
})
export class UnitSymbolComponent {
  @Input() type!: UnitType;
  @Input() germanSymbol?: GermanUnitSymbol;
  @Input() color = '#ffffff';
  @Input() strokeWidth = 2;

  get isUS(): boolean {
    return !this.germanSymbol;
  }

  /** Whether to render the inner bounding box (not used for general/hero which have no box) */
  get showBox(): boolean {
    if (!this.isUS) {
      // German types all have box
      return !!this.germanSymbol;
    }
    // US: general and hero have no box
    return this.type !== 'general' && this.type !== 'hero';
  }

  /** Generate a 5-point star polygon centered at (cx, cy) with outer radius r and inner radius ri */
  starPoints(cx: number, cy: number, r: number, ri: number): string {
    const points: string[] = [];
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI / 5) * i - Math.PI / 2;
      const radius = i % 2 === 0 ? r : ri;
      points.push(`${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`);
    }
    return points.join(' ');
  }
}
