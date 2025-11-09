import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

/**
 * Public endpoints that don't require authentication
 */
const PUBLIC_ENDPOINTS = [
  '/api/Authentication/IsAuthenticated',
  '/api/Authentication/LoginWithGoogleToken',
  '/api/Authentication/GetAuthorizationToken',
  '/api/Authentication/LogIn',
  '/api/Authentication/LogOut',
];

/**
 * Check if the request URL is a public endpoint
 */
function isPublicEndpoint(url: string): boolean {
  return PUBLIC_ENDPOINTS.some((endpoint) => url.includes(endpoint));
}

/**
 * Authentication Interceptor
 *
 * This interceptor:
 * 1. Checks if user is authenticated before making requests
 * 2. Adds Authorization header with Bearer token to all requests
 * 3. Redirects to login if not authenticated (except for public endpoints)
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Skip authentication for public endpoints
  if (isPublicEndpoint(req.url)) {
    return next(req);
  }

  // Get the access token
  const token = authService.getToken();

  // Clone request and add Authorization header if token exists
  let authReq = req;
  if (token) {
    console.log(token);
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Check authentication status before proceeding
  // Only check if we don't have a token yet
  if (!token) {
    return authService.checkAuthentication().pipe(
      switchMap((isAuthenticated) => {
        if (!isAuthenticated) {
          // Not authenticated, redirect to login
          authService.navigateToLogin();
          return throwError(() => new Error('Not authenticated'));
        }

        // After verifying authentication, try to get authorization token
        return authService.getAuthorizationToken().pipe(
          switchMap((response) => {
            // Clone request with new token
            const tokenReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${response.accessToken}`,
              },
            });
            return next(tokenReq);
          }),
          catchError((error) => {
            // Failed to get authorization token, redirect to login
            authService.navigateToLogin();
            return throwError(() => error);
          }),
        );
      }),
      catchError((error) => {
        // Failed to check authentication, redirect to login
        authService.navigateToLogin();
        return throwError(() => error);
      }),
    );
  }

  // Token exists, proceed with request
  return next(authReq);
};
