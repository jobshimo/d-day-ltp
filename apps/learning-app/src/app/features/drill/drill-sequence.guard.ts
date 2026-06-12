import { inject, Injectable, InjectionToken } from '@angular/core';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { ALL_MODULES } from 'content';
import { PROGRESS_REPO_TOKEN_ID } from 'domain-progress';
import type { ProgressRepository } from 'domain-progress';

export const GUARD_PROGRESS_REPO = new InjectionToken<ProgressRepository>(
  PROGRESS_REPO_TOKEN_ID,
);

/**
 * DrillSequenceGuard — enforces that the user cannot access the quiz
 * until all drills in the module are completed, and redirects to the
 * first unanswered drill otherwise (REQ-DRL-05).
 */
@Injectable({ providedIn: 'root' })
export class DrillSequenceGuard {
  private readonly progressRepo = inject<ProgressRepository>(GUARD_PROGRESS_REPO);
  private readonly router = inject(Router);

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean | UrlTree> {
    const moduleId = route.parent?.paramMap.get('moduleId') ?? '';

    if (!moduleId) {
      return this.router.createUrlTree(['/modules']);
    }

    const mod = ALL_MODULES.find((m) => m.id === moduleId);
    if (!mod) {
      return this.router.createUrlTree(['/modules']);
    }

    // If no drills at all, allow through
    if (mod.drills.length === 0) {
      return true;
    }

    try {
      const progress = await this.progressRepo.getModuleProgress(moduleId);
      const completedDrillIds = new Set(Object.keys(progress.drillResults));

      // Find first unanswered drill
      const firstUnansweredIndex = mod.drills.findIndex(
        (drill) => !completedDrillIds.has(drill.id),
      );

      if (firstUnansweredIndex === -1) {
        // All drills completed — allow through to quiz
        return true;
      }

      // Redirect to the first unanswered drill
      // V1 ACCEPTED LIMITATION: quiz-route detection uses URL-string inspection
      // (`url.includes('/quiz')`) rather than route data or config-driven metadata.
      // A cleaner approach would be to attach `{ isQuizRoute: true }` to the quiz
      // route's `data` property and read `route.data['isQuizRoute']` here.
      // That refactor is deferred to v2 when additional guard complexity justifies it.
      const url = this.router.getCurrentNavigation()?.finalUrl?.toString() ?? '';
      const isQuizRoute = url.includes('/quiz');
      const drillIndexParam = route.paramMap.get('drillIndex');
      const requestedIndex = drillIndexParam !== null ? parseInt(drillIndexParam, 10) : -1;

      if (isQuizRoute || requestedIndex > firstUnansweredIndex) {
        return this.router.createUrlTree([
          '/modules',
          moduleId,
          'drills',
          firstUnansweredIndex,
        ]);
      }

      return true;
    } catch {
      return true; // On error, allow through (progress service unavailable)
    }
  }
}
