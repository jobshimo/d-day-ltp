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

  // --- Steps: vertical dot column to the LEFT of the unit symbol ---

  it('renders step dots as filled circles (cx=9) for US unit', () => {
    const el = setup({ unit: US_1ST });
    // Step dots are circles with cx="9" in the 60x60 viewBox space
    const stepCircles = Array.from(el.querySelectorAll('circle')).filter(
      (c) => c.getAttribute('cx') === '9',
    );
    // US_1ST has steps=3 → 3 dots
    expect(stepCircles.length).toBe(3);
  });

  it('renders the correct number of step dots for unit.steps', () => {
    const el = setup({ unit: US_29TH }); // steps=2
    const stepCircles = Array.from(el.querySelectorAll('circle')).filter(
      (c) => c.getAttribute('cx') === '9',
    );
    expect(stepCircles.length).toBe(2);
  });

  // --- Attack strength: BOTTOM-RIGHT, large bold ---

  it('attack strength text is bottom-right (x=55, text-anchor=end)', () => {
    const el = setup({ unit: US_1ST });
    const strengthEl = Array.from(el.querySelectorAll('text')).find(
      (t) => t.textContent?.trim() === '3',
    );
    expect(strengthEl).toBeTruthy();
    expect(strengthEl?.getAttribute('x')).toBe('55');
    expect(strengthEl?.getAttribute('text-anchor')).toBe('end');
  });

  it('attack strength is rendered with large font-size (20)', () => {
    const el = setup({ unit: US_1ST });
    const strengthEl = Array.from(el.querySelectorAll('text')).find(
      (t) => t.textContent?.trim() === '3',
    );
    expect(strengthEl?.getAttribute('font-size')).toBe('20');
  });

  // --- Target symbol: BOTTOM-LEFT ---

  it('target symbol is positioned bottom-left (cx=10, cy=52)', () => {
    const el = setup({ unit: US_1ST });
    // The target symbol component renders a <circle> for 'circle' targetSymbol
    const circles = Array.from(el.querySelectorAll('circle')).filter(
      (c) => c.getAttribute('cx') === '10' && c.getAttribute('cy') === '52',
    );
    expect(circles.length).toBeGreaterThan(0);
  });

  // --- compact variant ---

  it('compact variant does not render strength text', () => {
    const el = setup({ unit: US_1ST, variant: 'compact' });
    const texts = Array.from(el.querySelectorAll('text'));
    // Compact mode: no large strength text rendered (font-size 20)
    const strengthText = texts.find((t) => t.getAttribute('font-size') === '20');
    expect(strengthText).toBeUndefined();
  });

  it('compact variant does not render step dots', () => {
    const el = setup({ unit: US_1ST, variant: 'compact' });
    // Step dots are circles with cx="9"
    const stepCircles = Array.from(el.querySelectorAll('circle')).filter(
      (c) => c.getAttribute('cx') === '9',
    );
    expect(stepCircles.length).toBe(0);
  });

  // --- Division fills ---

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

  // --- German units ---

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

  // --- Misc ---

  it('role=img is set on the svg', () => {
    const el = setup({ unit: US_1ST });
    const svg = el.querySelector('svg');
    expect(svg?.getAttribute('role')).toBe('img');
  });

  // --- Annotated callout labels ---

  it('annotated mode renders "Designación" label', () => {
    const el = setup({ unit: US_1ST, annotated: true });
    const texts = Array.from(el.querySelectorAll('text'));
    const label = texts.find((t) => t.textContent?.includes('Designación'));
    expect(label).toBeTruthy();
  });

  it('annotated mode renders "Escalones" label', () => {
    const el = setup({ unit: US_1ST, annotated: true });
    const texts = Array.from(el.querySelectorAll('text'));
    const label = texts.find((t) => t.textContent?.includes('Escalones'));
    expect(label).toBeTruthy();
  });

  it('annotated mode renders "Fuerza de ataque" label', () => {
    const el = setup({ unit: US_1ST, annotated: true });
    const texts = Array.from(el.querySelectorAll('text'));
    const label = texts.find((t) => t.textContent?.includes('Fuerza de ataque'));
    expect(label).toBeTruthy();
  });

  it('annotated mode renders "Símbolo de objetivo" label', () => {
    const el = setup({ unit: US_1ST, annotated: true });
    const texts = Array.from(el.querySelectorAll('text'));
    const label = texts.find((t) => t.textContent?.includes('Símbolo de objetivo'));
    expect(label).toBeTruthy();
  });

  it('annotated mode renders "Tipo de unidad" label', () => {
    const el = setup({ unit: US_1ST, annotated: true });
    const texts = Array.from(el.querySelectorAll('text'));
    const label = texts.find((t) => t.textContent?.includes('Tipo de unidad'));
    expect(label).toBeTruthy();
  });

  it('annotated mode renders "Turno de llegada" label when arrivalTurn is present', () => {
    const el = setup({ unit: US_1ST, annotated: true }); // US_1ST has arrivalTurn=1
    const texts = Array.from(el.querySelectorAll('text'));
    const label = texts.find((t) => t.textContent?.includes('Turno de llegada'));
    expect(label).toBeTruthy();
  });

  it('annotated mode renders "Caja de desembarco" label when beachLandingBox is present', () => {
    const el = setup({ unit: US_1ST, annotated: true }); // US_1ST has beachLandingBox='DW1'
    const texts = Array.from(el.querySelectorAll('text'));
    const label = texts.find((t) => t.textContent?.includes('Caja de desembarco'));
    expect(label).toBeTruthy();
  });
});
