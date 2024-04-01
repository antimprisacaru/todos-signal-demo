import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: '/todos',
    pathMatch: 'full',
  },
  {
    path: 'todos',
    loadComponent: () => import('./components/todos.component').then((c) => c.TodosComponent),
  },
  {
    path: '**',
    redirectTo: '/todos',
    pathMatch: 'full',
  },
];
