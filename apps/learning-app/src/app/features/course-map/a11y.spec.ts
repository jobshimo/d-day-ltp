/**
 * Accessibility audit — ModuleCardComponent
 *
 * Uses axe-core to detect WCAG 2.1 AA violations in the rendered
 * module card for each state: unlocked, locked, and preview.
 */
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import axe from 'axe-core';
import { ModuleCardComponent } from './module-card.component';
import type { ModuleListEntry } from 'application-course-store';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------
const UNLOCKED: ModuleListEntry = {
  moduleId: 'module-1',
  order: 1,
  titleEs: 'El juego y sus piezas',
  descriptionEs: 'Introducción al juego.',
  isUnlocked: true,
  isPreview: false,
  completionPercent: 40,
};

const LOCKED: ModuleListEntry = {
  moduleId: 'module-2',
  order: 2,
  titleEs: 'El desembarco',
  descriptionEs: 'Fase de desembarco.',
  isUnlocked: false,
  isPreview: false,
  completionPercent: 0,
};

const PREVIEW: ModuleListEntry = {
  moduleId: 'module-4',
  order: 4,
  titleEs: 'Resolución de fuego',
  descriptionEs: 'Avance del módulo.',
  isUnlocked: false,
  isPreview: true,
  completionPercent: 0,
};

// ---------------------------------------------------------------------------
// Helper: run axe against the rendered element and return violations
// ---------------------------------------------------------------------------
async function runAxe(el: HTMLElement) {
  const result = await axe.run(el, {
    runOnly: {
      type: 'tag',
      // Target WCAG 2.1 Level A and AA
      values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
    },
  });
  return result.violations;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('ModuleCardComponent — WCAG 2.1 AA accessibility', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuleCardComponent, RouterTestingModule],
    }).compileComponents();
  });

  it('unlocked card: no WCAG 2.1 AA violations', async () => {
    const fixture = TestBed.createComponent(ModuleCardComponent);
    fixture.componentRef.setInput('mod', UNLOCKED);
    fixture.detectChanges();

    const violations = await runAxe(fixture.nativeElement);
    if (violations.length) {
      const details = violations
        .map((v) => `[${v.id}] ${v.description}\n  Impact: ${v.impact}\n  Nodes: ${v.nodes.map((n) => n.html).join(', ')}`)
        .join('\n');
      throw new Error(`axe violations found:\n${details}`);
    }
    expect(violations).toHaveLength(0);
  });

  it('locked card: no WCAG 2.1 AA violations', async () => {
    const fixture = TestBed.createComponent(ModuleCardComponent);
    fixture.componentRef.setInput('mod', LOCKED);
    fixture.detectChanges();

    const violations = await runAxe(fixture.nativeElement);
    if (violations.length) {
      const details = violations
        .map((v) => `[${v.id}] ${v.description}\n  Impact: ${v.impact}\n  Nodes: ${v.nodes.map((n) => n.html).join(', ')}`)
        .join('\n');
      throw new Error(`axe violations found:\n${details}`);
    }
    expect(violations).toHaveLength(0);
  });

  it('preview card: no WCAG 2.1 AA violations', async () => {
    const fixture = TestBed.createComponent(ModuleCardComponent);
    fixture.componentRef.setInput('mod', PREVIEW);
    fixture.detectChanges();

    const violations = await runAxe(fixture.nativeElement);
    if (violations.length) {
      const details = violations
        .map((v) => `[${v.id}] ${v.description}\n  Impact: ${v.impact}\n  Nodes: ${v.nodes.map((n) => n.html).join(', ')}`)
        .join('\n');
      throw new Error(`axe violations found:\n${details}`);
    }
    expect(violations).toHaveLength(0);
  });
});
