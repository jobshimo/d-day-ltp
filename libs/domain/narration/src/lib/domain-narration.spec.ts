import { describe, it, expect } from 'vitest';
import { InjectionToken } from '@angular/core';
import { NARRATION_PLAYER } from './domain-narration';
import type { NarrationPlayerPort } from './domain-narration';

describe('NarrationPlayerPort', () => {
  it('NARRATION_PLAYER is an InjectionToken', () => {
    expect(NARRATION_PLAYER).toBeInstanceOf(InjectionToken);
  });

  it('accepts a class that structurally implements NarrationPlayerPort', async () => {
    /** In-memory stub for contract verification */
    class InMemoryNarrationPlayer implements NarrationPlayerPort {
      calls: string[] = [];

      play(src: string, onEnded?: () => void): Promise<void> {
        this.calls.push(`play:${src}`);
        onEnded?.();
        return Promise.resolve();
      }

      pause(): void {
        this.calls.push('pause');
      }

      stop(): void {
        this.calls.push('stop');
      }
    }

    const player: NarrationPlayerPort = new InMemoryNarrationPlayer();

    await player.play('assets/audio/abc.mp3');
    player.pause();
    player.stop();

    const stub = player as InMemoryNarrationPlayer;
    expect(stub.calls).toEqual(['play:assets/audio/abc.mp3', 'pause', 'stop']);
  });

  it('play() accepts an optional onEnded callback', async () => {
    let ended = false;

    class StubPlayer implements NarrationPlayerPort {
      play(_src: string, onEnded?: () => void): Promise<void> {
        onEnded?.();
        return Promise.resolve();
      }
      pause(): void { /* no-op */ }
      stop(): void { /* no-op */ }
    }

    const player = new StubPlayer();
    await player.play('assets/audio/test.mp3', () => {
      ended = true;
    });

    expect(ended).toBe(true);
  });
});
