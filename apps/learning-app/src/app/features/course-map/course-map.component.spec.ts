/**
 * ModuleCardComponent — free-navigation rendering tests.
 *
 * ModuleCardComponent uses @Input({ required: true }) mod with a WritableSignal
 * mirror for JIT/AOT compatibility. Tests use ComponentRef.setInput()
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
const MODULE_IN_PROGRESS: ModuleListEntry = {
  moduleId: 'module-1',
  order: 1,
  titleEs: 'El juego y sus piezas',
  descriptionEs: 'Introducción al juego.',
  isUnlocked: true,
  isPreview: false,
  completionPercent: 40,
};

const MODULE_AT_ZERO: ModuleListEntry = {
  moduleId: 'module-2',
  order: 2,
  titleEs: 'El desembarco',
  descriptionEs: 'Fase de desembarco.',
  isUnlocked: true,
  isPreview: false,
  completionPercent: 0,
};

const MODULE_COMPLETE: ModuleListEntry = {
  moduleId: 'module-3',
  order: 3,
  titleEs: 'Fuego alemán',
  descriptionEs: 'Fuego alemán.',
  isUnlocked: true,
  isPreview: false,
  completionPercent: 100,
};

// ---------------------------------------------------------------------------
// Tests — each test creates a fresh fixture and sets `mod` via setInput()
// before detectChanges() so the component always has a value on first render.
// ---------------------------------------------------------------------------
describe('ModuleCardComponent — free-navigation rendering', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuleCardComponent, RouterTestingModule],
    }).compileComponents();
  });

  it('renders <a> link for every module (free navigation)', () => {
    const fixture = TestBed.createComponent(ModuleCardComponent);
    fixture.componentRef.setInput('mod', MODULE_AT_ZERO);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelector('a.card')).not.toBeNull();
    expect(el.querySelector('div.card--disabled')).toBeNull();
  });

  it('module in progress: shows progress bar and percentage', () => {
    const fixture = TestBed.createComponent(ModuleCardComponent);
    fixture.componentRef.setInput('mod', MODULE_IN_PROGRESS);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelector('a.card')).not.toBeNull();
    expect(el.textContent).toContain('40%');
    expect(el.querySelector('[aria-label]')?.getAttribute('aria-label')).toContain('40%');
  });

  it('completed module: shows checkmark icon', () => {
    const fixture = TestBed.createComponent(ModuleCardComponent);
    fixture.componentRef.setInput('mod', MODULE_COMPLETE);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;

    expect(el.textContent).toContain('✓');
    expect(el.textContent).toContain('100%');
  });

  it('no module has card--disabled class or locked copy under default progress', () => {
    const fixture = TestBed.createComponent(ModuleCardComponent);
    fixture.componentRef.setInput('mod', MODULE_AT_ZERO);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelector('.card--disabled')).toBeNull();
    expect(el.textContent).not.toContain('Completa el módulo anterior');
    expect(el.textContent).not.toContain('Avance');
  });
});
