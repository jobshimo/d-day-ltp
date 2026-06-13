import { InjectionToken } from '@angular/core';

/** Shape returned by register and login endpoints */
export interface AuthResult {
  token: string;
  email: string;
}

/** Minimal user info returned by /api/auth/me */
export interface AuthUser {
  email: string;
}

/**
 * Port: describes the auth operations the application layer needs.
 * The concrete adapter lives in auth.adapter.ts.
 */
export interface AuthPort {
  register(email: string, password: string): Promise<AuthResult>;
  login(email: string, password: string): Promise<AuthResult>;
  me(): Promise<AuthUser>;
}

/** DI token for the AuthPort */
export const AUTH_PORT = new InjectionToken<AuthPort>('AuthPort');
