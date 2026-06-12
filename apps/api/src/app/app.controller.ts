import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHealth(): { status: string } {
    return this.appService.getHealth();
  }

  @Get('modules')
  getModules() {
    return this.appService.getModules();
  }

  @Get('modules/:id')
  getModuleById(@Param('id') id: string) {
    const module = this.appService.getModuleById(id);
    if (!module) {
      throw new NotFoundException(`Module '${id}' not found`);
    }
    return module;
  }
}
