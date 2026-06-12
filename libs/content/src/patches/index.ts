/**
 * Errata patch registry.
 *
 * Each patch file exports an `applyPatch(base: CourseModule): CourseModule` function.
 * Patches are applied at content-load time (before serving) in the order listed here.
 *
 * v1 contains ZERO actual patches. The structure exists so the API and application
 * layer can apply patches without knowing whether any exist.
 *
 * When a Devir errata item is confirmed:
 * 1. Create `patches/<patch-id>.ts` exporting `applyPatch`.
 * 2. Import and add it to the `PATCHES` array below.
 */
import type { CourseModule } from 'content-schema';

export type PatchFn = (base: CourseModule) => CourseModule;

/** Ordered list of patch functions to apply to each module at load time. */
export const PATCHES: PatchFn[] = [
  // No patches in v1. Add confirmed Devir errata patches here.
];

/**
 * Applies all registered patches to a module in order.
 * Returns the original module unchanged if PATCHES is empty.
 */
export function applyPatches(module: CourseModule): CourseModule {
  return PATCHES.reduce((acc, patch) => patch(acc), module);
}
