import type { NarrationPlayerPort } from 'domain-narration';

/**
 * HTML5 Audio implementation of the NarrationPlayerPort.
 *
 * - Uses a single reused HTMLAudioElement (lazily created on first use).
 * - Resolves the src relative to document.baseURI so it works under any base href.
 * - Guards against SSR / non-browser environments (typeof Audio check).
 */
export class HtmlAudioNarrationPlayer implements NarrationPlayerPort {
  private audio: HTMLAudioElement | null = null;

  private getAudio(): HTMLAudioElement | null {
    if (typeof Audio === 'undefined') {
      // SSR or non-browser environment — no-op
      return null;
    }
    if (!this.audio) {
      this.audio = new Audio();
    }
    return this.audio;
  }

  /**
   * Loads and plays the audio at the given src.
   *
   * The src is resolved against document.baseURI so relative paths work
   * regardless of the app's deployment base href.
   *
   * @param src     - relative or absolute path to the MP3 asset
   * @param onEnded - optional callback invoked when playback completes naturally
   */
  play(src: string, onEnded?: () => void): Promise<void> {
    const audio = this.getAudio();
    if (!audio) return Promise.resolve();

    // Resolve against the document base so <base href> is respected
    const resolvedSrc = new URL(src, document.baseURI).href;

    // Clear any previous onended listener to avoid double-firing
    audio.onended = null;

    if (onEnded) {
      audio.onended = () => onEnded();
    }

    if (audio.src !== resolvedSrc) {
      audio.src = resolvedSrc;
      audio.load();
    }

    return audio.play();
  }

  /** Pauses playback without resetting position. */
  pause(): void {
    this.audio?.pause();
  }

  /** Pauses playback and resets position to the start. */
  stop(): void {
    if (!this.audio) return;
    this.audio.pause();
    this.audio.currentTime = 0;
  }
}
