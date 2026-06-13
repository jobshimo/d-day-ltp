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
      padding: 2px var(--space-2);
      background: rgba(200, 160, 74, 0.15);
      color: var(--color-accent);
      border: 1px solid var(--color-accent-dim);
      border-radius: var(--radius-sm);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      cursor: pointer;
      transition: background var(--transition-fast);
      letter-spacing: 0.03em;

      &:hover {
        background: rgba(200, 160, 74, 0.25);
      }

      &:focus-visible {
        outline: 2px solid var(--color-accent);
        outline-offset: 2px;
      }
    }

    .rule-chip__tooltip {
      position: absolute;
      top: calc(100% + var(--space-1));
      left: 0;
      z-index: 10;
      display: flex;
      flex-direction: column;
      gap: 2px;
      width: max-content;
      max-width: 260px;
      background: var(--color-surface-alt);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: var(--space-2) var(--space-3);
      font-size: var(--font-size-sm);
      color: var(--color-text-primary);
      white-space: normal;
      box-shadow: var(--shadow-md);
      pointer-events: none;
    }

    .rule-chip__tooltip-head {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--color-accent);
    }

    .rule-chip__tooltip-body {
      line-height: var(--line-height-normal);
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
