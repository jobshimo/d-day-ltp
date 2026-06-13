import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

/**
 * PrismaService wraps PrismaClient with lifecycle hooks for NestJS.
 *
 * Prisma 7 requires a driver adapter for PostgreSQL. PrismaPg reads
 * DATABASE_URL from the environment at construction time. In unit tests,
 * this class is fully mocked so no real connection is made.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const connectionString =
      process.env['DATABASE_URL'] ?? 'postgresql://localhost:5432/wargame';
    const adapter = new PrismaPg(connectionString);
    super({ adapter });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
