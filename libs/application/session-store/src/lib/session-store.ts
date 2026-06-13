import { Injectable, Inject } from '@angular/core';
import type { Signal } from '@angular/core';
import { SignalStore } from 'application-course-store';
import { AUTH_PORT } from './auth.port';
import type { AuthPort } from './auth.port';

/** Session storage keys */
const TOKEN_KEY = 'auth_token';
const EMAIL_KEY = 'auth_email';

/** Possible session status values */
export type SessionStatus = 'anonymous' | 'authenticated';

/** State slice managed by SessionStore */
export interface SessionState {
  token: string | null;
  email: string | null;
  status: SessionStatus;
}

const INITIAL_STATE: SessionState = {
  token: null,
  email: null,
  status: 'anonymous',
};

/**
 * SessionStore — manages the user session (token + email + status).
 *
 * Owns all sessionStorage reads/writes for the session lifecycle.
 * The HTTP adapter is pure HTTP — no storage side effects there.
 */
@Injectable()
export class SessionStore extends SignalStore<SessionState> {
  // ---- Public selectors ----

  readonly token: Signal<string | null> = this.select((s) => s.token);
  readonly email: Signal<string | null> = this.select((s) => s.email);
  readonly status: Signal<SessionStatus> = this.select((s) => s.status);
  readonly isAuthenticated: Signal<boolean> = this.select(
    (s) => s.status === 'authenticated',
  );

  constructor(@Inject(AUTH_PORT) private readonly authPort: AuthPort) {
    super(INITIAL_STATE);
  }

  // ---- Actions ----

  /**
   * Reads token + email from sessionStorage and restores the session state.
   * Called by the APP_INITIALIZER so state is ready before first paint.
   */
  hydrateFromStorage(): void {
    const token = sessionStorage.getItem(TOKEN_KEY);
    const email = sessionStorage.getItem(EMAIL_KEY);
    if (token && email) {
      this.patch({ token, email, status: 'authenticated' });
    }
  }

  /**
   * Calls the auth port to login, persists token+email to sessionStorage,
   * and patches the store state.
   */
  async login(email: string, password: string): Promise<void> {
    const result = await this.authPort.login(email, password);
    sessionStorage.setItem(TOKEN_KEY, result.token);
    sessionStorage.setItem(EMAIL_KEY, result.email);
    this.patch({ token: result.token, email: result.email, status: 'authenticated' });
  }

  /**
   * Calls the auth port to register, persists token+email to sessionStorage,
   * and patches the store state.
   */
  async register(email: string, password: string): Promise<void> {
    const result = await this.authPort.register(email, password);
    sessionStorage.setItem(TOKEN_KEY, result.token);
    sessionStorage.setItem(EMAIL_KEY, result.email);
    this.patch({ token: result.token, email: result.email, status: 'authenticated' });
  }

  /**
   * Clears sessionStorage keys and resets store to anonymous state.
   * Does NOT reload the page — caller decides navigation.
   */
  logout(): void {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(EMAIL_KEY);
    this.reset(INITIAL_STATE);
  }
}
