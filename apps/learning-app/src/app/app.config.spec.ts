import { describe, it, expect } from 'vitest';
import { IdbProgressRepository } from 'infrastructure-idb-adapter';
import { HttpProgressRepository } from 'infrastructure-http-progress-adapter';
import { selectProgressRepo } from './app.config';

describe('selectProgressRepo', () => {
  it('returns IdbProgressRepository when hasToken is false', () => {
    expect(selectProgressRepo(false)).toBe(IdbProgressRepository);
  });

  it('returns HttpProgressRepository when hasToken is true', () => {
    expect(selectProgressRepo(true)).toBe(HttpProgressRepository);
  });
});
