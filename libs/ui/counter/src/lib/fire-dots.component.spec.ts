import { describe, it, expect } from 'vitest';
import { Component, Input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { FireDotIntensity } from 'content-schema';
import { FireDotsComponent } from './fire-dots.component';

@Component({
  standalone: true,
  imports: [FireDotsComponent],
  template: `<svg><ddob-fire-dots [dots]="dots" /></svg>`,
})
class HostComponent {
  @Input() dots: FireDotIntensity[] = [];
}

function setup(dots: FireDotIntensity[]) {
  const fixture = TestBed.createComponent(HostComponent);
  fixture.componentRef.setInput('dots', dots);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('FireDotsComponent', () => {
  it('renders N dots matching the input array length', () => {
    const el = setup(['intense', 'steady', 'sporadic']);
    const groups = el.querySelectorAll('ddob-fire-dots g');
    expect(groups.length).toBe(3);
  });

  it('renders zero dots when input is empty', () => {
    const el = setup([]);
    const groups = el.querySelectorAll('ddob-fire-dots g');
    expect(groups.length).toBe(0);
  });

  it('intense dot has a white ring (inner circle with stroke)', () => {
    const el = setup(['intense']);
    const circles = el.querySelectorAll('ddob-fire-dots g circle');
    // First circle is the filled background, second is the white ring
    const whiteRingCandidates = Array.from(circles).filter(
      (c) => c.getAttribute('fill') === 'none' && c.getAttribute('stroke') === '#ffffff',
    );
    expect(whiteRingCandidates.length).toBeGreaterThan(0);
  });

  it('steady dot has a white center fill (not a ring)', () => {
    const el = setup(['steady']);
    const circles = el.querySelectorAll('ddob-fire-dots g circle');
    // Steady has a white filled small circle (no stroke ring style)
    const whiteFilled = Array.from(circles).filter(
      (c) => c.getAttribute('fill') === '#ffffff',
    );
    expect(whiteFilled.length).toBeGreaterThan(0);
  });

  it('sporadic dot has a dashed ring (stroke-dasharray present)', () => {
    const el = setup(['sporadic']);
    const circles = el.querySelectorAll('ddob-fire-dots g circle');
    const dashedRing = Array.from(circles).find(
      (c) => c.getAttribute('stroke-dasharray') !== null,
    );
    expect(dashedRing).toBeDefined();
  });

  it('intense marker is visually distinct from sporadic (different inner marker)', () => {
    const intenseEl = setup(['intense']);
    const sporadicEl = setup(['sporadic']);

    const intenseHasRing = intenseEl.querySelector(
      'ddob-fire-dots g circle[stroke="#ffffff"][fill="none"]',
    );
    const sporadicHasDash = sporadicEl.querySelector(
      'ddob-fire-dots g circle[stroke-dasharray]',
    );

    expect(intenseHasRing).toBeTruthy();
    expect(sporadicHasDash).toBeTruthy();
    // They must not be the same marker type
    expect(intenseHasRing?.getAttribute('stroke-dasharray')).toBeNull();
  });

  it('steady marker is distinct from sporadic (filled center vs dashed ring)', () => {
    const steadyEl = setup(['steady']);
    const sporadicEl = setup(['sporadic']);

    const steadyWhiteFill = steadyEl.querySelector('ddob-fire-dots g circle[fill="#ffffff"]');
    const sporadicDash = sporadicEl.querySelector('ddob-fire-dots g circle[stroke-dasharray]');

    expect(steadyWhiteFill).toBeTruthy();
    expect(sporadicDash).toBeTruthy();
  });
});
