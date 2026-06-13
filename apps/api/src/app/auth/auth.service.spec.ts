/**
 * AuthService unit tests.
 *
 * PrismaService and JwtService are fully mocked — no real DB or JWT.
 * Pattern follows the existing app.controller.spec.ts style (bypass DI,
 * instantiate directly).
 */
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import type { MockInstance } from 'vitest';
import { AuthService } from './auth.service';

// ---------- bcrypt mock ----------
vi.mock('bcrypt', () => ({
  hash: vi.fn().mockResolvedValue('$2b$12$hashedpassword'),
  compare: vi.fn(),
}));

import * as bcrypt from 'bcrypt';

// ---------- Minimal PrismaService stub ----------
function makePrismaStub() {
  return {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  };
}

// ---------- Minimal JwtService stub ----------
function makeJwtStub() {
  return {
    sign: vi.fn().mockReturnValue('signed-jwt-token'),
  };
}

// ---------- Factory ----------
function makeService(
  prismaOverrides?: Partial<ReturnType<typeof makePrismaStub>>,
  jwtOverrides?: Partial<ReturnType<typeof makeJwtStub>>,
) {
  const prisma = { ...makePrismaStub(), ...prismaOverrides } as unknown as Parameters<typeof AuthService>[0];
  const jwt = { ...makeJwtStub(), ...jwtOverrides } as unknown as Parameters<typeof AuthService>[1];
  // Bypass NestJS DI: construct directly
  return new (AuthService as unknown as new (p: typeof prisma, j: typeof jwt) => AuthService)(prisma, jwt);
}

describe('AuthService', () => {
  let bcryptHash: MockInstance;
  let bcryptCompare: MockInstance;

  beforeEach(() => {
    vi.clearAllMocks();
    bcryptHash = bcrypt.hash as unknown as MockInstance;
    bcryptCompare = bcrypt.compare as unknown as MockInstance;
    bcryptHash.mockResolvedValue('$2b$12$hashedpassword');
  });

  // ---- register ----

  describe('register()', () => {
    it('hashes the password with cost 12 and returns token + user', async () => {
      const prisma = makePrismaStub();
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: 'user-1',
        email: 'a@b.com',
        passwordHash: '$2b$12$hashedpassword',
        createdAt: new Date('2024-01-01'),
      });

      const service = makeService(prisma as unknown as Partial<ReturnType<typeof makePrismaStub>>);
      const result = await service.register('a@b.com', 'password123');

      expect(bcryptHash).toHaveBeenCalledWith('password123', 12);
      expect(result.token).toBe('signed-jwt-token');
      expect(result.user.email).toBe('a@b.com');
      expect(result.user.id).toBe('user-1');
    });

    it('throws 409 ConflictException on duplicate email (generic message)', async () => {
      const prisma = makePrismaStub();
      prisma.user.findUnique.mockResolvedValue({ id: 'existing', email: 'a@b.com' });

      const service = makeService(prisma as unknown as Partial<ReturnType<typeof makePrismaStub>>);
      await expect(service.register('a@b.com', 'password123')).rejects.toThrow(
        ConflictException,
      );
    });

    it('never returns passwordHash in the result', async () => {
      const prisma = makePrismaStub();
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: 'user-1',
        email: 'a@b.com',
        passwordHash: '$2b$12$hashedpassword',
        createdAt: new Date(),
      });

      const service = makeService(prisma as unknown as Partial<ReturnType<typeof makePrismaStub>>);
      const result = await service.register('a@b.com', 'password123');

      expect(result).not.toHaveProperty('passwordHash');
      expect(JSON.stringify(result)).not.toContain('passwordHash');
    });
  });

  // ---- login ----

  describe('login()', () => {
    it('returns token + user on valid credentials', async () => {
      const prisma = makePrismaStub();
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'a@b.com',
        passwordHash: '$2b$12$hashedpassword',
        createdAt: new Date('2024-01-01'),
      });
      bcryptCompare.mockResolvedValue(true);

      const service = makeService(prisma as unknown as Partial<ReturnType<typeof makePrismaStub>>);
      const result = await service.login('a@b.com', 'password123');

      expect(result.token).toBe('signed-jwt-token');
      expect(result.user.email).toBe('a@b.com');
    });

    it('throws 401 UnauthorizedException on wrong password (generic message)', async () => {
      const prisma = makePrismaStub();
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'a@b.com',
        passwordHash: '$2b$12$hashedpassword',
        createdAt: new Date(),
      });
      bcryptCompare.mockResolvedValue(false);

      const service = makeService(prisma as unknown as Partial<ReturnType<typeof makePrismaStub>>);
      await expect(service.login('a@b.com', 'wrongpassword')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('throws 401 UnauthorizedException on unknown email (same generic message)', async () => {
      const prisma = makePrismaStub();
      prisma.user.findUnique.mockResolvedValue(null);
      bcryptCompare.mockResolvedValue(false);

      const service = makeService(prisma as unknown as Partial<ReturnType<typeof makePrismaStub>>);
      await expect(service.login('unknown@b.com', 'password123')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('never returns passwordHash in the result', async () => {
      const prisma = makePrismaStub();
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'a@b.com',
        passwordHash: '$2b$12$hashedpassword',
        createdAt: new Date(),
      });
      bcryptCompare.mockResolvedValue(true);

      const service = makeService(prisma as unknown as Partial<ReturnType<typeof makePrismaStub>>);
      const result = await service.login('a@b.com', 'password123');

      expect(result).not.toHaveProperty('passwordHash');
      expect(JSON.stringify(result)).not.toContain('passwordHash');
    });
  });
});
