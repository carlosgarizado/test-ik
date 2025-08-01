import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { ToastService } from '../services/toast.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  if (authService.isAuthenticated()) {
    return true;
  } else {
    toastService.error('Acceso denegado. Por favor inicia sesión.');
    router.navigate(['/module/select-route']);
    return false;
  }
};
