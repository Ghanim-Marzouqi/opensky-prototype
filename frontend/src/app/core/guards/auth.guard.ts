import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  // Check role-based access
  const requiredRole = route.data['role'] as string | undefined;
  if (requiredRole && auth.userRole() !== requiredRole) {
    // Redirect to user's default route if they try to access wrong module
    router.navigate([auth.getDefaultRoute()]);
    return false;
  }

  return true;
};

export const loginGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    router.navigate([auth.getDefaultRoute()]);
    return false;
  }

  return true;
};
