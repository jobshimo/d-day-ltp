import { Module } from '@nestjs/common';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    // AuthModule exports JwtAuthGuard + JwtModule — needed by controller guard
    AuthModule,
    // PrismaModule is @Global — no explicit import needed
  ],
  controllers: [ProgressController],
  providers: [ProgressService],
  exports: [ProgressService],
})
export class ProgressModule {}
