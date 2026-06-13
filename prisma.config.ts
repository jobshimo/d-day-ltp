import { defineConfig } from 'prisma/config';

// prisma.config.ts is used by the Prisma CLI (migrate, generate, validate).
// The PrismaClient adapter (PrismaPg) is configured in PrismaService at runtime.
export default defineConfig({
  earlyAccess: true,
  schema: './prisma/schema.prisma',
  datasource: {
    url:
      process.env['DATABASE_URL'] ??
      'postgresql://localhost:5432/wargame',
  },
});
