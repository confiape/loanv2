import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '@loan/app/core/services/auth.service';

/**
 * Login Guard
 *
 * This guard prevents authenticated users from accessing the login page.
 * If the user is already authenticated, they will be redirected to the dashboard.
 *
 * Usage:
 * ```typescript
 * {
 *   path: 'login',
 *   component: LoginComponent,
 *   canActivate: [loginGuard]
 * }
 * ```
 */
export const loginGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user has a token first (quick check)
  const token = authService.getToken();

  if (token) {
    // User has a token, redirect to dashboard
    router.navigate(['/dashboard']);
    return false;
  }

  // No token, verify authentication status with the API
  return authService.checkAuthentication().pipe(
    map((isAuthenticated) => {
      if (isAuthenticated) {
        // User is authenticated, redirect to dashboard
        router.navigate(['/dashboard']);
        return false;
      } else {
        // Not authenticated, allow access to login page
        return true;
      }
    }),
    catchError(() => {
      // Error checking authentication, assume not authenticated
      // Allow access to login page
      return of(true);
    }),
  );
};
