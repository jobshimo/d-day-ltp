import '@angular/compiler';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { provideZonelessChangeDetection, NgModule } from '@angular/core';

@NgModule({
  providers: [provideZonelessChangeDetection()],
})
class ZonelessTestModule {}

// Initialize Angular testing environment once.
// We do NOT register global beforeEach/afterEach cleanup hooks here because
// Angular 21's input.required() signal inputs cause NG0950 during teardown
// when TestBed is re-initialized between tests (the cleanup hook calls
// detectChanges on stale fixtures whose signal inputs are no longer bound).
// Each spec file is responsible for its own fixture lifecycle.
getTestBed().initTestEnvironment(
  [BrowserDynamicTestingModule, ZonelessTestModule],
  platformBrowserDynamicTesting(),
  { teardown: { destroyAfterEach: false } },
);
