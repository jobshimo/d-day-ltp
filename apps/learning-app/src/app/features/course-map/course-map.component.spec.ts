/**
 * ModuleCardComponent — lock/unlock logic tests.
 *
 * ModuleCardComponent uses @Input({ required: true }) mod with a WritableSignal
 * mirror (_mod) for JIT/AOT compatibility. Tests use ComponentRef.setInput()
 * which works reliably with @Input() decorator in JIT (TestBed) mode.
 */
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { ModuleCardComponent } from './module-card.component';
import type { ModuleListEntry } from 'application-course-store';

// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------
const UNLOCKED_MODULE: ModuleListEntry = {
  moduleId: 'module-1',
  order: 1,
  titleEs: 'El juego y sus piezas',
  descriptionEs: 'Introducción al juego.',
  isUnlocked: true,
  isPreview: false,
  completionPercent: 40,
};

const LOCKED_MODULE: ModuleListEntry = {
  moduleId: 'module-2',
  order: 2,
  titleEs: 'El desembarco',
  descriptionEs: 'Fase de desembarco.',
  isUnlocked: false,
  isPreview: false,
  completionPercent: 0,
};

const PREVIEW_MODULE: ModuleListEntry = {
  moduleId: 'module-4',
  order: 4,
  titleEs: 'Resolución de fuego',
  descriptionEs: 'Avance del módulo.',
  isUnlocked: false,
  isPreview: true,
  completionPercent: 0,
};

// ---------------------------------------------------------------------------
// Tests — each test creates a fresh fixture and sets `mod` via setInput()
// before detectChanges() so the component always has a value on first render.
// ---------------------------------------------------------------------------
describe('ModuleCardComponent — lock/unlock rendering', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuleCardComponent, RouterTestingModule],
    }).compileComponents();
  });

  it('unlocked module: renders <a> link, shows progress, has accessible label', () => {
    const fixture = TestBed.createComponent(ModuleCardComponent);
    fixture.componentRef.setInput('mod', UNLOCKED_MODULE);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelector('a.card')).not.toBeNull();
    expect(el.textContent).toContain('40%');
    expect(el.querySelector('[aria-label]')?.getAttribute('aria-label')).toContain('40%');
  });

  it('locked module: renders disabled <div>, shows lock message, aria-label says bloqueado', () => {
    const fixture = TestBed.createComponent(ModuleCardComponent);
    fixture.componentRef.setInput('mod', LOCKED_MODULE);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelector('a.card')).toBeNull();
    expect(el.querySelector('div.card--disabled')).not.toBeNull();
    expect(el.textContent).toContain('Completa el módulo anterior');
    expect(el.querySelector('[aria-label]')?.getAttribute('aria-label')).toContain('bloqueado');
  });

  it('preview module: renders <a> link, shows Avance badge', () => {
    const fixture = TestBed.createComponent(ModuleCardComponent);
    fixture.componentRef.setInput('mod', PREVIEW_MODULE);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelector('a.card')).not.toBeNull();
    expect(el.textContent).toContain('Avance');
    expect(el.querySelector('[aria-label]')?.getAttribute('aria-label')).toContain('Avance');
  });
});
