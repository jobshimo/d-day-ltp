import { IdbProgressRepository } from 'infrastructure-idb-adapter';
import { ALL_MODULES } from 'content';
import type { ModuleProgress } from 'content-schema';

const MIGRATE_FLAG_PREFIX = 'ddob-migrated:';

/**
 * Returns the localStorage key used to guard one-shot migration for a given email.
 */
export function migrationFlagKey(email: string): string {
  return `${MIGRATE_FLAG_PREFIX}${email}`;
}

/**
 * Checks whether the first-login IDB→server migration has already run for this email.
 */
export function isMigrated(email: string): boolean {
  try {
    return typeof localStorage !== 'undefined' && !!localStorage.getItem(migrationFlagKey(email));
  } catch {
    return false;
  }
}

/**
 * Marks the migration as done for this email so it never runs again.
 * Called ONLY on successful migration POST.
 */
export function markMigrated(email: string): void {
  try {
    localStorage.setItem(migrationFlagKey(email), '1');
  } catch {
    // localStorage unavailable — silently ignore
  }
}

/**
 * Reads progress for all known modules from IndexedDB (guest adapter)
 * and filters out empty entries to avoid polluting the server with blank records.
 */
async function readIdbProgress(): Promise<ModuleProgress[]> {
  const idb = new IdbProgressRepository();
  const entries = await Promise.all(
    ALL_MODULES.map((m) => idb.getModuleProgress(m.id)),
  );

  // Only migrate modules that have meaningful progress
  return entries.filter(
    (p) =>
      p.lessonsCompleted.length > 0 ||
      Object.keys(p.drillResults).length > 0 ||
      p.quizResult !== undefined,
  );
}

/**
 * First-login migration: POSTs local IDB progress to the server.
 *
 * Best-effort: errors are caught and logged; they NEVER block the login flow.
 * The migrated flag is set only on success. On failure the next login attempt
 * will retry (flag remains unset).
 *
 * Must be called AFTER login/register succeeds (so auth_token is in sessionStorage).
 *
 * @param email - the authenticated user's email (used as the flag key)
 */
export async function runFirstLoginMigration(email: string): Promise<void> {
  if (isMigrated(email)) return;

  const token = typeof sessionStorage !== 'undefined'
    ? sessionStorage.getItem('auth_token')
    : null;

  if (!token) {
    console.warn('[migration] No auth token in sessionStorage — skipping migration.');
    return;
  }

  try {
    const entries = await readIdbProgress();

    if (entries.length === 0) {
      // Nothing to migrate — still mark as done
      markMigrated(email);
      return;
    }

    const response = await fetch('/api/progress/migrate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ entries }),
    });

    if (!response.ok) {
      console.warn(`[migration] Server returned ${response.status} — migration skipped.`);
      return; // Do NOT set flag — allow retry next login
    }

    markMigrated(email);
  } catch (err) {
    console.warn('[migration] Migration failed (best-effort) — login will continue:', err);
    // Do NOT set flag — allow retry next login
  }
}
