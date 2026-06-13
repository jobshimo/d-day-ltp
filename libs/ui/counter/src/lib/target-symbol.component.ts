import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import type { TargetSymbol } from 'content-schema';

/**
 * TargetSymbolComponent — renders circle/diamond/triangle target symbol.
 *
 * Semantics (rule 2.21):
 * - control='adjacent' → black fill (unit controls adjacent hexes)
 * - control='own' → white fill with black outline (controls only own hex)
 */
@Component({
  standalone: true,
  selector: 'ddob-target-symbol',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (symbol === 'circle') {
      <circle
        [attr.cx]="cx"
        [attr.cy]="cy"
        [attr.r]="size / 2"
        [attr.fill]="fill"
        stroke="#111"
        stroke-width="1"
        aria-hidden="true" />
    } @else if (symbol === 'diamond') {
      <polygon
        [attr.points]="diamondPoints"
        [attr.fill]="fill"
        stroke="#111"
        stroke-width="1"
        aria-hidden="true" />
    } @else if (symbol === 'triangle') {
      <polygon
        [attr.points]="trianglePoints"
        [attr.fill]="fill"
        stroke="#111"
        stroke-width="1"
        aria-hidden="true" />
    }
  `,
})
export class TargetSymbolComponent {
  @Input() symbol!: TargetSymbol;
  @Input() control: 'adjacent' | 'own' = 'own';
  /** Bounding diameter in 60x60 viewBox units */
  @Input() size = 12;
  /** Center X in 60x60 viewBox units */
  @Input() cx = 30;
  /** Center Y in 60x60 viewBox units */
  @Input() cy = 10;

  get fill(): string {
    return this.control === 'adjacent' ? '#111' : '#fff';
  }

  get diamondPoints(): string {
    const r = this.size / 2;
    return [
      `${this.cx},${this.cy - r}`,
      `${this.cx + r},${this.cy}`,
      `${this.cx},${this.cy + r}`,
      `${this.cx - r},${this.cy}`,
    ].join(' ');
  }

  get trianglePoints(): string {
    const r = this.size / 2;
    // Equilateral triangle, apex up
    const height = r * Math.sqrt(3);
    return [
      `${this.cx},${this.cy - r}`,
      `${this.cx + r},${this.cy + height / 2}`,
      `${this.cx - r},${this.cy + height / 2}`,
    ].join(' ');
  }
}
