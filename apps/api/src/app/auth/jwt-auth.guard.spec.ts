/**
 * JwtAuthGuard unit tests.
 *
 * JwtService is mocked. No HTTP server, no NestJS DI container.
 */
import { UnauthorizedException } from '@nestjs/common';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { JwtAuthGuard } from './jwt-auth.guard';

// Minimal ExecutionContext builder
function makeContext(authHeader?: string) {
  const request = {
    headers: authHeader ? { authorization: authHeader } : {},
    user: undefined as unknown,
  };
  return {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
    request,
  };
}

function makeJwtStub(verifyResult: unknown = { sub: 'user-1', email: 'a@b.com' }) {
  return {
    verify: vi.fn().mockReturnValue(verifyResult),
  };
}

function makeGuard(jwtStub = makeJwtStub()) {
  return new (JwtAuthGuard as unknown as new (j: typeof jwtStub) => JwtAuthGuard)(
    jwtStub as unknown as Parameters<typeof JwtAuthGuard>[0],
  );
}

describe('JwtAuthGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns true and attaches user when token is valid', () => {
    const jwtStub = makeJwtStub({ sub: 'user-1', email: 'a@b.com' });
    const guard = makeGuard(jwtStub);
    const ctx = makeContext('Bearer valid-token');

    const result = guard.canActivate(ctx as unknown as Parameters<typeof guard.canActivate>[0]);

    expect(result).toBe(true);
    expect((ctx.request as { user: { userId: string; email: string } }).user).toEqual({
      userId: 'user-1',
      email: 'a@b.com',
    });
    expect(jwtStub.verify).toHaveBeenCalledWith('valid-token');
  });

  it('throws 401 UnauthorizedException when Authorization header is missing', () => {
    const guard = makeGuard();
    const ctx = makeContext();

    expect(() =>
      guard.canActivate(ctx as unknown as Parameters<typeof guard.canActivate>[0]),
    ).toThrow(UnauthorizedException);
  });

  it('throws 401 UnauthorizedException when token is invalid (JwtService.verify throws)', () => {
    const jwtStub = { verify: vi.fn().mockImplementation(() => { throw new Error('invalid'); }) };
    const guard = makeGuard(jwtStub);
    const ctx = makeContext('Bearer bad-token');

    expect(() =>
      guard.canActivate(ctx as unknown as Parameters<typeof guard.canActivate>[0]),
    ).toThrow(UnauthorizedException);
  });

  it('throws 401 when Authorization header has wrong format (no Bearer prefix)', () => {
    const guard = makeGuard();
    const ctx = makeContext('Token abc123');

    expect(() =>
      guard.canActivate(ctx as unknown as Parameters<typeof guard.canActivate>[0]),
    ).toThrow(UnauthorizedException);
  });
});
