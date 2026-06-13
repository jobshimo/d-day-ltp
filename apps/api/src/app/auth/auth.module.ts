import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PrismaModule } from '../prisma/prisma.module';

// In development/test, fall back to a local-only secret.
// In production, JWT_SECRET MUST be set — the startup check in main.ts enforces this.
const JWT_SECRET_DEV_FALLBACK = 'dev-only-secret-do-not-use-in-production';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret:
          process.env['NODE_ENV'] === 'production'
            ? process.env['JWT_SECRET']!
            : (process.env['JWT_SECRET'] ?? JWT_SECRET_DEV_FALLBACK),
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],
  exports: [JwtAuthGuard, JwtModule],
})
export class AuthModule {}
