import { Route } from '@angular/router';
import { guestOnlyGuard } from './shared/guest-only.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component'),
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
    path: 'historia',
    loadComponent: () => import('./features/historia/historia.component'),
  },
  {
    path: 'simbologia',
    loadComponent: () =>
      import('./features/simbologia/simbologia.component').then((m) => m.SimbologiaComponent),
  },
  {
    path: 'preparacion',
    loadComponent: () =>
      import('./features/preparacion/preparacion.component').then((m) => m.PreparacionComponent),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./features/settings/settings.component').then((m) => m.SettingsComponent),
  },
  {
    path: 'login',
    canActivate: [guestOnlyGuard],
    loadComponent: () =>
      import('./features/auth/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    canActivate: [guestOnlyGuard],
    loadComponent: () =>
      import('./features/auth/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: '**',
    redirectTo: 'modules',
  },
];
