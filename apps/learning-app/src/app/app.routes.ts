import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'modules',
    pathMatch: 'full',
  },
  {
    path: 'modules',
    loadComponent: () =>
      import('./features/course-map/course-map.component').then((m) => m.CourseMapComponent),
  },
  {
    path: 'modules/:moduleId',
    loadChildren: () => import('./features/lesson/lesson.routes').then((m) => m.lessonRoutes),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./features/settings/settings.component').then((m) => m.SettingsComponent),
  },
  {
    path: '**',
    redirectTo: 'modules',
  },
];
