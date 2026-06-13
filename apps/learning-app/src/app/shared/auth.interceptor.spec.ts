import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import {
  provideHttpClient,
  withInterceptors,
  HttpClient,
} from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { SessionStore } from 'application-session-store';
import { AUTH_PORT } from 'application-session-store';
import type { AuthPort } from 'application-session-store';
import { authInterceptor } from './auth.interceptor';

function makeAuthPort(): AuthPort {
  return {
    register: vi.fn(),
    login: vi.fn(),
    me: vi.fn(),
  };
}

function makeFakeStorage(): Storage {
  let store: Record<string, string> = {};
  return {
    get length() {
      return Object.keys(store).length;
    },
    key: (i: number) => Object.keys(store)[i] ?? null,
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => {
      store[k] = v;
    },
    removeItem: (k: string) => {
      delete store[k];
    },
    clear: () => {
      store = {};
    },
  } as Storage;
}

describe('authInterceptor', () => {
  let httpClient: HttpClient;
  let httpController: HttpTestingController;
  let sessionStore: SessionStore;
  let fakeStorage: Storage;
  let originalSessionStorage: Storage;

  beforeEach(() => {
    fakeStorage = makeFakeStorage();
    originalSessionStorage = window.sessionStorage;
    Object.defineProperty(window, 'sessionStorage', {
      value: fakeStorage,
      writable: true,
      configurable: true,
    });

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        // Stub route so Router can navigate to /login without NG04002
        provideRouter([{ path: 'login', component: class LoginStub {} }]),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        SessionStore,
        { provide: AUTH_PORT, useValue: makeAuthPort() },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpController = TestBed.inject(HttpTestingController);
    sessionStore = TestBed.inject(SessionStore);
  });

  afterEach(() => {
    httpController.verify();
    Object.defineProperty(window, 'sessionStorage', {
      value: originalSessionStorage,
      writable: true,
      configurable: true,
    });
  });

  it('attaches Authorization header when token is in store and URL is /api', () => {
    // Hydrate with a token
    fakeStorage.setItem('auth_token', 'tok-abc');
    fakeStorage.setItem('auth_email', 'user@example.com');
    sessionStore.hydrateFromStorage();

    httpClient.get('/api/progress').subscribe();

    const req = httpController.expectOne('/api/progress');
    expect(req.request.headers.get('Authorization')).toBe('Bearer tok-abc');
    req.flush([]);
  });

  it('attaches Authorization header from sessionStorage when store token is null', () => {
    // Store is anonymous but storage has a token (edge case)
    fakeStorage.setItem('auth_token', 'tok-fallback');

    httpClient.get('/api/progress').subscribe();

    const req = httpController.expectOne('/api/progress');
    expect(req.request.headers.get('Authorization')).toBe('Bearer tok-fallback');
    req.flush([]);
  });

  it('does NOT attach Authorization header for non-/api requests', () => {
    fakeStorage.setItem('auth_token', 'tok-abc');
    fakeStorage.setItem('auth_email', 'user@example.com');
    sessionStore.hydrateFromStorage();

    httpClient.get('https://external.example.com/data').subscribe();

    const req = httpController.expectOne('https://external.example.com/data');
    expect(req.request.headers.get('Authorization')).toBeNull();
    req.flush({});
  });

  it('does NOT attach Authorization header when no token is available', () => {
    // No token in store or storage
    httpClient.get('/api/progress').subscribe();

    const req = httpController.expectOne('/api/progress');
    expect(req.request.headers.get('Authorization')).toBeNull();
    req.flush([]);
  });

  it('calls SessionStore.logout() on 401 response from /api', () => {
    fakeStorage.setItem('auth_token', 'tok-abc');
    fakeStorage.setItem('auth_email', 'user@example.com');
    sessionStore.hydrateFromStorage();

    expect(sessionStore.isAuthenticated()).toBe(true);

    // Subscribe to trigger the interceptor; error is expected (interceptor re-throws 401)
    httpClient.get('/api/progress').subscribe({ next: () => { /* no-op */ }, error: () => { /* swallow expected 401 */ } });

    const req = httpController.expectOne('/api/progress');
    req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

    expect(sessionStore.status()).toBe('anonymous');
    expect(sessionStore.token()).toBeNull();
  });
});
