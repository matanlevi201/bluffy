import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/app-layout/app-layout').then((m) => m.AppLayout),
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./features/home/home').then((m) => m.Home),
      },
      {
        path: 'lobby',
        loadComponent: () =>
          import('./features/lobby/lobby').then((m) => m.Lobby),
      },
    ],
  },
  {
    path: 'signin',
    loadComponent: () =>
      import('./features/signin/signin').then((m) => m.Signin),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./features/signup/signup').then((m) => m.Signup),
  },
  { path: '**', redirectTo: 'signin' },
];
