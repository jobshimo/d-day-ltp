import 'reflect-metadata';
import { describe, it, expect } from 'vitest';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpsertProgressDto } from './upsert-progress.dto';

/**
 * Regression: drillResults is a dictionary (Record<string, DrillResult>), not an
 * array. A previous DTO used @ValidateNested({ each: true }) + @Type(DrillResultDto),
 * which validated the dictionary AS a single DrillResultDto and rejected every PUT
 * with 400 — silently breaking progress saves (and drill navigation) for logged-in
 * users.
 */
describe('UpsertProgressDto', () => {
  async function validatePayload(payload: unknown) {
    const dto = plainToInstance(UpsertProgressDto, payload);
    return validate(dto);
  }

  it('accepts an empty drillResults dictionary', async () => {
    const errors = await validatePayload({
      moduleId: 'module-1',
      lessonsCompleted: [],
      drillResults: {},
      unlockedAt: '1970-01-01T00:00:00.000Z',
    });
    expect(errors).toHaveLength(0);
  });

  it('accepts a populated drillResults dictionary keyed by drill id', async () => {
    const errors = await validatePayload({
      moduleId: 'module-1',
      lessonsCompleted: ['lesson-1-1'],
      drillResults: {
        'drill-1': { answeredCorrectly: true, attempts: 1, completedAt: '2026-01-01T00:00:00.000Z' },
        'drill-2': { answeredCorrectly: false, attempts: 3, completedAt: '2026-01-02T00:00:00.000Z' },
      },
      quizResult: { score: 0.8, passed: true, completedAt: '2026-01-03T00:00:00.000Z' },
    });
    expect(errors).toHaveLength(0);
  });

  it('rejects a non-string moduleId', async () => {
    const errors = await validatePayload({
      moduleId: 123,
      lessonsCompleted: [],
      drillResults: {},
    });
    expect(errors.length).toBeGreaterThan(0);
  });
});
