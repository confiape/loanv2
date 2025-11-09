import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import {ToastService} from '@loan/app/shared/components/toast/toast.service';

/**
 * Public endpoints that should not retry
 */
const NO_RETRY_ENDPOINTS = [
  '/api/Authentication/IsAuthenticated',
  '/api/Authentication/LoginWithGoogleToken',
  '/api/Authentication/GetAuthorizationToken',
  '/api/Authentication/LogIn',
  '/api/Authentication/LogOut',
];

/**
 * Check if the request URL should not be retried
 */
function shouldNotRetry(url: string): boolean {
  return NO_RETRY_ENDPOINTS.some((endpoint) => url.includes(endpoint));
}

/**
 * Token Retry Interceptor
 *
 * This interceptor handles expired or invalid tokens:
 * 1. Catches 401/403 errors
 * 2. Attempts to refresh the token by calling getAuthorizationToken()
 * 3. Retries the original request with the new token
 * 4. If refresh fails, shows error message and redirects to login
 */
export const tokenRetryInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Only handle 401 and 403 errors
      if (error.status !== 401 && error.status !== 403) {
        return throwError(() => error);
      }

      // Don't retry auth endpoints
      if (shouldNotRetry(req.url)) {
        return throwError(() => error);
      }

      // Attempt to refresh the token
      return authService.refreshToken().pipe(
        switchMap((response) => {
          // Successfully refreshed token, retry the original request
          const retryReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${response.accessToken}`,
            },
          });

          return next(retryReq);
        }),
        catchError((refreshError) => {
          // Failed to refresh token
          toastService.error(
            'No tienes permisos para realizar esta acción o tu sesión ha expirado',
            'Sin Permisos',
          );

          // Redirect to login
          authService.navigateToLogin();

          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
