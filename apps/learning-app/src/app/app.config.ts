import {
  ApplicationConfig,
  provideZonelessChangeDetection,
  InjectionToken,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { appRoutes } from './app.routes';
import { IdbProgressRepository } from 'infrastructure-idb-adapter';
import { HtmlAudioNarrationPlayer } from 'infrastructure-audio-adapter';
import { PROGRESS_REPO_TOKEN_ID } from 'domain-progress';
import type { ProgressRepository } from 'domain-progress';
import { NARRATION_PLAYER } from 'domain-narration';
import { ALL_MODULES, applyPatches } from 'content';
import { COURSE_CONTENT, COURSE_PROGRESS_REPO } from 'application-course-store';
import { DRILL_PROGRESS_REPO } from 'application-drill-store';
import { MODULE_PROGRESS_REPO } from './features/lesson/module-home.component';
import { LESSON_PROGRESS_REPO } from './features/lesson/lesson-viewer.component';
import { GUARD_PROGRESS_REPO } from './features/drill/drill-sequence.guard';
import { QUIZ_PROGRESS_REPO } from './features/quiz/quiz.component';
import { SETTINGS_PROGRESS_REPO } from './features/settings/settings.component';

/**
 * Root DI token for ProgressRepository — wires the IDB adapter to the port.
 * Both CourseStore and DrillStore receive the same adapter instance via
 * COURSE_PROGRESS_REPO and DRILL_PROGRESS_REPO respectively.
 */
export const PROGRESS_REPO = new InjectionToken<ProgressRepository>(PROGRESS_REPO_TOKEN_ID);

export const appConfig: ApplicationConfig = {
  providers: [
    // Zoneless Angular — no zone.js
    provideZonelessChangeDetection(),

    // Router with component input binding (route params → @Input)
    provideRouter(appRoutes, withComponentInputBinding()),

    // Course content: apply errata patches before serving (one patch per module)
    {
      provide: COURSE_CONTENT,
      useValue: ALL_MODULES.map((m) => applyPatches(m)),
    },

    // IndexedDB progress adapter (singleton via the root token)
    {
      provide: PROGRESS_REPO,
      useClass: IdbProgressRepository,
    },

    // Narration player: bind HTML5 Audio adapter to the domain port
    {
      provide: NARRATION_PLAYER,
      useClass: HtmlAudioNarrationPlayer,
    },

    // Wire the same adapter instance to both store tokens
    {
      provide: COURSE_PROGRESS_REPO,
      useExisting: PROGRESS_REPO,
    },
    {
      provide: DRILL_PROGRESS_REPO,
      useExisting: PROGRESS_REPO,
    },
    {
      provide: MODULE_PROGRESS_REPO,
      useExisting: PROGRESS_REPO,
    },
    {
      provide: LESSON_PROGRESS_REPO,
      useExisting: PROGRESS_REPO,
    },
    {
      provide: GUARD_PROGRESS_REPO,
      useExisting: PROGRESS_REPO,
    },
    {
      provide: QUIZ_PROGRESS_REPO,
      useExisting: PROGRESS_REPO,
    },
    {
      provide: SETTINGS_PROGRESS_REPO,
      useExisting: PROGRESS_REPO,
    },
  ],
};
