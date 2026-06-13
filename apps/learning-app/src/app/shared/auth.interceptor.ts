import { inject } from '@angular/core';
import type { HttpInterceptorFn } from '@angular/common/http';
import { HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { SessionStore } from 'application-session-store';

/**
 * Auth interceptor — functional HttpInterceptorFn.
 *
 * - Attaches Authorization: Bearer <token> to any request targeting /api.
 * - On 401 response, calls SessionStore.logout() and redirects to /login.
 *
 * RxJS usage is intentional here: interceptors are Observable-based by
 * Angular contract. No RxJS leaks into stores or adapters.
 */
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const store = inject(SessionStore);
  const router = inject(Router);

  // Only attach auth header to /api requests
  const isApiRequest = req.url.startsWith('/api');

  let authReq = req;
  if (isApiRequest) {
    const token = store.token() ?? sessionStorage.getItem('auth_token');
    if (token) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }
  }

  return next(authReq).pipe(
    catchError((err) => {
      if (err instanceof HttpErrorResponse && err.status === 401 && isApiRequest) {
        store.logout();
        void router.navigateByUrl('/login');
      }
      return throwError(() => err);
    }),
  );
};
