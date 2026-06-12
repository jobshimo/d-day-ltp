import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, RouterLink, provideRouter } from '@angular/router';
import { Component, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { QuizComponent, QUIZ_PROGRESS_REPO } from './quiz.component';
import type { ProgressRepository } from 'domain-progress';
import type { QuizItem } from 'content-schema';
import { ALL_MODULES } from 'content';

// ---------------------------------------------------------------------------
// Fake ProgressRepository
// ---------------------------------------------------------------------------
const fakeRepo: ProgressRepository = {
  getModuleProgress: vi.fn().mockResolvedValue({
    moduleId: 'module-1',
    lessonsCompleted: [],
    drillResults: {},
  }),
  setLessonComplete: vi.fn().mockResolvedValue(undefined),
  setDrillResult: vi.fn().mockResolvedValue(undefined),
  setQuizResult: vi.fn().mockResolvedValue(undefined),
  isModuleUnlocked: vi.fn().mockResolvedValue(true),
  resetProgress: vi.fn().mockResolvedValue(undefined),
};

// ---------------------------------------------------------------------------
// Routing stubs
// ---------------------------------------------------------------------------
const mockActivatedRoute = {
  parent: {
    snapshot: { paramMap: { get: vi.fn().mockReturnValue('module-1') } },
  },
  snapshot: { paramMap: { get: vi.fn().mockReturnValue(null) } },
};

// ---------------------------------------------------------------------------
// No-op stubs for child components that use input.required()
// ---------------------------------------------------------------------------
@Component({ standalone: true, selector: 'app-breadcrumb', template: '' })
class BreadcrumbStub {
  @Input() items: any[] = [];
}

@Component({ standalone: true, selector: 'app-rule-ref-chip', template: '' })
class RuleRefChipStub {
  @Input() ruleRef: any = null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getModule1Quiz(): QuizItem[] {
  const mod = ALL_MODULES.find((m) => m.id === 'module-1');
  return mod?.reviewQuiz ?? [];
}

async function createQuizFixture(): Promise<{
  fixture: ComponentFixture<QuizComponent>;
  component: QuizComponent;
}> {
  const fixture = TestBed.createComponent(QuizComponent);
  const component = fixture.componentInstance;
  fixture.detectChanges();
  await fixture.whenStable();
  return { fixture, component };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('QuizComponent', () => {
  beforeEach(async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [QuizComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: QUIZ_PROGRESS_REPO, useValue: fakeRepo },
      ],
    })
    .overrideComponent(QuizComponent, {
      set: {
        imports: [RouterLink, BreadcrumbStub, RuleRefChipStub],
      },
    })
    .compileComponents();
  });

  it('shows progress indicator on first question', async () => {
    const { fixture } = await createQuizFixture();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Pregunta 1 de');
  });

  it('renders the first question text', async () => {
    const questions = getModule1Quiz();
    if (questions.length === 0) return;

    const { fixture } = await createQuizFixture();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain(questions[0].questionEs);
  });

  it('submit button is disabled when no choice selected', async () => {
    const { fixture } = await createQuizFixture();
    const btn: HTMLButtonElement | null = fixture.nativeElement.querySelector('button[aria-label="Comprobar respuesta"]');
    expect(btn).not.toBeNull();
    expect(btn!.disabled).toBe(true);
  });

  it('passes quiz when ≥70% correct (pass path)', async () => {
    const questions = getModule1Quiz();
    if (questions.length === 0) return;

    const { fixture, component } = await createQuizFixture();

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const correctChoice = q.choices?.find((c) => c.isCorrect);
      if (!correctChoice) continue;

      component.selectChoice(correctChoice.id);
      component.submitCurrentAnswer();
      fixture.detectChanges();
      await fixture.whenStable();

      component.advanceOrFinish();
      await fixture.whenStable(); // let async finishQuiz() complete on last question
      fixture.detectChanges();
      await fixture.whenStable();
    }

    // Extra stabilization pass after last advanceOrFinish triggers async finishQuiz
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.quizPassed()).toBe(true);
    expect(component.phase()).toBe('result');
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Módulo completado');
  });

  it('fails quiz when <70% correct and shows retry', async () => {
    const questions = getModule1Quiz();
    if (questions.length < 2) return;

    const { fixture, component } = await createQuizFixture();

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const wrongChoice = q.choices?.find((c) => !c.isCorrect);
      if (!wrongChoice) continue;

      component.selectChoice(wrongChoice.id);
      component.submitCurrentAnswer();
      fixture.detectChanges();
      await fixture.whenStable();

      component.advanceOrFinish();
      await fixture.whenStable(); // let async finishQuiz() complete on last question
      fixture.detectChanges();
      await fixture.whenStable();
    }

    // Extra stabilization pass after last advanceOrFinish triggers async finishQuiz
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.quizPassed()).toBe(false);
    expect(component.phase()).toBe('result');
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('No aprobado');
  });

  it('retry resets quiz state', async () => {
    const questions = getModule1Quiz();
    if (questions.length < 2) return;

    const { fixture, component } = await createQuizFixture();

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const wrongChoice = q.choices?.find((c) => !c.isCorrect);
      if (!wrongChoice) continue;

      component.selectChoice(wrongChoice.id);
      component.submitCurrentAnswer();
      fixture.detectChanges();
      await fixture.whenStable();

      component.advanceOrFinish();
      await fixture.whenStable();
      fixture.detectChanges();
      await fixture.whenStable();
    }

    // Extra stabilization pass after last advanceOrFinish triggers async finishQuiz
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.phase()).toBe('result');

    component.retryQuiz();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.phase()).toBe('answering');
    expect(component.currentIndex()).toBe(0);
    expect(component.answers()).toHaveLength(0);
  });
});
