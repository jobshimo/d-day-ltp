import { signal, computed } from '@angular/core';
import type { Signal, WritableSignal } from '@angular/core';

/**
 * Base class for Flux signal stores.
 *
 * - Private WritableSignal holds the full state slice.
 * - Protected `select` creates computed selectors (public-readable, read-only).
 * - Protected `patch` performs a shallow merge update.
 *
 * Subclasses expose only computed selectors and action methods — no raw state
 * is accessible from outside the store.
 */
export abstract class SignalStore<S extends object> {
  private readonly _state: WritableSignal<S>;

  protected constructor(initial: S) {
    this._state = signal(initial);
  }

  /**
   * Creates a read-only computed selector derived from the state.
   */
  protected select<T>(fn: (s: S) => T): Signal<T> {
    return computed(() => fn(this._state()));
  }

  /**
   * Shallow-merges a partial update into the current state.
   */
  protected patch(partial: Partial<S>): void {
    this._state.update((s) => ({ ...s, ...partial }));
  }

  /**
   * Replaces the entire state (for full resets).
   */
  protected reset(next: S): void {
    this._state.set(next);
  }
}
