import { describe, it, expect } from 'vitest';
import { Component, Input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { UnitType, GermanUnitSymbol } from 'content-schema';
import { UnitSymbolComponent } from './unit-symbol.component';

@Component({
  standalone: true,
  imports: [UnitSymbolComponent],
  template: `
    <svg>
      <svg:g ddobUnitSymbol [type]="type" [germanSymbol]="germanSymbol" [color]="color" />
    </svg>
  `,
})
class HostComponent {
  @Input() type: UnitType = 'infantry';
  @Input() germanSymbol?: GermanUnitSymbol;
  @Input() color = '#ffffff';
}

function setupUS(type: UnitType, color = '#ffffff') {
  const fixture = TestBed.createComponent(HostComponent);
  fixture.componentRef.setInput('type', type);
  fixture.componentRef.setInput('color', color);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

function setupGerman(germanSymbol: GermanUnitSymbol, color = '#e8e8e8') {
  const fixture = TestBed.createComponent(HostComponent);
  fixture.componentRef.setInput('type', 'infantry'); // required input, ignored when germanSymbol set
  fixture.componentRef.setInput('germanSymbol', germanSymbol);
  fixture.componentRef.setInput('color', color);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('UnitSymbolComponent — US types', () => {
  it('infantry renders two diagonal <line> elements (crossed diagonals)', () => {
    const el = setupUS('infantry');
    const lines = el.querySelectorAll('[ddobUnitSymbol] line');
    expect(lines.length).toBeGreaterThanOrEqual(2);
  });

  it('ranger renders two diagonal lines (same NATO glyph as infantry)', () => {
    const el = setupUS('ranger');
    const lines = el.querySelectorAll('[ddobUnitSymbol] line');
    expect(lines.length).toBeGreaterThanOrEqual(2);
  });

  it('tank renders an <ellipse> element (armor oval)', () => {
    const el = setupUS('tank');
    const ellipse = el.querySelector('[ddobUnitSymbol] ellipse');
    expect(ellipse).toBeTruthy();
  });

  it('arty renders a filled <circle> (artillery dot)', () => {
    const el = setupUS('arty');
    const circle = el.querySelector('[ddobUnitSymbol] circle');
    expect(circle).toBeTruthy();
    expect(circle?.getAttribute('fill')).not.toBe('none');
  });

  it('hq renders a vertical <line> (flagstaff)', () => {
    const el = setupUS('hq');
    const lines = el.querySelectorAll('[ddobUnitSymbol] line');
    expect(lines.length).toBeGreaterThanOrEqual(1);
  });

  it('general renders a <polygon> (star, no box rect)', () => {
    const el = setupUS('general');
    const polygon = el.querySelector('[ddobUnitSymbol] polygon');
    expect(polygon).toBeTruthy();
    // General has no box
    const box = el.querySelector('[ddobUnitSymbol] rect');
    expect(box).toBeNull();
  });

  it('engineer renders a <polyline> bracket shape', () => {
    const el = setupUS('engineer');
    const polyline = el.querySelector('[ddobUnitSymbol] polyline');
    expect(polyline).toBeTruthy();
  });

  it('hero renders a <circle> and a <polygon> (circled star)', () => {
    const el = setupUS('hero');
    const circle = el.querySelector('[ddobUnitSymbol] circle');
    const polygon = el.querySelector('[ddobUnitSymbol] polygon');
    expect(circle).toBeTruthy();
    expect(polygon).toBeTruthy();
  });

  it('color input is applied to stroke attributes', () => {
    const el = setupUS('infantry', '#ff0000');
    const line = el.querySelector('[ddobUnitSymbol] line');
    expect(line?.getAttribute('stroke')).toBe('#ff0000');
  });
});

describe('UnitSymbolComponent — German types', () => {
  it('german infantry renders two diagonal lines (crossed-box)', () => {
    const el = setupGerman('infantry');
    const lines = el.querySelectorAll('[ddobUnitSymbol] line');
    expect(lines.length).toBeGreaterThanOrEqual(2);
  });

  it('german armor renders an ellipse', () => {
    const el = setupGerman('armor');
    const ellipse = el.querySelector('[ddobUnitSymbol] ellipse');
    expect(ellipse).toBeTruthy();
  });

  it('german artillery renders a filled circle dot', () => {
    const el = setupGerman('artillery');
    const circle = el.querySelector('[ddobUnitSymbol] circle');
    expect(circle).toBeTruthy();
    expect(circle?.getAttribute('fill')).not.toBe('none');
  });

  it('german artillery-88 renders a <text> element containing "88"', () => {
    const el = setupGerman('artillery-88');
    const text = el.querySelector('[ddobUnitSymbol] text');
    expect(text).toBeTruthy();
    expect(text?.textContent).toContain('88');
  });

  it('german artillery-88 also renders the center dot (same as artillery)', () => {
    const el = setupGerman('artillery-88');
    const circle = el.querySelector('[ddobUnitSymbol] circle');
    expect(circle).toBeTruthy();
  });
});
