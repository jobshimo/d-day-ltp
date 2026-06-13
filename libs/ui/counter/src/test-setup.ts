import '@angular/compiler';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { provideZonelessChangeDetection, NgModule } from '@angular/core';
import { beforeEach, afterEach } from 'vitest';
import { ɵgetCleanupHook as getCleanupHook } from '@angular/core/testing';

@NgModule({
  providers: [provideZonelessChangeDetection()],
})
class ZonelessTestModule {}

getTestBed().initTestEnvironment(
  [BrowserDynamicTestingModule, ZonelessTestModule],
  platformBrowserDynamicTesting(),
  { teardown: { destroyAfterEach: true } },
);

beforeEach(getCleanupHook(false));
afterEach(getCleanupHook(true));
