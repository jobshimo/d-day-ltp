import { InjectionToken } from '@angular/core';

/**
 * Port for audio narration playback.
 *
 * Implementations live in the infrastructure layer; the domain layer only
 * defines the contract. No framework details, no DOM APIs here.
 */
export interface NarrationPlayerPort {
  /**
   * Plays the audio at the given src path.
   *
   * @param src       - path to the MP3 asset (e.g. "assets/audio/abc123.mp3")
   * @param onEnded   - optional callback invoked when playback completes naturally
   */
  play(src: string, onEnded?: () => void): Promise<void>;

  /** Pauses playback without resetting the position. */
  pause(): void;

  /** Pauses playback and resets position to the start. */
  stop(): void;
}

/**
 * Angular DI token for the NarrationPlayerPort.
 *
 * Bind it in the composition root (app.config.ts) to the HTML audio adapter.
 * The application store injects this token to remain decoupled from the DOM.
 */
export const NARRATION_PLAYER = new InjectionToken<NarrationPlayerPort>('NarrationPlayer');
