import { Component, Input, ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import type { UnitType, GermanUnitSymbol } from 'content-schema';

/**
 * UnitSymbolComponent — renders glyphs for US and German units.
 *
 * All geometry is authored in a 60x60 viewBox space.
 * Inner symbol box: x=14 y=18 w=32 h=20, center 30,28.
 *
 * This component renders ONLY the glyph — no outer counter rect.
 * Callers (CounterComponent, board-renderer) provide their own background.
 *
 * Tank/armor glyph has two representations controlled by `symbolStyle`:
 *   - 'counter' (default): side-view silhouette (hull + turret + gun barrel + tracks).
 *     This matches the real Devir board counter glyph. No NATO box.
 *   - 'card': NATO armor oval (ellipse cx=30 cy=28 rx=12 ry=6) inside the standard
 *     inner box. Used on unit cards and the symbology reference page.
 *
 * Only `type === 'tank'` (US) and `germanSymbol === 'armor'` (German) are
 * affected by `symbolStyle`. All other unit types ignore it.
 *
 * Board-renderer reuse contract:
 *   @Input() type: UnitType                      — US glyph selector
 *   @Input() germanSymbol?: GermanUnitSymbol     — when set, renders German glyph
 *   @Input() color: string                       — stroke/fill color of the glyph
 *   @Input() strokeWidth: number                 — line weight in 60x60 units
 *   @Input() symbolStyle: 'counter' | 'card'    — tank/armor rendering variant
 */
/* eslint-disable @angular-eslint/component-selector -- attribute selector required: custom-element host breaks SVG render tree (getBBox=0) */
@Component({
  standalone: true,
  selector: '[ddobUnitSymbol]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <!-- Inner symbol box outline (shared by infantry, ranger, tank, arty, engineer, hq) -->
    @if (showBox) {
      <svg:rect
        x="14" y="18" width="32" height="20"
        fill="none"
        [attr.stroke]="color"
        [attr.stroke-width]="strokeWidth"
        aria-hidden="true" />
    }

    <!-- US infantry / ranger: crossed diagonals inside box -->
    @if (isUS && (type === 'infantry' || type === 'ranger')) {
      <svg:line x1="14" y1="18" x2="46" y2="38"
            [attr.stroke]="color" [attr.stroke-width]="strokeWidth"
            aria-hidden="true" />
      <svg:line x1="46" y1="18" x2="14" y2="38"
            [attr.stroke]="color" [attr.stroke-width]="strokeWidth"
            aria-hidden="true" />
    }

    <!-- US tank — counter style: side-view silhouette (hull + turret + gun barrel + tracks).
         Matches the real Devir board counter glyph. No NATO box. -->
    @if (isUS && type === 'tank' && symbolStyle === 'counter') {
      <!-- Track base (thin filled rectangle along the bottom) -->
      <svg:rect x="15" y="32" width="28" height="4" rx="2"
                [attr.fill]="color" stroke="none"
                aria-hidden="true" />
      <!-- Road wheels (two circles on the track) -->
      <svg:circle cx="20" cy="34" r="2.5"
                  [attr.fill]="color" stroke="none"
                  aria-hidden="true" />
      <svg:circle cx="38" cy="34" r="2.5"
                  [attr.fill]="color" stroke="none"
                  aria-hidden="true" />
      <!-- Hull body -->
      <svg:rect x="16" y="24" width="26" height="10" rx="2"
                [attr.fill]="color" stroke="none"
                aria-hidden="true" />
      <!-- Turret (smaller rounded rect on top-center of hull) -->
      <svg:rect x="22" y="18" width="14" height="8" rx="2"
                [attr.fill]="color" stroke="none"
                aria-hidden="true" />
      <!-- Gun barrel (thin rect pointing right from turret) -->
      <svg:rect x="36" y="20" width="10" height="3" rx="1"
                [attr.fill]="color" stroke="none"
                aria-hidden="true" />
    }

    <!-- US tank — card style: NATO armor oval inside the standard inner box. -->
    @if (isUS && type === 'tank' && symbolStyle === 'card') {
      <svg:ellipse cx="30" cy="28" rx="12" ry="6"
                   fill="none"
                   [attr.stroke]="color"
                   [attr.stroke-width]="strokeWidth"
                   aria-hidden="true" />
    }

    <!-- US arty (artillery): filled center dot -->
    @if (isUS && type === 'arty') {
      <svg:circle cx="30" cy="28" r="4"
              [attr.fill]="color"
              stroke="none"
              aria-hidden="true" />
    }

    <!-- US engineer: open bracket shape (APP-6 approximation) -->
    @if (isUS && type === 'engineer') {
      <svg:polyline
        points="22,34 22,22 38,22 38,34"
        fill="none"
        [attr.stroke]="color" [attr.stroke-width]="strokeWidth"
        stroke-linejoin="round"
        aria-hidden="true" />
      <!-- Center vertical tick -->
      <svg:line x1="30" y1="22" x2="30" y2="30"
            [attr.stroke]="color" [attr.stroke-width]="strokeWidth"
            aria-hidden="true" />
    }

    <!-- US hq: vertical flagstaff on left edge of box -->
    @if (isUS && type === 'hq') {
      <svg:line x1="14" y1="38" x2="14" y2="14"
            [attr.stroke]="color" [attr.stroke-width]="strokeWidth"
            aria-hidden="true" />
      <!-- Horizontal pennant -->
      <svg:line x1="14" y1="14" x2="24" y2="14"
            [attr.stroke]="color" [attr.stroke-width]="strokeWidth"
            aria-hidden="true" />
    }

    <!-- US general: 5-point star (no box) -->
    @if (isUS && type === 'general') {
      <svg:polygon
        [attr.points]="starPoints(30, 28, 10, 4)"
        [attr.fill]="color"
        stroke="none"
        aria-hidden="true" />
    }

    <!-- US hero: circle + inner star -->
    @if (isUS && type === 'hero') {
      <svg:circle cx="30" cy="28" r="9"
              fill="none"
              [attr.stroke]="color" [attr.stroke-width]="strokeWidth"
              aria-hidden="true" />
      <svg:polygon
        [attr.points]="starPoints(30, 28, 5, 2)"
        [attr.fill]="color"
        stroke="none"
        aria-hidden="true" />
    }

    <!-- German infantry: crossed-box (same geometry as US infantry) -->
    @if (!isUS && germanSymbol === 'infantry') {
      <svg:line x1="14" y1="18" x2="46" y2="38"
            [attr.stroke]="color" [attr.stroke-width]="strokeWidth"
            aria-hidden="true" />
      <svg:line x1="46" y1="18" x2="14" y2="38"
            [attr.stroke]="color" [attr.stroke-width]="strokeWidth"
            aria-hidden="true" />
    }

    <!-- German armor — counter style: side-view tank silhouette (same geometry as US tank). -->
    @if (!isUS && germanSymbol === 'armor' && symbolStyle === 'counter') {
      <!-- Track base -->
      <svg:rect x="15" y="32" width="28" height="4" rx="2"
                [attr.fill]="color" stroke="none"
                aria-hidden="true" />
      <!-- Road wheels -->
      <svg:circle cx="20" cy="34" r="2.5"
                  [attr.fill]="color" stroke="none"
                  aria-hidden="true" />
      <svg:circle cx="38" cy="34" r="2.5"
                  [attr.fill]="color" stroke="none"
                  aria-hidden="true" />
      <!-- Hull body -->
      <svg:rect x="16" y="24" width="26" height="10" rx="2"
                [attr.fill]="color" stroke="none"
                aria-hidden="true" />
      <!-- Turret -->
      <svg:rect x="22" y="18" width="14" height="8" rx="2"
                [attr.fill]="color" stroke="none"
                aria-hidden="true" />
      <!-- Gun barrel -->
      <svg:rect x="36" y="20" width="10" height="3" rx="1"
                [attr.fill]="color" stroke="none"
                aria-hidden="true" />
    }

    <!-- German armor — card style: NATO armor oval inside the standard inner box. -->
    @if (!isUS && germanSymbol === 'armor' && symbolStyle === 'card') {
      <svg:ellipse cx="30" cy="28" rx="12" ry="6"
                   fill="none"
                   [attr.stroke]="color"
                   [attr.stroke-width]="strokeWidth"
                   aria-hidden="true" />
    }

    <!-- German artillery: box + filled center dot -->
    @if (!isUS && (germanSymbol === 'artillery' || germanSymbol === 'artillery-88')) {
      <svg:circle cx="30" cy="28" r="4"
              [attr.fill]="color"
              stroke="none"
              aria-hidden="true" />
    }

    <!-- German artillery-88: additional "88" text below box -->
    @if (!isUS && germanSymbol === 'artillery-88') {
      <svg:text
        x="30" y="47"
        text-anchor="middle"
        dominant-baseline="middle"
        [attr.fill]="color"
        font-size="8"
        font-weight="bold"
        font-family="var(--font-family-mono, 'JetBrains Mono', monospace)"
        aria-hidden="true">88</svg:text>
    }
  `,
})
export class UnitSymbolComponent {
  @Input() type!: UnitType;
  @Input() germanSymbol?: GermanUnitSymbol;
  @Input() color = '#ffffff';
  @Input() strokeWidth = 2;
  /**
   * Controls the tank/armor rendering variant.
   * - 'counter' (default): side-view silhouette — matches the real Devir counter.
   * - 'card': NATO armor oval (ellipse) inside the standard inner box — used on
   *   unit cards and the symbology reference page.
   * All non-tank/armor unit types ignore this input.
   */
  @Input() symbolStyle: 'counter' | 'card' = 'counter';

  get isUS(): boolean {
    return !this.germanSymbol;
  }

  /**
   * Whether to render the inner bounding box.
   * - The tank/armor silhouette (counter style) has no box — the silhouette stands alone.
   * - The tank/armor card style (NATO oval) shows the box like other NATO symbols.
   * - The general/hero glyphs have no box.
   */
  get showBox(): boolean {
    const isTankOrArmor = this.isUS
      ? this.type === 'tank'
      : this.germanSymbol === 'armor';

    if (isTankOrArmor) {
      // Counter style: silhouette, no box. Card style: box + NATO oval.
      return this.symbolStyle === 'card';
    }

    if (!this.isUS) {
      return this.germanSymbol !== undefined;
    }
    // US: general and hero have no box.
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
