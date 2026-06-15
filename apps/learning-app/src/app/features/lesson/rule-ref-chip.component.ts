import {
  Component,
  input,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import type { RuleRef } from 'content-schema';

@Component({
  standalone: true,
  selector: 'app-rule-ref-chip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="rule-chip-wrapper">
      <button type="button"
              class="rule-chip"
              [attr.aria-expanded]="showTooltip()"
              [attr.aria-label]="'Regla §' + ruleRef().section + (ruleRef().note ? ': ' + ruleRef().note : '')"
              (click)="toggleTooltip()"
              (blur)="hideTooltip()">
        §{{ ruleRef().section }}
      </button>

      @if (showTooltip() && ruleRef().note) {
        <span class="rule-chip__tooltip" role="tooltip">
          <span class="rule-chip__tooltip-head">Reglamento · §{{ ruleRef().section }}</span>
          <span class="rule-chip__tooltip-body">{{ ruleRef().note }}</span>
        </span>
      }
    </span>
  `,
  styles: [`
    .rule-chip-wrapper {
      position: relative;
      display: inline-block;
    }

    .rule-chip {
      display: inline-flex;
      align-items: center;
      padding: 2px 7px;
      background: var(--accent-soft);
      color: var(--accent);
      border: 1px solid var(--accent);
      border-radius: var(--radius);
      font-family: 'Space Mono', monospace;
      font-size: 11px;
      letter-spacing: .06em;
      cursor: pointer;
      outline: none;
      transition: background 120ms ease;

      &:hover {
        background: rgba(226, 163, 61, .22);
      }

      &:focus-visible {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
      }
    }

    .rule-chip__tooltip {
      position: absolute;
      top: calc(100% + 6px);
      left: 0;
      z-index: 10;
      display: flex;
      flex-direction: column;
      gap: 4px;
      max-width: 260px;
      background: var(--char-2);
      border: 1px solid var(--line-strong);
      border-radius: var(--radius);
      padding: 10px 14px;
      box-shadow: 0 6px 24px rgba(0, 0, 0, .55);
      pointer-events: none;
      white-space: normal;
    }

    .rule-chip__tooltip-head {
      font-family: 'Oswald', sans-serif;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: .14em;
      color: var(--accent);
    }

    .rule-chip__tooltip-body {
      font-family: 'Space Mono', monospace;
      font-size: 13px;
      color: var(--bone);
      line-height: 1.5;
    }
  `],
})
export class RuleRefChipComponent {
  readonly ruleRef = input.required<RuleRef>();
  readonly showTooltip = signal(false);

  toggleTooltip(): void {
    if (this.ruleRef().note) {
      this.showTooltip.update((v) => !v);
    }
  }

  hideTooltip(): void {
    this.showTooltip.set(false);
  }
}
