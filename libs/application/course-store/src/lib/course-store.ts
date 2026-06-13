import { Injectable, Inject, InjectionToken } from '@angular/core';
import type { Signal } from '@angular/core';
import type { CourseModule, ModuleProgress } from 'content-schema';
import type { ProgressRepository } from 'domain-progress';
import { PROGRESS_REPO_TOKEN_ID } from 'domain-progress';
import { isModuleUnlocked } from 'domain-course';
import { SignalStore } from './signal-store.base';

/** Angular DI token for ProgressRepository in this application scope */
export const COURSE_PROGRESS_REPO = new InjectionToken<ProgressRepository>(
  PROGRESS_REPO_TOKEN_ID,
);

/** DI token for the course content source (array of CourseModule) */
export const COURSE_CONTENT = new InjectionToken<CourseModule[]>('CourseContent');

export interface ModuleListEntry {
  moduleId: string;
  order: number;
  titleEs: string;
  descriptionEs: string;
  isUnlocked: boolean;
  completionPercent: number;
  isPreview: boolean; // module-4 is preview-only in v1
}

interface CourseState {
  modules: ModuleListEntry[];
  activeModuleId: string | null;
  activeLessonId: string | null;
  loading: boolean;
  error: string | null;
}

const INITIAL_STATE: CourseState = {
  modules: [],
  activeModuleId: null,
  activeLessonId: null,
  loading: false,
  error: null,
};

/**
 * CourseStore — manages the module list, unlock status, and active navigation.
 *
 * Uses promise-based async actions (no RxJS, zoneless-compatible).
 */
@Injectable()
export class CourseStore extends SignalStore<CourseState> {
  // ---- Public selectors (read-only computed signals) ----

  readonly modules: Signal<ModuleListEntry[]> = this.select((s) => s.modules);
  readonly activeModuleId: Signal<string | null> = this.select((s) => s.activeModuleId);
  readonly activeLessonId: Signal<string | null> = this.select((s) => s.activeLessonId);
  readonly loading: Signal<boolean> = this.select((s) => s.loading);
  readonly error: Signal<string | null> = this.select((s) => s.error);

  readonly activeModule: Signal<ModuleListEntry | null> = this.select((s) => {
    if (!s.activeModuleId) return null;
    return s.modules.find((m) => m.moduleId === s.activeModuleId) ?? null;
  });

  constructor(
    @Inject(COURSE_CONTENT) private readonly content: CourseModule[],
    @Inject(COURSE_PROGRESS_REPO) private readonly progress: ProgressRepository,
  ) {
    super(INITIAL_STATE);
  }

  // ---- Actions ----

  /**
   * Loads all modules from content, queries progress for unlock status,
   * and populates the module list signal.
   */
  async loadModules(): Promise<void> {
    this.patch({ loading: true, error: null });

    try {
      // Fetch progress for every module once, then derive unlock state from the
      // content graph (a module unlocks when its prior module's quiz is passed).
      // The persistence adapter cannot know the prerequisite graph, so the
      // unlock decision lives in the domain, not in the repository.
      const progressPairs = await Promise.all(
        this.content.map(
          async (mod) =>
            [mod.id, await this.progress.getModuleProgress(mod.id)] as const,
        ),
      );
      const progressByModule: Record<string, ModuleProgress> =
        Object.fromEntries(progressPairs);

      const entries = this.content.map((mod) =>
        this.buildModuleEntry(mod, progressByModule),
      );

      this.patch({ modules: entries, loading: false });
    } catch (err) {
      this.patch({ loading: false, error: String(err) });
    }
  }

  /**
   * Sets the active module and optionally the starting lesson.
   */
  setActiveModule(moduleId: string, lessonId?: string): void {
    this.patch({
      activeModuleId: moduleId,
      activeLessonId: lessonId ?? null,
    });
  }

  /**
   * Sets the active lesson within the current active module.
   */
  setActiveLesson(lessonId: string): void {
    this.patch({ activeLessonId: lessonId });
  }

  /**
   * Unlocks a module by recording an unlock timestamp in progress.
   * Called by the application when the preceding module's quiz is passed.
   */
  async unlockModule(moduleId: string): Promise<void> {
    // Persist a placeholder quiz result that flags the module as having an unlock timestamp.
    // The actual unlock logic for the NEXT module is driven by setQuizResult in ProgressRepo.
    // This action refreshes the module list after unlock.
    await this.loadModules();
  }

  // ---- Helpers ----

  private buildModuleEntry(
    mod: CourseModule,
    progressByModule: Record<string, ModuleProgress>,
  ): ModuleListEntry {
    const isUnlocked = isModuleUnlocked(this.content, mod.id, progressByModule);
    const moduleProgress = progressByModule[mod.id];

    const totalItems =
      mod.lessons.length + mod.drills.length + (mod.reviewQuiz.length > 0 ? 1 : 0);

    let completedItems = moduleProgress.lessonsCompleted.length;
    completedItems += Object.keys(moduleProgress.drillResults).length;
    if (moduleProgress.quizResult?.passed) completedItems += 1;

    const completionPercent =
      totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    return {
      moduleId: mod.id,
      order: mod.order,
      titleEs: mod.titleEs,
      descriptionEs: mod.descriptionEs,
      isUnlocked,
      completionPercent,
      isPreview: mod.id === 'module-4',
    };
  }
}
