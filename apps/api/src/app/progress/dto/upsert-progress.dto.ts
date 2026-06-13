import {
  IsString,
  IsArray,
  IsObject,
  IsOptional,
  IsBoolean,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class DrillResultDto {
  @IsBoolean()
  answeredCorrectly!: boolean;

  @IsNumber()
  attempts!: number;

  @IsString()
  completedAt!: string;
}

export class QuizResultDto {
  @IsNumber()
  score!: number;

  @IsBoolean()
  passed!: boolean;

  @IsString()
  completedAt!: string;
}

/**
 * DTO for PUT /api/progress/:moduleId — upserts the full ModuleProgress wire shape.
 * Wire shape must match libs/shared/content-schema ModuleProgress exactly.
 */
export class UpsertProgressDto {
  @IsString()
  moduleId!: string;

  @IsArray()
  @IsString({ each: true })
  lessonsCompleted!: string[];

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => DrillResultDto)
  drillResults!: Record<string, DrillResultDto>;

  @IsOptional()
  @ValidateNested()
  @Type(() => QuizResultDto)
  quizResult?: QuizResultDto;

  @IsOptional()
  @IsString()
  unlockedAt?: string;
}
