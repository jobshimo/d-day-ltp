import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';
import { PreparacionComponent } from './preparacion.component';
import { SETUP_GUIDE } from 'content';

// ---------------------------------------------------------------------------
// Tests
// Use NO_ERRORS_SCHEMA to skip real rendering of counter SVG in JSDOM.
// ---------------------------------------------------------------------------

describe('PreparacionComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreparacionComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  it('renders without errors', () => {
    const fixture = TestBed.createComponent(PreparacionComponent);
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('starts in learn mode', () => {
    const fixture = TestBed.createComponent(PreparacionComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.mode()).toBe('learn');
  });

  it('shows stepper section in learn mode and hides checklist', () => {
    const fixture = TestBed.createComponent(PreparacionComponent);
    fixture.detectChanges();
    const stepper = fixture.nativeElement.querySelector('.preparacion__stepper');
    const checklist = fixture.nativeElement.querySelector('.preparacion__checklist');
    expect(stepper).toBeTruthy();
    expect(checklist).toBeFalsy();
  });

  it('shows checklist section after switching to play mode', () => {
    const fixture = TestBed.createComponent(PreparacionComponent);
    fixture.detectChanges();

    fixture.componentInstance.setMode('play');
    fixture.detectChanges();

    const stepper = fixture.nativeElement.querySelector('.preparacion__stepper');
    const checklist = fixture.nativeElement.querySelector('.preparacion__checklist');
    expect(stepper).toBeFalsy();
    expect(checklist).toBeTruthy();
  });

  it('mode toggle buttons have aria-pressed reflecting current mode', () => {
    const fixture = TestBed.createComponent(PreparacionComponent);
    fixture.detectChanges();

    const [learnBtn, playBtn]: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('.mode-btn'),
    );

    expect(learnBtn.getAttribute('aria-pressed')).toBe('true');
    expect(playBtn.getAttribute('aria-pressed')).toBe('false');

    fixture.componentInstance.setMode('play');
    fixture.detectChanges();

    expect(learnBtn.getAttribute('aria-pressed')).toBe('false');
    expect(playBtn.getAttribute('aria-pressed')).toBe('true');
  });

  // ---- Stepper ----

  it('stepper starts at step 0', () => {
    const fixture = TestBed.createComponent(PreparacionComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.currentStepIndex()).toBe(0);
  });

  it('nextStep increments the step index', () => {
    const fixture = TestBed.createComponent(PreparacionComponent);
    fixture.detectChanges();

    fixture.componentInstance.nextStep();
    fixture.detectChanges();

    expect(fixture.componentInstance.currentStepIndex()).toBe(1);
  });

  it('prevStep decrements the step index', () => {
    const fixture = TestBed.createComponent(PreparacionComponent);
    fixture.detectChanges();

    fixture.componentInstance.nextStep();
    fixture.componentInstance.nextStep();
    fixture.componentInstance.prevStep();
    fixture.detectChanges();

    expect(fixture.componentInstance.currentStepIndex()).toBe(1);
  });

  it('prevStep does not go below 0', () => {
    const fixture = TestBed.createComponent(PreparacionComponent);
    fixture.detectChanges();

    fixture.componentInstance.prevStep();
    expect(fixture.componentInstance.currentStepIndex()).toBe(0);
  });

  it('nextStep does not exceed totalSteps - 1', () => {
    const fixture = TestBed.createComponent(PreparacionComponent);
    fixture.detectChanges();

    const total = fixture.componentInstance.totalSteps();
    for (let i = 0; i < total + 5; i++) {
      fixture.componentInstance.nextStep();
    }
    expect(fixture.componentInstance.currentStepIndex()).toBe(total - 1);
  });

  it('renders step label "Paso 1 de N" at start', () => {
    const fixture = TestBed.createComponent(PreparacionComponent);
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('.step-label');
    expect(label?.textContent?.trim()).toContain('Paso 1 de');
  });

  it('renders the correct number of progress dots', () => {
    const fixture = TestBed.createComponent(PreparacionComponent);
    fixture.detectChanges();

    const dots = fixture.nativeElement.querySelectorAll('.step-dot');
    expect(dots.length).toBe(fixture.componentInstance.totalSteps());
  });

  it('renders first step titleEs and bodyEs', () => {
    const fixture = TestBed.createComponent(PreparacionComponent);
    fixture.detectChanges();

    const firstStep = SETUP_GUIDE[0].steps[0];
    const title = fixture.nativeElement.querySelector('.step-title');
    const body = fixture.nativeElement.querySelector('.step-body');

    expect(title?.textContent?.trim()).toBe(firstStep.titleEs);
    expect(body?.textContent?.trim()).toBe(firstStep.bodyEs);
  });

  // ---- Checklist ----

  it('renders all 5 group headings in play mode', () => {
    const fixture = TestBed.createComponent(PreparacionComponent);
    fixture.componentInstance.setMode('play');
    fixture.detectChanges();

    const headings = fixture.nativeElement.querySelectorAll('.checklist__group-title');
    expect(headings.length).toBe(SETUP_GUIDE.length);
  });

  it('renders one checkbox per step in play mode', () => {
    const fixture = TestBed.createComponent(PreparacionComponent);
    fixture.componentInstance.setMode('play');
    fixture.detectChanges();

    const checkboxes = fixture.nativeElement.querySelectorAll('.checklist__checkbox');
    const totalSteps = SETUP_GUIDE.reduce((sum, g) => sum + g.steps.length, 0);
    expect(checkboxes.length).toBe(totalSteps);
  });

  it('starts with no checked steps', () => {
    const fixture = TestBed.createComponent(PreparacionComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.checkedCount()).toBe(0);
  });

  it('toggleStep checks and unchecks a step', () => {
    const fixture = TestBed.createComponent(PreparacionComponent);
    fixture.detectChanges();

    const stepId = SETUP_GUIDE[0].steps[0].id;

    fixture.componentInstance.toggleStep(stepId);
    expect(fixture.componentInstance.isChecked(stepId)).toBe(true);
    expect(fixture.componentInstance.checkedCount()).toBe(1);

    fixture.componentInstance.toggleStep(stepId);
    expect(fixture.componentInstance.isChecked(stepId)).toBe(false);
    expect(fixture.componentInstance.checkedCount()).toBe(0);
  });

  it('resetChecklist clears all checked steps', () => {
    const fixture = TestBed.createComponent(PreparacionComponent);
    fixture.detectChanges();

    SETUP_GUIDE[0].steps.forEach((s) => fixture.componentInstance.toggleStep(s.id));
    expect(fixture.componentInstance.checkedCount()).toBeGreaterThan(0);

    fixture.componentInstance.resetChecklist();
    expect(fixture.componentInstance.checkedCount()).toBe(0);
  });

  it('checkedCount reflects correct count after toggling multiple steps', () => {
    const fixture = TestBed.createComponent(PreparacionComponent);
    fixture.detectChanges();

    const ids = SETUP_GUIDE.flatMap((g) => g.steps.map((s) => s.id)).slice(0, 3);
    ids.forEach((id) => fixture.componentInstance.toggleStep(id));
    expect(fixture.componentInstance.checkedCount()).toBe(3);
  });

  it('header has h1 with preparacion title', () => {
    const fixture = TestBed.createComponent(PreparacionComponent);
    fixture.detectChanges();
    const h1 = fixture.nativeElement.querySelector('h1.preparacion__title');
    expect(h1?.textContent?.trim()).toBeTruthy();
  });
});
