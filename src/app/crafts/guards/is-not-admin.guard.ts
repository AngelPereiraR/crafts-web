import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { AuthStatus } from 'src/app/auth/interfaces';

export const isNotAdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.currentUser) {
    return true;
  }

  if (authService.authStatus() === AuthStatus.notAuthenticated) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    authService.currentUser = null;
  }

  router.navigateByUrl('/');

  return false;
};
