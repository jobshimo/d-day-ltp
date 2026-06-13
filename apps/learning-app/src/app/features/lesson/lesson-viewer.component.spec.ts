import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Component,
  ChangeDetectionStrategy,
  input,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { LessonViewerComponent, LESSON_PROGRESS_REPO } from './lesson-viewer.component';
import { NarrationStore } from 'application-narration-store';
import { NARRATION_PLAYER } from 'domain-narration';
import type { Lesson } from 'content-schema';
import type { ProgressRepository } from 'domain-progress';
import type { BreadcrumbItem } from '../../shared/breadcrumb.component';
import { BreadcrumbComponent } from '../../shared/breadcrumb.component';

// ---- Stubs ----

const noopNarrationPlayer = {
  play: async () => {},
  pause: () => {},
  stop: () => {},
};

const noopProgressRepo: ProgressRepository = {
  getModuleProgress: async () => ({
    moduleId: 'module-1',
    lessonsCompleted: [],
    drillResults: [],
    quizResult: null,
  }),
  setLessonComplete: async () => {},
  setDrillResult: async () => {},
  setQuizResult: async () => {},
  isModuleUnlocked: async () => true,
  resetProgress: async () => {},
};

/**
 * Stub BreadcrumbComponent — same selector and input signature as the real one,
 * but renders nothing. This avoids NG0950 errors from signal input.required()
 * during TestBed initialization.
 */
@Component({
  standalone: true,
  selector: 'app-breadcrumb',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
})
class BreadcrumbStubComponent {
  readonly items = input.required<BreadcrumbItem[]>();
}

/** Lesson fixture with a 'counter' block */
const COUNTER_LESSON: Lesson = {
  id: 'lesson-1-2',
  moduleId: 'module-1',
  order: 2,
  titleEs: 'Componentes del juego',
  blocks: [
    {
      type: 'counter',
      content: 'Anatomía de una ficha',
      altText: 'Ficha A/116, 29.ª División',
      counterConfig: {
        unit: {
          kind: 'us',
          id: 'A-116',
          type: 'infantry',
          steps: 3,
          targetSymbol: 'circle',
          weapons: ['BZ'],
          attackStrength: 3,
          isDisrupted: false,
          hexId: null,
        },
        side: 'front',
        annotated: true,
      },
    },
  ],
};

/** Lesson with no counter blocks — regression baseline */
const PROSE_LESSON: Lesson = {
  id: 'lesson-1-1',
  moduleId: 'module-1',
  order: 1,
  titleEs: 'Introducción',
  blocks: [
    { type: 'prose', content: 'Texto de prueba.' },
    { type: 'svg-snippet', content: 'assets/svg/test.svg', altText: 'Imagen de prueba' },
  ],
};

function buildRouteMock() {
  const paramMapMock = { get: vi.fn().mockReturnValue(null) };
  return {
    paramMap: of(paramMapMock),
    snapshot: { paramMap: paramMapMock },
    parent: {
      snapshot: { paramMap: { get: vi.fn().mockReturnValue(null) } },
    },
  };
}

describe('LessonViewerComponent — counter block rendering', () => {
  let fixture: ComponentFixture<LessonViewerComponent>;
  let component: LessonViewerComponent;

  function getEl<T extends Element>(selector: string): T | null {
    return fixture.nativeElement.querySelector(selector) as T | null;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonViewerComponent, RouterModule.forRoot([])],
      providers: [
        { provide: ActivatedRoute, useValue: buildRouteMock() },
        { provide: Router, useValue: { navigate: vi.fn() } },
        { provide: NARRATION_PLAYER, useValue: noopNarrationPlayer },
        { provide: LESSON_PROGRESS_REPO, useValue: noopProgressRepo },
        NarrationStore,
      ],
    })
    // Override BreadcrumbComponent with a stub that has the same signal input signature.
    // This prevents NG0950 from the real BreadcrumbComponent's input.required() during
    // the TestBed initialization cycle.
    .overrideComponent(LessonViewerComponent, {
      remove: { imports: [BreadcrumbComponent] },
      add: { imports: [BreadcrumbStubComponent] },
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonViewerComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  /**
   * S2-T6 core: the @case('counter') template path renders <ddob-counter>.
   * We set `lesson` directly (public WritableSignal) to bypass route/content resolution.
   */
  it('renders ddob-counter when the lesson has a counter block', async () => {
    component.lesson.set(COUNTER_LESSON);
    component.moduleId.set('module-1');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const counter = getEl('ddob-counter');
    expect(counter).toBeTruthy();
  });

  it('wraps the counter block in a .lesson-block--counter figure', async () => {
    component.lesson.set(COUNTER_LESSON);
    component.moduleId.set('module-1');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const figure = getEl('.lesson-block--counter');
    expect(figure).toBeTruthy();
    expect(figure?.tagName.toLowerCase()).toBe('figure');
  });

  it('renders figcaption with block.altText for the counter block', async () => {
    component.lesson.set(COUNTER_LESSON);
    component.moduleId.set('module-1');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const caption = getEl('.lesson-block--counter figcaption');
    expect(caption?.textContent?.trim()).toBe('Ficha A/116, 29.ª División');
  });

  it('does NOT render ddob-counter for prose and svg-snippet blocks', async () => {
    component.lesson.set(PROSE_LESSON);
    component.moduleId.set('module-1');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const counter = getEl('ddob-counter');
    expect(counter).toBeNull();
  });

  it('shows .lesson-viewer__not-found when lesson() is null', () => {
    // lesson starts as null — just detect without setting it
    fixture.detectChanges();

    const notFound = getEl('.lesson-viewer__not-found');
    expect(notFound).toBeTruthy();
  });
});
