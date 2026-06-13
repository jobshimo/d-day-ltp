import { Injectable } from '@nestjs/common';
import { ALL_MODULES, applyPatches } from 'content';
import type { CourseModule } from 'content-schema';

@Injectable()
export class AppService {
  private readonly modules: CourseModule[] = ALL_MODULES.map(applyPatches);

  getHealth(): { status: string } {
    return { status: 'ok' };
  }

  getModules(): Pick<CourseModule, 'id' | 'order' | 'titleEs' | 'descriptionEs' | 'requiredPriorModuleId'>[] {
    return this.modules.map(({ id, order, titleEs, descriptionEs, requiredPriorModuleId }) => ({
      id,
      order,
      titleEs,
      descriptionEs,
      requiredPriorModuleId,
    }));
  }

  getModuleById(id: string): CourseModule | null {
    return this.modules.find((m) => m.id === id) ?? null;
  }
}
