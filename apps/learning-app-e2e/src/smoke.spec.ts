import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * E2E smoke tests for the learning-app.
 *
 * These tests validate the primary flows:
 *   1. Course map renders with module list; every module is freely accessible (any order).
 *   2. Module 4 is a normal module (no preview/lock) reachable directly.
 *
 * Run with: npx nx run learning-app-e2e:e2e
 * Requires: `nx serve learning-app` running on port 4200 (or set BASE_URL env var).
 */

test.describe('Course map', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders module list with at least 8 modules', async ({ page }) => {
    // Redirect: / -> /modules
    await expect(page).toHaveURL(/\/modules/);

    const heading = page.getByRole('heading', { name: 'D-Day en Omaha Beach' });
    await expect(heading).toBeVisible();

    // 8 module cards visible
    const moduleList = page.getByRole('list', { name: 'Lista de módulos del curso' });
    await expect(moduleList).toBeVisible();
    const items = moduleList.getByRole('listitem');
    await expect(items).toHaveCount(8);
  });

  test('Module 1 card is linked and accessible', async ({ page }) => {
    // Module 1 should have an <a> link (unlocked)
    const module1Link = page
      .getByRole('link')
      .filter({ hasText: /Módulo 1/ })
      .first();
    await expect(module1Link).toBeVisible();
    await expect(module1Link).toHaveAttribute('href', /module-1/);
  });

  test('Module 4 card is linked with no preview badge (free navigation)', async ({ page }) => {
    // Free navigation: Module 4 is a normal module — an accessible link with no "Avance" badge.
    const module4Link = page
      .getByRole('link')
      .filter({ hasText: /Módulo 4/ })
      .first();
    await expect(module4Link).toBeVisible();
    await expect(module4Link).toHaveAttribute('href', /module-4/);
    await expect(page.locator('.card__badge', { hasText: 'Avance' })).toHaveCount(0);
  });

  test('no WCAG 2.1 AA violations on course map', async ({ page }) => {
    await expect(page).toHaveURL(/\/modules/);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations).toHaveLength(0);
  });
});

test.describe('Module 1 — start flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear IndexedDB to start fresh each test run
    await page.goto('/');
    await page.evaluate(async () => {
      const dbs = await indexedDB.databases();
      for (const db of dbs) {
        if (db.name) {
          indexedDB.deleteDatabase(db.name);
        }
      }
    });
    await page.goto('/modules/module-1');
  });

  test('Module 1 home shows title and lessons list', async ({ page }) => {
    const heading = page.getByRole('heading', { name: /El juego y sus piezas/i, level: 1 });
    await expect(heading).toBeVisible();

    const lessonsSection = page.getByRole('region', { name: 'Lecciones' });
    await expect(lessonsSection).toBeVisible();

    // Should have at least 3 lessons
    const lessonLinks = lessonsSection.getByRole('link');
    const count = await lessonLinks.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('navigates to first lesson and shows content', async ({ page }) => {
    // Click first lesson link
    const firstLesson = page
      .getByRole('list', { name: 'Lista de lecciones' })
      .getByRole('link')
      .first();
    await firstLesson.click();

    await expect(page).toHaveURL(/lessons\//);

    // Lesson viewer should show a heading
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Breadcrumb navigation should be present (exact aria-label from BreadcrumbComponent)
    const breadcrumb = page.getByRole('navigation', { name: 'Navegación estructural' });
    await expect(breadcrumb).toBeVisible();
  });

  test('breadcrumb "Curso" link returns to course map', async ({ page }) => {
    const firstLesson = page
      .getByRole('list', { name: 'Lista de lecciones' })
      .getByRole('link')
      .first();
    await firstLesson.click();
    await expect(page).toHaveURL(/lessons\//);

    // Click "Curso" breadcrumb (within the structural breadcrumb nav)
    const courseLink = page.getByRole('navigation', { name: 'Navegación estructural' }).getByRole('link', { name: 'Curso' });
    await courseLink.click();
    await expect(page).toHaveURL(/\/modules$/);
  });

  test('no WCAG 2.1 AA violations on Module 1 home', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations).toHaveLength(0);
  });
});

test.describe('Module 4 — flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/modules/module-4');
  });

  test('Module 4 home shows heading and no preview banner (free navigation)', async ({ page }) => {
    // Free navigation: the "Vista previa" banner no longer exists.
    await expect(page.locator('.module-home__preview-badge')).toHaveCount(0);

    // Module heading
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
  });

  test('Module 4 home shows lessons section', async ({ page }) => {
    const lessonsSection = page.getByRole('region', { name: 'Lecciones' });
    await expect(lessonsSection).toBeVisible();
  });

  test('Module 4 lesson is navigable', async ({ page }) => {
    const firstLesson = page
      .getByRole('list', { name: 'Lista de lecciones' })
      .getByRole('link')
      .first();
    await firstLesson.click();
    await expect(page).toHaveURL(/modules\/module-4\/lessons\//);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('no WCAG 2.1 AA violations on Module 4 home', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations).toHaveLength(0);
  });
});
