import type {
  DrillResult,
  ModuleProgress,
  QuizResult,
} from 'content-schema';
import type { ProgressRepository } from 'domain-progress';

/** IndexedDB database name */
const DB_NAME = 'ddob-progress';

/** Current schema version — bump on breaking schema changes */
const DB_VERSION = 1;

/** Object store name */
const STORE_NAME = 'moduleProgress';

/**
 * Promisifies an IDBRequest and resolves/rejects on the appropriate event.
 */
function requestToPromise<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Opens (or creates) the IndexedDB database and applies migrations via
 * onupgradeneeded. Returns a promise that resolves with the IDBDatabase.
 */
function openDatabase(): Promise<IDBDatabase> {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const oldVersion = event.oldVersion;

      // Forward-only migrations keyed by version boundary
      if (oldVersion < 1) {
        // v1 schema: one object store keyed by moduleId
        db.createObjectStore(STORE_NAME, { keyPath: 'moduleId' });
      }
      // Future versions: add `if (oldVersion < 2) { ... }` here
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
    req.onblocked = () => reject(new Error('IDBDatabase open blocked'));
  });
}

/**
 * Retrieves a single ModuleProgress record from the store.
 * Returns a default (unlocked only for module-1) empty record if not found.
 */
async function readModuleProgress(
  db: IDBDatabase,
  moduleId: string,
): Promise<ModuleProgress> {
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const result = await requestToPromise<ModuleProgress | undefined>(
    store.get(moduleId),
  );

  if (result) return result;

  // Default empty progress — module-1 is always unlocked
  return {
    moduleId,
    lessonsCompleted: [],
    drillResults: {},
    quizResult: undefined,
    unlockedAt: moduleId === 'module-1' ? new Date(0).toISOString() : undefined,
  };
}

/**
 * Writes a ModuleProgress record (upsert by moduleId).
 */
async function writeModuleProgress(
  db: IDBDatabase,
  progress: ModuleProgress,
): Promise<void> {
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  await requestToPromise(store.put(progress));
}

/**
 * IndexedDB implementation of the ProgressRepository port.
 *
 * All methods are promise-based and signal-friendly (no RxJS, no Zone.js).
 * The DB connection is opened lazily on first use and reused thereafter.
 */
export class IdbProgressRepository implements ProgressRepository {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private getDb(): Promise<IDBDatabase> {
    if (!this.dbPromise) {
      this.dbPromise = openDatabase();
    }
    return this.dbPromise;
  }

  async getModuleProgress(moduleId: string): Promise<ModuleProgress> {
    const db = await this.getDb();
    return readModuleProgress(db, moduleId);
  }

  async setLessonComplete(moduleId: string, lessonId: string): Promise<void> {
    const db = await this.getDb();
    const progress = await readModuleProgress(db, moduleId);

    if (!progress.lessonsCompleted.includes(lessonId)) {
      progress.lessonsCompleted = [...progress.lessonsCompleted, lessonId];
    }

    await writeModuleProgress(db, progress);
  }

  async setDrillResult(
    moduleId: string,
    drillId: string,
    result: DrillResult,
  ): Promise<void> {
    const db = await this.getDb();
    const progress = await readModuleProgress(db, moduleId);

    progress.drillResults = { ...progress.drillResults, [drillId]: result };

    await writeModuleProgress(db, progress);
  }

  async setQuizResult(moduleId: string, result: QuizResult): Promise<void> {
    const db = await this.getDb();
    const progress = await readModuleProgress(db, moduleId);

    progress.quizResult = result;

    // If the quiz was passed, record unlock timestamp
    if (result.passed && !progress.unlockedAt) {
      progress.unlockedAt = result.completedAt;
    }

    await writeModuleProgress(db, progress);
  }

  async isModuleUnlocked(moduleId: string): Promise<boolean> {
    if (moduleId === 'module-1') return true;

    const db = await this.getDb();
    const progress = await readModuleProgress(db, moduleId);

    return progress.unlockedAt !== undefined;
  }

  async resetProgress(): Promise<void> {
    const db = await this.getDb();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    await requestToPromise(store.clear());
  }
}
