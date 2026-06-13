import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { HtmlAudioNarrationPlayer } from './html-audio-narration-player';

/**
 * Minimal HTMLAudioElement mock.
 * We replace the global `Audio` constructor so the adapter under test
 * receives a mock element we can inspect.
 */
function makeAudioMock() {
  return {
    src: '',
    currentTime: 0,
    onended: null as (() => void) | null,
    load: vi.fn(),
    play: vi.fn().mockResolvedValue(undefined),
    pause: vi.fn(),
  };
}

type AudioMock = ReturnType<typeof makeAudioMock>;

describe('HtmlAudioNarrationPlayer', () => {
  let player: HtmlAudioNarrationPlayer;
  let mockAudio: AudioMock;

  beforeEach(() => {
    mockAudio = makeAudioMock();

    // Inject mock Audio constructor into global scope
    (globalThis as unknown as Record<string, unknown>)['Audio'] = vi
      .fn()
      .mockImplementation(() => mockAudio);

    // document.baseURI defaults to 'about:blank' in jsdom; set a sensible base
    Object.defineProperty(document, 'baseURI', {
      value: 'http://localhost/',
      configurable: true,
      writable: true,
    });

    player = new HtmlAudioNarrationPlayer();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('play()', () => {
    it('sets the src on the audio element', async () => {
      await player.play('assets/audio/abc.mp3');
      expect(mockAudio.src).toBe('http://localhost/assets/audio/abc.mp3');
    });

    it('calls audio.play()', async () => {
      await player.play('assets/audio/abc.mp3');
      expect(mockAudio.play).toHaveBeenCalledOnce();
    });

    it('calls audio.load() when the src changes', async () => {
      await player.play('assets/audio/abc.mp3');
      expect(mockAudio.load).toHaveBeenCalledOnce();
    });

    it('does NOT call audio.load() when the same src is replayed', async () => {
      await player.play('assets/audio/abc.mp3');
      mockAudio.load.mockClear();
      mockAudio.play.mockClear();

      await player.play('assets/audio/abc.mp3');
      expect(mockAudio.load).not.toHaveBeenCalled();
    });

    it('wires onEnded callback to audio.onended', async () => {
      const onEnded = vi.fn();
      await player.play('assets/audio/abc.mp3', onEnded);

      // Simulate natural end of playback
      mockAudio.onended?.();
      expect(onEnded).toHaveBeenCalledOnce();
    });

    it('clears previous onEnded before setting a new one', async () => {
      const first = vi.fn();
      const second = vi.fn();

      await player.play('assets/audio/a.mp3', first);
      await player.play('assets/audio/b.mp3', second);

      mockAudio.onended?.();
      expect(second).toHaveBeenCalledOnce();
      expect(first).not.toHaveBeenCalled();
    });
  });

  describe('pause()', () => {
    it('calls audio.pause()', async () => {
      await player.play('assets/audio/abc.mp3');
      player.pause();
      expect(mockAudio.pause).toHaveBeenCalledOnce();
    });

    it('is a no-op if play() was never called', () => {
      // Should not throw
      expect(() => player.pause()).not.toThrow();
    });
  });

  describe('stop()', () => {
    it('calls pause() and resets currentTime to 0', async () => {
      await player.play('assets/audio/abc.mp3');
      mockAudio.currentTime = 5;

      player.stop();

      expect(mockAudio.pause).toHaveBeenCalledOnce();
      expect(mockAudio.currentTime).toBe(0);
    });

    it('is a no-op if play() was never called', () => {
      expect(() => player.stop()).not.toThrow();
    });
  });

  describe('SSR guard', () => {
    it('returns a resolved promise when Audio is undefined', async () => {
      // Simulate server-side rendering environment
      const originalAudio = (globalThis as unknown as Record<string, unknown>)['Audio'];
      delete (globalThis as unknown as Record<string, unknown>)['Audio'];

      const ssrPlayer = new HtmlAudioNarrationPlayer();
      await expect(ssrPlayer.play('assets/audio/abc.mp3')).resolves.toBeUndefined();

      (globalThis as unknown as Record<string, unknown>)['Audio'] = originalAudio;
    });
  });
});
