import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { SessionStore } from 'application-session-store';

/**
 * Guest-only guard — redirects already-authenticated users away from
 * /login and /register to the modules page.
 *
 * The course is always playable as a guest (no authGuard on gameplay routes).
 */
export const guestOnlyGuard: CanActivateFn = () => {
  const store = inject(SessionStore);
  const router = inject(Router);

  if (store.isAuthenticated()) {
    void router.navigateByUrl('/modules');
    return false;
  }

  return true;
};
