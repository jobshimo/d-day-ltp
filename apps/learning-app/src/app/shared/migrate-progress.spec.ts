import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  runFirstLoginMigration,
  isMigrated,
  markMigrated,
  migrationFlagKey,
} from './migrate-progress';

// ---------------------------------------------------------------------------
// Fake localStorage
// ---------------------------------------------------------------------------
function makeFakeStorage(): Storage {
  let store: Record<string, string> = {};
  return {
    get length() { return Object.keys(store).length; },
    key: (i: number) => Object.keys(store)[i] ?? null,
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => { store[k] = v; },
    removeItem: (k: string) => { delete store[k]; },
    clear: () => { store = {}; },
  } as Storage;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const TEST_EMAIL = 'test@example.com';
const TEST_TOKEN = 'test-jwt-token';

describe('migrate-progress helpers', () => {
  let fakeLocal: Storage;
  let originalLocalStorage: Storage;
  let originalSessionStorage: Storage;

  beforeEach(() => {
    fakeLocal = makeFakeStorage();
    originalLocalStorage = window.localStorage;
    originalSessionStorage = window.sessionStorage;

    Object.defineProperty(window, 'localStorage', {
      value: fakeLocal,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(window, 'sessionStorage', {
      value: makeFakeStorage(),
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(window, 'sessionStorage', {
      value: originalSessionStorage,
      writable: true,
      configurable: true,
    });
    vi.restoreAllMocks();
  });

  it('isMigrated returns false when flag is not set', () => {
    expect(isMigrated(TEST_EMAIL)).toBe(false);
  });

  it('markMigrated sets the flag and isMigrated returns true', () => {
    markMigrated(TEST_EMAIL);
    expect(isMigrated(TEST_EMAIL)).toBe(true);
  });

  it('migrationFlagKey includes the email', () => {
    expect(migrationFlagKey(TEST_EMAIL)).toContain(TEST_EMAIL);
  });
});

describe('runFirstLoginMigration', () => {
  let fakeLocal: Storage;
  let fakeSession: Storage;
  let originalLocalStorage: Storage;
  let originalSessionStorage: Storage;

  beforeEach(() => {
    fakeLocal = makeFakeStorage();
    fakeSession = makeFakeStorage();
    originalLocalStorage = window.localStorage;
    originalSessionStorage = window.sessionStorage;

    Object.defineProperty(window, 'localStorage', {
      value: fakeLocal,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(window, 'sessionStorage', {
      value: fakeSession,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(window, 'sessionStorage', {
      value: originalSessionStorage,
      writable: true,
      configurable: true,
    });
    vi.restoreAllMocks();
  });

  it('does nothing and sets flag when already migrated', async () => {
    fakeLocal.setItem(migrationFlagKey(TEST_EMAIL), '1');
    fakeSession.setItem('auth_token', TEST_TOKEN);

    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    await runFirstLoginMigration(TEST_EMAIL);

    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('skips migration when no auth token in sessionStorage', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    await runFirstLoginMigration(TEST_EMAIL);

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('No auth token'));
  });

  it('POSTs to /api/progress/migrate with Bearer token when IDB has entries', async () => {
    fakeSession.setItem('auth_token', TEST_TOKEN);

    // Mock IdbProgressRepository to return non-empty progress for one module
    const { IdbProgressRepository } = await import('infrastructure-idb-adapter');
    vi.spyOn(IdbProgressRepository.prototype, 'getModuleProgress').mockImplementation(
      async (moduleId: string) => ({
        moduleId,
        lessonsCompleted: moduleId === 'module-1' ? ['lesson-1'] : [],
        drillResults: {},
        quizResult: undefined,
        unlockedAt: moduleId === 'module-1' ? new Date(0).toISOString() : undefined,
      }),
    );

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ imported: 1 }), { status: 200 }),
    );

    await runFirstLoginMigration(TEST_EMAIL);

    expect(fetchSpy).toHaveBeenCalledOnce();
    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toBe('/api/progress/migrate');
    expect((init as RequestInit).method).toBe('POST');
    expect((init as RequestInit).headers).toMatchObject({
      Authorization: `Bearer ${TEST_TOKEN}`,
    });

    // Flag should be set after success
    expect(isMigrated(TEST_EMAIL)).toBe(true);
  });

  it('does NOT set migrated flag when POST fails with non-OK status', async () => {
    fakeSession.setItem('auth_token', TEST_TOKEN);

    const { IdbProgressRepository } = await import('infrastructure-idb-adapter');
    vi.spyOn(IdbProgressRepository.prototype, 'getModuleProgress').mockImplementation(
      async (moduleId: string) => ({
        moduleId,
        lessonsCompleted: ['lesson-1'],
        drillResults: {},
        quizResult: undefined,
        unlockedAt: undefined,
      }),
    );

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, { status: 500, statusText: 'Internal Server Error' }),
    );
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    await runFirstLoginMigration(TEST_EMAIL);

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('500'));
    expect(isMigrated(TEST_EMAIL)).toBe(false); // flag NOT set — retry next login
  });

  it('does NOT set migrated flag and logs warn when fetch throws', async () => {
    fakeSession.setItem('auth_token', TEST_TOKEN);

    const { IdbProgressRepository } = await import('infrastructure-idb-adapter');
    vi.spyOn(IdbProgressRepository.prototype, 'getModuleProgress').mockImplementation(
      async (moduleId: string) => ({
        moduleId,
        lessonsCompleted: ['lesson-1'],
        drillResults: {},
        quizResult: undefined,
        unlockedAt: undefined,
      }),
    );

    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'));
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    await runFirstLoginMigration(TEST_EMAIL);

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Migration failed'),
      expect.any(Error),
    );
    expect(isMigrated(TEST_EMAIL)).toBe(false); // flag NOT set
  });

  it('a thrown migration error does NOT throw out of runFirstLoginMigration', async () => {
    fakeSession.setItem('auth_token', TEST_TOKEN);

    const { IdbProgressRepository } = await import('infrastructure-idb-adapter');
    vi.spyOn(IdbProgressRepository.prototype, 'getModuleProgress').mockRejectedValue(
      new Error('IDB read failed'),
    );
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    // Must not throw — login should still proceed
    await expect(runFirstLoginMigration(TEST_EMAIL)).resolves.toBeUndefined();
  });
});
