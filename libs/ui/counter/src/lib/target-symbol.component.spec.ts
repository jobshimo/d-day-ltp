import { describe, it, expect } from 'vitest';
import { Component, Input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { TargetSymbol } from 'content-schema';
import { TargetSymbolComponent } from './target-symbol.component';

@Component({
  standalone: true,
  imports: [TargetSymbolComponent],
  template: `
    <svg>
      <svg:g ddobTargetSymbol [symbol]="symbol" [control]="control" [size]="12" [cx]="30" [cy]="10" />
    </svg>
  `,
})
class HostComponent {
  @Input() symbol: TargetSymbol = 'circle';
  @Input() control: 'adjacent' | 'own' = 'own';
}

function setup(symbol: TargetSymbol, control: 'adjacent' | 'own' = 'own') {
  const fixture = TestBed.createComponent(HostComponent);
  fixture.componentRef.setInput('symbol', symbol);
  fixture.componentRef.setInput('control', control);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('TargetSymbolComponent', () => {
  it('circle symbol renders a <circle> element', () => {
    const el = setup('circle');
    const circle = el.querySelector('[ddobTargetSymbol] circle');
    expect(circle).toBeTruthy();
  });

  it('diamond symbol renders a <polygon> element', () => {
    const el = setup('diamond');
    const polygon = el.querySelector('[ddobTargetSymbol] polygon');
    expect(polygon).toBeTruthy();
  });

  it('triangle symbol renders a <polygon> element', () => {
    const el = setup('triangle');
    const polygon = el.querySelector('[ddobTargetSymbol] polygon');
    expect(polygon).toBeTruthy();
  });

  it('control=adjacent renders dark fill (#111)', () => {
    const el = setup('circle', 'adjacent');
    const shape = el.querySelector('[ddobTargetSymbol] circle');
    expect(shape?.getAttribute('fill')).toBe('#111');
  });

  it('control=own renders light fill (#fff)', () => {
    const el = setup('circle', 'own');
    const shape = el.querySelector('[ddobTargetSymbol] circle');
    expect(shape?.getAttribute('fill')).toBe('#fff');
  });

  it('all symbols have stroke #111', () => {
    for (const sym of ['circle', 'diamond', 'triangle'] as TargetSymbol[]) {
      const el = setup(sym);
      const shape = el.querySelector('[ddobTargetSymbol] circle, [ddobTargetSymbol] polygon');
      expect(shape?.getAttribute('stroke')).toBe('#111');
    }
  });
});
