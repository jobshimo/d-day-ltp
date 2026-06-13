import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpsertProgressDto } from './upsert-progress.dto';

/**
 * DTO for POST /api/progress/migrate — bulk upsert of guest ModuleProgress entries
 * sent from the client on first login.
 */
export class MigrateDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpsertProgressDto)
  entries!: UpsertProgressDto[];
}
