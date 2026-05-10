import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuth = authService.isAuthenticated();
  console.log('[AuthGuard] Checking access...', { isAuth });

  if (!isAuth) {
    console.warn('[AuthGuard] Access denied, redirecting to /login');
    router.navigate(['/login']);
    return false;
  }

  console.log('[AuthGuard] Access granted');
  return true;
};
