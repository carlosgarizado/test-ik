import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'module',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./pages/login/login.page').then((m) => m.LoginPage),
      },
      {
        path: 'select-route',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/select-route/select-route.page').then(
            (m) => m.SelectRoutePage
          ),
      },
      {
        path: 'confirmation-route',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/confirmation-route/confirmation-route.page').then(
            (m) => m.ConfirmationRoutePage
          ),
      },
      {
        path: 'qr-scanner',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/qr-scanner/qr-scanner.page').then(
            (m) => m.QrScannerPage
          ),
      },
      {
        path: 'dashboard',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/dashboard/dashboard.page').then(
            (m) => m.DashboardPage
          ),
      },
    ],
  },
  {
    path: 'error',
    loadComponent: () =>
      import('./pages/error/error.page').then((m) => m.ErrorPage),
  },
  {
    path: '',
    redirectTo: 'module/login',
    pathMatch: 'full',
  },
];
