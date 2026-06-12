/**
 * API surface tests — e2e-style.
 *
 * Tests AppService (data layer) and AppController (routing + exception handling)
 * directly, bypassing the NestJS DI container to avoid the emitDecoratorMetadata
 * requirement that esbuild does not support at test time.
 */
import { NotFoundException } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

function makeController(): AppController {
  const service = new AppService();
  // Bypass DI: directly assign the service instance
  const ctrl = new AppController(service);
  return ctrl;
}

describe('AppController — API surface', () => {
  let controller: AppController;

  beforeEach(() => {
    controller = makeController();
  });

  // ---- GET /api/health ----

  describe('GET /api/health', () => {
    it('returns { status: "ok" }', () => {
      expect(controller.getHealth()).toEqual({ status: 'ok' });
    });
  });

  // ---- GET /api/modules ----

  describe('GET /api/modules', () => {
    it('returns an array of module summaries', () => {
      const modules = controller.getModules();
      expect(Array.isArray(modules)).toBe(true);
      expect(modules.length).toBeGreaterThan(0);
    });

    it('each summary has id, order, titleEs, descriptionEs', () => {
      const modules = controller.getModules();
      for (const mod of modules) {
        expect(mod).toHaveProperty('id');
        expect(mod).toHaveProperty('order');
        expect(mod).toHaveProperty('titleEs');
        expect(mod).toHaveProperty('descriptionEs');
      }
    });

    it('does NOT include lessons, drills, or reviewQuiz arrays', () => {
      const modules = controller.getModules();
      for (const mod of modules) {
        expect(mod).not.toHaveProperty('lessons');
        expect(mod).not.toHaveProperty('drills');
        expect(mod).not.toHaveProperty('reviewQuiz');
      }
    });

    it('includes module-1 with order 1', () => {
      const modules = controller.getModules();
      const m1 = modules.find((m) => m.id === 'module-1');
      expect(m1).toBeTruthy();
      expect(m1?.order).toBe(1);
    });

    it('module-4 has requiredPriorModuleId undefined (preview)', () => {
      const modules = controller.getModules();
      const m4 = modules.find((m) => m.id === 'module-4');
      expect(m4).toBeTruthy();
      expect(m4?.requiredPriorModuleId).toBeUndefined();
    });
  });

  // ---- GET /api/modules/:id ----

  describe('GET /api/modules/:id', () => {
    it('returns the full CourseModule for a known id', () => {
      const mod = controller.getModuleById('module-1');
      expect(mod).toBeTruthy();
      expect(mod.id).toBe('module-1');
    });

    it('returned module includes lessons, drills, and reviewQuiz arrays', () => {
      const mod = controller.getModuleById('module-1');
      expect(Array.isArray(mod.lessons)).toBe(true);
      expect(Array.isArray(mod.drills)).toBe(true);
      expect(Array.isArray(mod.reviewQuiz)).toBe(true);
    });

    it('throws NotFoundException for an unknown module id', () => {
      expect(() => controller.getModuleById('module-999')).toThrow(NotFoundException);
    });

    it('module-4 is accessible and has drills', () => {
      const mod = controller.getModuleById('module-4');
      expect(mod).toBeTruthy();
      expect(Array.isArray(mod.drills)).toBe(true);
      expect(mod.drills.length).toBeGreaterThan(0);
    });
  });
});
