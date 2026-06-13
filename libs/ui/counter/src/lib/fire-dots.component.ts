import { Component, Input, ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import type { FireDotIntensity } from 'content-schema';

/** Fire dot color map — duplicated from board-renderer to avoid circular dependency */
const FIRE_DOT_COLORS: Record<FireDotIntensity, string> = {
  intense:  '#e05f5f',
  steady:   '#e0a050',
  sporadic: '#c8a04a',
};

/**
 * FireDotsComponent — renders a horizontal row of fire-susceptibility dots
 * in the top-left area of a counter SVG (in 60x60 viewBox space).
 *
 * A11y: each dot uses color + icon (never color alone).
 * - intense: filled disc + white ring
 * - steady: filled disc + white center dot
 * - sporadic: dashed outer ring
 */
/* eslint-disable @angular-eslint/component-selector -- attribute selector required: custom-element host breaks SVG render tree (getBBox=0) */
@Component({
  standalone: true,
  selector: '[ddobFireDots]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    @for (dot of dots; track $index; let i = $index) {
      <svg:g [attr.transform]="dotTransform(i)" aria-hidden="true">
        <svg:circle
          r="3"
          [attr.fill]="dotColor(dot)"
          stroke="#1a1c1e"
          stroke-width="0.5" />
        @if (dot === 'intense') {
          <svg:circle r="1.5" fill="none" stroke="#ffffff" stroke-width="0.8" opacity="0.9" />
        } @else if (dot === 'steady') {
          <svg:circle r="1" fill="#ffffff" opacity="0.85" />
        } @else {
          <svg:circle r="2.5" fill="none" stroke="#ffffff" stroke-width="0.6"
                  stroke-dasharray="2,1.5" opacity="0.75" />
        }
      </svg:g>
    }
  `,
})
export class FireDotsComponent {
  @Input() dots: FireDotIntensity[] = [];

  dotColor(dot: FireDotIntensity): string {
    return FIRE_DOT_COLORS[dot] ?? '#c8a04a';
  }

  dotTransform(index: number): string {
    // Dots spaced 8px apart starting at x=5, y=5 in 60x60 space
    return `translate(${5 + index * 8}, 5)`;
  }
}
