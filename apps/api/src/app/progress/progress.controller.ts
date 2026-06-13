import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../auth/current-user.decorator';
import { ProgressService } from './progress.service';
import { UpsertProgressDto } from './dto/upsert-progress.dto';
import { MigrateDto } from './dto/migrate.dto';
import type { ModuleProgress } from 'content-schema';

@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  /** GET /api/progress — all modules for the authenticated user */
  @Get()
  async getAll(@CurrentUser() user: CurrentUserPayload): Promise<ModuleProgress[]> {
    return this.progressService.getAllModuleProgress(user.userId);
  }

  /** GET /api/progress/:moduleId — single module (returns default if no row) */
  @Get(':moduleId')
  async getOne(
    @CurrentUser() user: CurrentUserPayload,
    @Param('moduleId') moduleId: string,
  ): Promise<ModuleProgress> {
    return this.progressService.getModuleProgress(user.userId, moduleId);
  }

  /** PUT /api/progress/:moduleId — full ModuleProgress upsert */
  @Put(':moduleId')
  async upsert(
    @CurrentUser() user: CurrentUserPayload,
    @Param('moduleId') moduleId: string,
    @Body() dto: UpsertProgressDto,
  ): Promise<ModuleProgress> {
    // Use moduleId from URL (authoritative); ignore any moduleId in body to prevent spoofing
    const wire: ModuleProgress = {
      moduleId,
      lessonsCompleted: dto.lessonsCompleted,
      drillResults: dto.drillResults,
      quizResult: dto.quizResult,
      unlockedAt: dto.unlockedAt,
    };
    return this.progressService.upsertModuleProgress(user.userId, wire);
  }

  /** POST /api/progress/reset — delete all rows for the user */
  @Post('reset')
  @HttpCode(HttpStatus.NO_CONTENT)
  async reset(@CurrentUser() user: CurrentUserPayload): Promise<void> {
    await this.progressService.resetProgress(user.userId);
  }

  /** POST /api/progress/migrate — bulk upsert from guest IDB data */
  @Post('migrate')
  async migrate(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: MigrateDto,
  ): Promise<{ imported: number }> {
    const count = await this.progressService.migrate(user.userId, dto.entries);
    return { imported: count };
  }
}
