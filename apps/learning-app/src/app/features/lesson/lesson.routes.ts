import { Route } from '@angular/router';
import { DrillSequenceGuard } from '../drill/drill-sequence.guard';

export const lessonRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./module-home.component').then((m) => m.ModuleHomeComponent),
  },
  {
    path: 'lessons/:lessonId',
    loadComponent: () =>
      import('./lesson-viewer.component').then((m) => m.LessonViewerComponent),
  },
  {
    path: 'drills/:drillIndex',
    canActivate: [DrillSequenceGuard],
    loadComponent: () =>
      import('../drill/drill.component').then((m) => m.DrillComponent),
  },
  {
    path: 'quiz',
    canActivate: [DrillSequenceGuard],
    loadComponent: () =>
      import('../quiz/quiz.component').then((m) => m.QuizComponent),
  },
];
