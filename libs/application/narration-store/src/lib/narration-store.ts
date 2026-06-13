import { Injectable, Inject } from '@angular/core';
import type { Signal } from '@angular/core';
import type { NarrationPlayerPort } from 'domain-narration';
import { NARRATION_PLAYER } from 'domain-narration';
import { SignalStore } from 'application-course-store';

interface NarrationState {
  /** The key of the block currently loaded (format: "<lessonId>#<blockIndex>") */
  currentKey: string | null;
  /** True while the audio element is actively playing */
  isPlaying: boolean;
}

const INITIAL_STATE: NarrationState = {
  currentKey: null,
  isPlaying: false,
};

/**
 * NarrationStore — manages the active narration block and playback state.
 *
 * Uses the NarrationPlayerPort (injected via NARRATION_PLAYER token) so the
 * store remains decoupled from the DOM. A single block plays at a time; playing
 * a new block stops the previous one automatically.
 */
@Injectable({ providedIn: 'root' })
export class NarrationStore extends SignalStore<NarrationState> {
  // ---- Public selectors ----

  /** Key of the block that is currently loaded ("<lessonId>#<blockIndex>"). */
  readonly currentKey: Signal<string | null> = this.select((s) => s.currentKey);

  /** True while audio is actively playing. */
  readonly isPlaying: Signal<boolean> = this.select((s) => s.isPlaying);

  constructor(
    @Inject(NARRATION_PLAYER) private readonly player: NarrationPlayerPort,
  ) {
    super(INITIAL_STATE);
  }

  // ---- Actions ----

  /**
   * Plays the audio for a block.
   *
   * If the same block is already playing, this is a no-op.
   * If a different block is playing, it is stopped first.
   *
   * @param key - block key (e.g. "lesson-1-1#0")
   * @param src - asset path for the MP3 (e.g. "assets/audio/abc123.mp3")
   */
  async play(key: string, src: string): Promise<void> {
    // Reset playing state first; the onEnded callback will also reset it
    this.patch({ currentKey: key, isPlaying: true });

    await this.player.play(src, () => {
      // Only reset if this block is still the current one (not superseded)
      if (this.currentKey() === key) {
        this.patch({ isPlaying: false });
      }
    });
  }

  /**
   * Toggles playback for a block.
   *
   * - If this block is playing → pause (same block stays current).
   * - If this block is paused / different block was playing → play.
   *
   * @param key - block key
   * @param src - asset path for the MP3
   */
  async toggle(key: string, src: string): Promise<void> {
    if (this.currentKey() === key && this.isPlaying()) {
      this.player.pause();
      this.patch({ isPlaying: false });
    } else {
      await this.play(key, src);
    }
  }

  /**
   * Stops playback and resets the store to the initial state.
   */
  stop(): void {
    this.player.stop();
    this.reset(INITIAL_STATE);
  }
}
