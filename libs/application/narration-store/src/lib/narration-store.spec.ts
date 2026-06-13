import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { NarrationStore } from './narration-store';
import { NARRATION_PLAYER } from 'domain-narration';
import type { NarrationPlayerPort } from 'domain-narration';

function makePlayer(overrides: Partial<NarrationPlayerPort> = {}): NarrationPlayerPort {
  return {
    play: vi.fn().mockResolvedValue(undefined),
    pause: vi.fn(),
    stop: vi.fn(),
    ...overrides,
  };
}

describe('NarrationStore', () => {
  let store: NarrationStore;
  let player: NarrationPlayerPort;

  beforeEach(() => {
    player = makePlayer();

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        NarrationStore,
        { provide: NARRATION_PLAYER, useValue: player },
      ],
    });

    store = TestBed.inject(NarrationStore);
  });

  describe('initial state', () => {
    it('has no currentKey', () => {
      expect(store.currentKey()).toBeNull();
    });

    it('is not playing', () => {
      expect(store.isPlaying()).toBe(false);
    });
  });

  describe('play()', () => {
    it('sets currentKey and isPlaying to true', async () => {
      await store.play('lesson-1-1#0', 'assets/audio/abc.mp3');

      expect(store.currentKey()).toBe('lesson-1-1#0');
      expect(store.isPlaying()).toBe(true);
    });

    it('calls port.play() with the correct src', async () => {
      await store.play('lesson-1-1#0', 'assets/audio/abc.mp3');

      expect(player.play).toHaveBeenCalledWith(
        'assets/audio/abc.mp3',
        expect.any(Function),
      );
    });

    it('resets isPlaying to false when the onEnded callback fires', async () => {
      // Capture the onEnded callback passed to port.play
      let capturedOnEnded: (() => void) | undefined;
      vi.mocked(player.play).mockImplementation((_src, onEnded) => {
        capturedOnEnded = onEnded;
        return Promise.resolve();
      });

      await store.play('lesson-1-1#0', 'assets/audio/abc.mp3');
      expect(store.isPlaying()).toBe(true);

      // Simulate audio ending
      capturedOnEnded?.();
      expect(store.isPlaying()).toBe(false);
    });

    it('does not reset isPlaying if a newer block supersedes before onEnded fires', async () => {
      // First play — capture callback
      let firstOnEnded: (() => void) | undefined;
      vi.mocked(player.play).mockImplementationOnce((_src, onEnded) => {
        firstOnEnded = onEnded;
        return Promise.resolve();
      });
      vi.mocked(player.play).mockResolvedValueOnce(undefined);

      await store.play('lesson-1-1#0', 'assets/audio/a.mp3');
      // Second play — supersedes first
      await store.play('lesson-1-1#1', 'assets/audio/b.mp3');

      expect(store.currentKey()).toBe('lesson-1-1#1');
      expect(store.isPlaying()).toBe(true);

      // Old onEnded fires — should NOT reset state because key changed
      firstOnEnded?.();
      expect(store.isPlaying()).toBe(true);
      expect(store.currentKey()).toBe('lesson-1-1#1');
    });
  });

  describe('toggle()', () => {
    it('plays when nothing is playing', async () => {
      await store.toggle('lesson-1-1#0', 'assets/audio/abc.mp3');

      expect(player.play).toHaveBeenCalledOnce();
      expect(store.isPlaying()).toBe(true);
    });

    it('pauses when the same block is playing', async () => {
      await store.play('lesson-1-1#0', 'assets/audio/abc.mp3');
      await store.toggle('lesson-1-1#0', 'assets/audio/abc.mp3');

      expect(player.pause).toHaveBeenCalledOnce();
      expect(store.isPlaying()).toBe(false);
    });

    it('switches to the new block when a different block is playing', async () => {
      await store.play('lesson-1-1#0', 'assets/audio/a.mp3');
      await store.toggle('lesson-1-1#1', 'assets/audio/b.mp3');

      expect(store.currentKey()).toBe('lesson-1-1#1');
      expect(store.isPlaying()).toBe(true);
      // play() was called twice (once for first, once for toggle)
      expect(player.play).toHaveBeenCalledTimes(2);
    });
  });

  describe('stop()', () => {
    it('calls port.stop()', async () => {
      await store.play('lesson-1-1#0', 'assets/audio/abc.mp3');
      store.stop();

      expect(player.stop).toHaveBeenCalledOnce();
    });

    it('resets state to initial', async () => {
      await store.play('lesson-1-1#0', 'assets/audio/abc.mp3');
      store.stop();

      expect(store.currentKey()).toBeNull();
      expect(store.isPlaying()).toBe(false);
    });

    it('is a no-op on an already-stopped store', () => {
      expect(() => store.stop()).not.toThrow();
      expect(player.stop).toHaveBeenCalledOnce();
    });
  });
});
