import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'demo' },
  {
    path: 'demo',
    pathMatch: 'full',
    loadComponent: () =>
      import('./features/demo/demo.component').then((m) => m.DemoComponent),
  },
];
