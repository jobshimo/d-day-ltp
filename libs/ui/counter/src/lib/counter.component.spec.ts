import { describe, it, expect } from 'vitest';
import { Component, Input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { USUnitState, GermanUnitState } from 'content-schema';
import { CounterComponent } from './counter.component';

// ---- Fixtures ----

const US_1ST: USUnitState = {
  kind: 'us',
  id: 'A-116',
  type: 'infantry',
  steps: 3,
  targetSymbol: 'circle',
  weapons: ['BZ'],
  attackStrength: 3,
  reducedAttackStrength: 2,
  isDisrupted: false,
  hexId: null,
  designation: 'A/116',
  division: '1st',
  arrivalTurn: 1,
  beachLandingBox: 'DW1',
};

const US_29TH: USUnitState = {
  kind: 'us',
  id: 'B-116',
  type: 'infantry',
  steps: 2,
  targetSymbol: 'circle',
  weapons: ['BZ'],
  attackStrength: 2,
  reducedAttackStrength: 1,
  isDisrupted: false,
  hexId: null,
  designation: 'B/116',
  division: '29th',
};

const US_DISRUPTED: USUnitState = {
  kind: 'us',
  id: 'C-116',
  type: 'infantry',
  steps: 2,
  targetSymbol: 'circle',
  weapons: ['BZ'],
  attackStrength: 2,
  isDisrupted: true,
  hexId: null,
};

const GERMAN: GermanUnitState = {
  kind: 'german',
  id: 'de-1',
  type: 'WN',
  isRevealed: true,
  strength: 5,
  weaponRequirements: ['AR'],
  hasDepthMarker: false,
  isDisrupted: false,
  hexId: 'A1',
  germanDivision: '352nd',
  germanUnitSymbol: 'infantry',
};

// ---- Host component for binding pattern ----

@Component({
  standalone: true,
  imports: [CounterComponent],
  template: `
    <ddob-counter
      [unit]="unit"
      [side]="side"
      [size]="size"
      [annotated]="annotated"
      [variant]="variant" />
  `,
})
class HostComponent {
  @Input() unit!: USUnitState | GermanUnitState;
  @Input() side: 'front' | 'back' = 'front';
  @Input() size = 120;
  @Input() annotated = false;
  @Input() variant: 'full' | 'compact' = 'full';
}

function setup(inputs: Partial<HostComponent>) {
  const fixture = TestBed.createComponent(HostComponent);
  Object.entries(inputs).forEach(([key, val]) => {
    fixture.componentRef.setInput(key, val);
  });
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

// ---- Tests ----

describe('CounterComponent', () => {
  it('renders an <svg> element', () => {
    const el = setup({ unit: US_1ST });
    const svg = el.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('front side shows attackStrength value', () => {
    const el = setup({ unit: US_1ST, side: 'front' });
    const texts = Array.from(el.querySelectorAll('text'));
    const strengthText = texts.find((t) => t.textContent?.trim() === '3');
    expect(strengthText).toBeTruthy();
  });

  it('back side shows reducedAttackStrength value', () => {
    const el = setup({ unit: US_1ST, side: 'back' });
    const texts = Array.from(el.querySelectorAll('text'));
    const strengthText = texts.find((t) => t.textContent?.trim() === '2');
    expect(strengthText).toBeTruthy();
  });

  it('1st Division fill is different from 29th Division fill', () => {
    const el1st = setup({ unit: US_1ST });
    const el29th = setup({ unit: US_29TH });

    const bg1st = el1st.querySelector('ddob-counter > svg > rect')?.getAttribute('fill');
    const bg29th = el29th.querySelector('ddob-counter > svg > rect')?.getAttribute('fill');

    expect(bg1st).toBeTruthy();
    expect(bg29th).toBeTruthy();
    expect(bg1st).not.toBe(bg29th);
  });

  it('annotated=true renders .counter__annotations group', () => {
    const el = setup({ unit: US_1ST, annotated: true });
    const annotations = el.querySelector('.counter__annotations');
    expect(annotations).toBeTruthy();
  });

  it('annotated=false does not render .counter__annotations group', () => {
    const el = setup({ unit: US_1ST, annotated: false });
    const annotations = el.querySelector('.counter__annotations');
    expect(annotations).toBeNull();
  });

  it('aria-label contains designation', () => {
    const el = setup({ unit: US_1ST });
    const svg = el.querySelector('svg');
    expect(svg?.getAttribute('aria-label')).toContain('A/116');
  });

  it('aria-label contains unit type in Spanish', () => {
    const el = setup({ unit: US_1ST });
    const svg = el.querySelector('svg');
    expect(svg?.getAttribute('aria-label')).toContain('infantería');
  });

  it('aria-label contains attack strength', () => {
    const el = setup({ unit: US_1ST });
    const svg = el.querySelector('svg');
    expect(svg?.getAttribute('aria-label')).toContain('3');
  });

  it('aria-label contains target symbol in Spanish', () => {
    const el = setup({ unit: US_1ST });
    const svg = el.querySelector('svg');
    expect(svg?.getAttribute('aria-label')).toContain('círculo');
  });

  it('disrupted=true renders a diagonal stripe overlay', () => {
    const el = setup({ unit: US_DISRUPTED });
    // Disrupted stripe is a dashed line with red stroke
    const stripeLine = Array.from(el.querySelectorAll('line')).find(
      (l) => l.getAttribute('stroke') === '#e05f5f',
    );
    expect(stripeLine).toBeTruthy();
  });

  it('compact variant does not render strength text', () => {
    const el = setup({ unit: US_1ST, variant: 'compact' });
    const texts = Array.from(el.querySelectorAll('text'));
    // Compact mode: no large strength text rendered
    const strengthText = texts.find((t) => t.getAttribute('font-size') === '18');
    expect(strengthText).toBeUndefined();
  });

  it('compact variant does not render steps bars', () => {
    const el = setup({ unit: US_1ST, variant: 'compact' });
    // Steps bars are small rects at x=54
    const stepBars = Array.from(el.querySelectorAll('rect')).filter(
      (r) => r.getAttribute('x') === '54',
    );
    expect(stepBars.length).toBe(0);
  });

  it('divisionFill returns correct hex for 1st Division', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentRef.setInput('unit', US_1ST);
    fixture.detectChanges();
    const counter = fixture.debugElement.children[0].componentInstance as CounterComponent;
    expect(counter.divisionFill()).toBe('#2f4a28');
  });

  it('divisionFill returns correct hex for 29th Division', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentRef.setInput('unit', US_29TH);
    fixture.detectChanges();
    const counter = fixture.debugElement.children[0].componentInstance as CounterComponent;
    expect(counter.divisionFill()).toBe('#4f7a40');
  });

  it('German unit renders without error and has an svg', () => {
    const el = setup({ unit: GERMAN });
    const svg = el.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('German aria-label contains "alemana"', () => {
    const el = setup({ unit: GERMAN });
    const svg = el.querySelector('svg');
    expect(svg?.getAttribute('aria-label')).toContain('alemana');
  });

  it('role=img is set on the svg', () => {
    const el = setup({ unit: US_1ST });
    const svg = el.querySelector('svg');
    expect(svg?.getAttribute('role')).toBe('img');
  });
});
