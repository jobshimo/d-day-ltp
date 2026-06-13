import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { SessionStore } from './session-store';
import { AUTH_PORT } from './auth.port';
import type { AuthPort, AuthResult } from './auth.port';

// ---------------------------------------------------------------------------
// Fake sessionStorage (isolated per test)
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Fake AuthPort
// ---------------------------------------------------------------------------
function makeAuthPort(overrides: Partial<AuthPort> = {}): AuthPort {
  const defaultResult: AuthResult = { token: 'tok-123', email: 'user@example.com' };
  return {
    register: vi.fn().mockResolvedValue(defaultResult),
    login: vi.fn().mockResolvedValue(defaultResult),
    me: vi.fn().mockResolvedValue({ email: 'user@example.com' }),
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('SessionStore', () => {
  let store: SessionStore;
  let authPort: AuthPort;
  let fakeStorage: Storage;
  let originalSessionStorage: Storage;

  beforeEach(() => {
    // Replace sessionStorage with a controlled fake
    fakeStorage = makeFakeStorage();
    originalSessionStorage = window.sessionStorage;
    Object.defineProperty(window, 'sessionStorage', {
      value: fakeStorage,
      writable: true,
      configurable: true,
    });

    authPort = makeAuthPort();

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        SessionStore,
        { provide: AUTH_PORT, useValue: authPort },
      ],
    });

    store = TestBed.inject(SessionStore);
  });

  afterEach(() => {
    Object.defineProperty(window, 'sessionStorage', {
      value: originalSessionStorage,
      writable: true,
      configurable: true,
    });
    TestBed.resetTestingModule();
  });

  describe('initial state', () => {
    it('starts as anonymous', () => {
      expect(store.status()).toBe('anonymous');
    });

    it('starts with null token', () => {
      expect(store.token()).toBeNull();
    });

    it('starts with null email', () => {
      expect(store.email()).toBeNull();
    });

    it('isAuthenticated is false initially', () => {
      expect(store.isAuthenticated()).toBe(false);
    });
  });

  describe('login()', () => {
    it('calls authPort.login with correct credentials', async () => {
      await store.login('user@example.com', 'password123');
      expect(authPort.login).toHaveBeenCalledWith('user@example.com', 'password123');
    });

    it('sets status to authenticated on success', async () => {
      await store.login('user@example.com', 'password123');
      expect(store.status()).toBe('authenticated');
    });

    it('sets token in store state', async () => {
      await store.login('user@example.com', 'password123');
      expect(store.token()).toBe('tok-123');
    });

    it('sets email in store state', async () => {
      await store.login('user@example.com', 'password123');
      expect(store.email()).toBe('user@example.com');
    });

    it('persists token to sessionStorage', async () => {
      await store.login('user@example.com', 'password123');
      expect(fakeStorage.getItem('auth_token')).toBe('tok-123');
    });

    it('persists email to sessionStorage', async () => {
      await store.login('user@example.com', 'password123');
      expect(fakeStorage.getItem('auth_email')).toBe('user@example.com');
    });

    it('throws and does not change state if authPort.login rejects', async () => {
      vi.mocked(authPort.login).mockRejectedValueOnce(new Error('Invalid credentials'));

      await expect(store.login('bad@example.com', 'wrongpass')).rejects.toThrow('Invalid credentials');

      expect(store.status()).toBe('anonymous');
      expect(store.token()).toBeNull();
    });
  });

  describe('register()', () => {
    it('calls authPort.register with correct credentials', async () => {
      await store.register('new@example.com', 'password123');
      expect(authPort.register).toHaveBeenCalledWith('new@example.com', 'password123');
    });

    it('sets status to authenticated on success', async () => {
      await store.register('new@example.com', 'password123');
      expect(store.status()).toBe('authenticated');
    });

    it('persists token and email to sessionStorage on register', async () => {
      await store.register('new@example.com', 'password123');
      expect(fakeStorage.getItem('auth_token')).toBe('tok-123');
      expect(fakeStorage.getItem('auth_email')).toBe('user@example.com');
    });
  });

  describe('logout()', () => {
    it('clears sessionStorage keys', async () => {
      await store.login('user@example.com', 'password123');
      store.logout();

      expect(fakeStorage.getItem('auth_token')).toBeNull();
      expect(fakeStorage.getItem('auth_email')).toBeNull();
    });

    it('resets state to anonymous', async () => {
      await store.login('user@example.com', 'password123');
      store.logout();

      expect(store.status()).toBe('anonymous');
      expect(store.token()).toBeNull();
      expect(store.email()).toBeNull();
    });

    it('isAuthenticated becomes false after logout', async () => {
      await store.login('user@example.com', 'password123');
      expect(store.isAuthenticated()).toBe(true);

      store.logout();
      expect(store.isAuthenticated()).toBe(false);
    });
  });

  describe('hydrateFromStorage()', () => {
    it('restores token and email from sessionStorage', () => {
      fakeStorage.setItem('auth_token', 'stored-tok');
      fakeStorage.setItem('auth_email', 'stored@example.com');

      store.hydrateFromStorage();

      expect(store.token()).toBe('stored-tok');
      expect(store.email()).toBe('stored@example.com');
      expect(store.status()).toBe('authenticated');
    });

    it('does nothing if sessionStorage is empty', () => {
      store.hydrateFromStorage();

      expect(store.status()).toBe('anonymous');
      expect(store.token()).toBeNull();
    });

    it('does nothing if token is present but email is missing', () => {
      fakeStorage.setItem('auth_token', 'tok-only');

      store.hydrateFromStorage();

      expect(store.status()).toBe('anonymous');
    });
  });
});
