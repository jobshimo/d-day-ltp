import {
  ApplicationConfig,
  provideZonelessChangeDetection,
  InjectionToken,
  inject,
  provideAppInitializer,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { appRoutes } from './app.routes';
import { IdbProgressRepository } from 'infrastructure-idb-adapter';
import { HttpProgressRepository } from 'infrastructure-http-progress-adapter';
import { HtmlAudioNarrationPlayer } from 'infrastructure-audio-adapter';
import { PROGRESS_REPO_TOKEN_ID } from 'domain-progress';
import type { ProgressRepository } from 'domain-progress';
import { NARRATION_PLAYER } from 'domain-narration';
import { ALL_MODULES, applyPatches } from 'content';
import { COURSE_CONTENT, COURSE_PROGRESS_REPO } from 'application-course-store';
import { DRILL_PROGRESS_REPO } from 'application-drill-store';
import {
  SessionStore,
  AUTH_PORT,
  AuthAdapter,
} from 'application-session-store';
import { authInterceptor } from './shared/auth.interceptor';
import { MODULE_PROGRESS_REPO } from './features/lesson/module-home.component';
import { LESSON_PROGRESS_REPO } from './features/lesson/lesson-viewer.component';
import { GUARD_PROGRESS_REPO } from './features/drill/drill-sequence.guard';
import { QUIZ_PROGRESS_REPO } from './features/quiz/quiz.component';
import { SETTINGS_PROGRESS_REPO } from './features/settings/settings.component';

/**
 * Root DI token for ProgressRepository.
 * At bootstrap, the factory (selectProgressRepo) checks sessionStorage for a
 * JWT token. If present, the HTTP adapter is provided; otherwise the IDB adapter
 * is provided for guest mode. All 7 useExisting consumer tokens follow the swap.
 */
export const PROGRESS_REPO = new InjectionToken<ProgressRepository>(PROGRESS_REPO_TOKEN_ID);

/**
 * Pure helper that decides which ProgressRepository class to use at bootstrap.
 * Reads sessionStorage directly (same read as SessionStore.hydrateFromStorage).
 * Exported for unit testing.
 *
 * @param hasToken - true if a JWT is present in sessionStorage at bootstrap time
 * @returns the concrete ProgressRepository class to instantiate
 */
export function selectProgressRepo(hasToken: boolean): typeof IdbProgressRepository | typeof HttpProgressRepository {
  return hasToken ? HttpProgressRepository : IdbProgressRepository;
}

/**
 * Checks sessionStorage safely (SSR-compatible guard) and returns true if
 * a JWT token is present at the moment app.config is evaluated.
 */
function detectToken(): boolean {
  try {
    return typeof sessionStorage !== 'undefined' && !!sessionStorage.getItem('auth_token');
  } catch {
    return false;
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    // Zoneless Angular — no zone.js
    provideZonelessChangeDetection(),

    // Router with component input binding (route params → @Input)
    provideRouter(appRoutes, withComponentInputBinding()),

    // HTTP client with auth interceptor
    provideHttpClient(withInterceptors([authInterceptor])),

    // Course content: apply errata patches before serving (one patch per module)
    {
      provide: COURSE_CONTENT,
      useValue: ALL_MODULES.map((m) => applyPatches(m)),
    },

    // Session store at root scope — manages JWT + auth status
    SessionStore,

    // Auth port → HTTP adapter
    {
      provide: AUTH_PORT,
      useClass: AuthAdapter,
    },

    // Hydrate session state from sessionStorage before first paint.
    provideAppInitializer(() => {
      inject(SessionStore).hydrateFromStorage();
    }),

    // Adapter switch (Slice D): read auth_token from sessionStorage at bootstrap.
    // If a token exists → HttpProgressRepository (authenticated user).
    // If not           → IdbProgressRepository (guest mode).
    // After login/logout the app does window.location.href='/' so this runs fresh.
    {
      provide: PROGRESS_REPO,
      useClass: selectProgressRepo(detectToken()),
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
