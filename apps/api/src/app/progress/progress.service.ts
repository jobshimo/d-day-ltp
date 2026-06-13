import { Injectable } from '@nestjs/common';
import type { ModuleProgress, DrillResult, QuizResult } from 'content-schema';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

// ---------------------------------------------------------------------------
// Internal type — shape of a Prisma ModuleProgress row as returned by the ORM.
// ---------------------------------------------------------------------------
interface ModuleProgressRow {
  id: string;
  userId: string;
  moduleId: string;
  lessonsCompleted: string[];
  drillResults: unknown; // Json column
  quizResult: unknown | null; // Json? column
  unlockedAt: Date | null; // DateTime? column
}

// ---------------------------------------------------------------------------
// Pure serialization helpers — unit-testable without any Nest/Prisma context.
// ---------------------------------------------------------------------------

/**
 * Converts a Prisma row to the shared ModuleProgress wire shape.
 *
 * Key invariants:
 * - drillResults Json column is stored as Record<string,DrillResult> verbatim (ISO dates inside are strings already).
 * - quizResult Json? column — null becomes undefined.
 * - unlockedAt DateTime? — Date value is converted to ISO string; null becomes undefined.
 */
export function rowToWire(row: ModuleProgressRow): ModuleProgress {
  return {
    moduleId: row.moduleId,
    lessonsCompleted: row.lessonsCompleted,
    drillResults: (row.drillResults ?? {}) as Record<string, DrillResult>,
    quizResult: row.quizResult != null ? (row.quizResult as QuizResult) : undefined,
    unlockedAt: row.unlockedAt != null ? row.unlockedAt.toISOString() : undefined,
  };
}

/**
 * Converts a wire ModuleProgress to the Prisma upsert data shape.
 */
export function wireToRow(
  userId: string,
  wire: ModuleProgress,
): {
  userId: string;
  moduleId: string;
  lessonsCompleted: string[];
  drillResults: unknown;
  quizResult: unknown;
  unlockedAt: Date | null;
} {
  return {
    userId,
    moduleId: wire.moduleId,
    lessonsCompleted: wire.lessonsCompleted,
    drillResults: wire.drillResults as unknown,
    // Prisma Json? null sentinel — use null (not undefined) for explicit null in DB
    quizResult: wire.quizResult != null ? (wire.quizResult as unknown) : null,
    unlockedAt: wire.unlockedAt != null ? new Date(wire.unlockedAt) : null,
  };
}

/**
 * Returns the default empty ModuleProgress for a given moduleId.
 * Mirrors IdbProgressRepository default: module-1 has unlockedAt = epoch ISO string.
 */
export function defaultProgress(moduleId: string): ModuleProgress {
  return {
    moduleId,
    lessonsCompleted: [],
    drillResults: {},
    quizResult: undefined,
    unlockedAt: moduleId === 'module-1' ? new Date(0).toISOString() : undefined,
  };
}

// ---------------------------------------------------------------------------
// ProgressService — thin persistence layer over Prisma.
// ---------------------------------------------------------------------------

@Injectable()
export class ProgressService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns all ModuleProgress rows for a user as wire shapes.
   */
  async getAllModuleProgress(userId: string): Promise<ModuleProgress[]> {
    const rows = await this.prisma.moduleProgress.findMany({
      where: { userId },
    });
    return rows.map((r) => rowToWire(r as ModuleProgressRow));
  }

  /**
   * Returns a single ModuleProgress for the user+module pair.
   * Falls back to defaultProgress when no row exists (mirrors IDB adapter).
   */
  async getModuleProgress(userId: string, moduleId: string): Promise<ModuleProgress> {
    const row = await this.prisma.moduleProgress.findUnique({
      where: { userId_moduleId: { userId, moduleId } },
    });
    if (!row) return defaultProgress(moduleId);
    return rowToWire(row as ModuleProgressRow);
  }

  /**
   * Marks a lesson complete for the user+module. Deduplicates lessonsCompleted.
   */
  async setLessonComplete(userId: string, moduleId: string, lessonId: string): Promise<ModuleProgress> {
    const current = await this.getModuleProgress(userId, moduleId);
    if (!current.lessonsCompleted.includes(lessonId)) {
      current.lessonsCompleted = [...current.lessonsCompleted, lessonId];
    }
    return this.upsertModuleProgress(userId, current);
  }

  /**
   * Merges a DrillResult into the drillResults map for the user+module.
   */
  async setDrillResult(
    userId: string,
    moduleId: string,
    drillId: string,
    result: DrillResult,
  ): Promise<ModuleProgress> {
    const current = await this.getModuleProgress(userId, moduleId);
    current.drillResults = { ...current.drillResults, [drillId]: result };
    return this.upsertModuleProgress(userId, current);
  }

  /**
   * Sets the quiz result. Sets unlockedAt when result.passed and not already set.
   * Mirrors IdbProgressRepository.setQuizResult semantics exactly.
   */
  async setQuizResult(
    userId: string,
    moduleId: string,
    result: QuizResult,
  ): Promise<ModuleProgress> {
    const current = await this.getModuleProgress(userId, moduleId);
    current.quizResult = result;
    if (result.passed && !current.unlockedAt) {
      current.unlockedAt = result.completedAt;
    }
    return this.upsertModuleProgress(userId, current);
  }

  /**
   * Deletes all progress rows for the user.
   */
  async resetProgress(userId: string): Promise<void> {
    await this.prisma.moduleProgress.deleteMany({ where: { userId } });
  }

  /**
   * Bulk upsert ModuleProgress entries for the user (used by first-login migration).
   * Idempotent — calling again with the same entries produces the same state.
   */
  async migrate(userId: string, entries: ModuleProgress[]): Promise<number> {
    for (const entry of entries) {
      await this.upsertModuleProgress(userId, entry);
    }
    return entries.length;
  }

  /**
   * Upserts a full ModuleProgress row keyed by (userId, moduleId).
   */
  async upsertModuleProgress(userId: string, wire: ModuleProgress): Promise<ModuleProgress> {
    const data = wireToRow(userId, wire);

    // Use Prisma's unchecked input type to allow scalar userId (not the relation connect form)
    const createData: Prisma.ModuleProgressUncheckedCreateInput = {
      userId: data.userId,
      moduleId: data.moduleId,
      lessonsCompleted: data.lessonsCompleted,
      drillResults: data.drillResults as Prisma.InputJsonValue,
      quizResult: data.quizResult != null
        ? (data.quizResult as Prisma.InputJsonValue)
        : Prisma.DbNull,
      unlockedAt: data.unlockedAt ?? undefined,
    };

    const updateData: Prisma.ModuleProgressUncheckedUpdateInput = {
      lessonsCompleted: data.lessonsCompleted,
      drillResults: data.drillResults as Prisma.InputJsonValue,
      quizResult: data.quizResult != null
        ? (data.quizResult as Prisma.InputJsonValue)
        : Prisma.DbNull,
      unlockedAt: data.unlockedAt ?? undefined,
    };

    const row = await this.prisma.moduleProgress.upsert({
      where: { userId_moduleId: { userId, moduleId: wire.moduleId } },
      create: createData,
      update: updateData,
    });
    return rowToWire(row as ModuleProgressRow);
  }
}
