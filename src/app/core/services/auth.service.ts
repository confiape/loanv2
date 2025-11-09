import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of, BehaviorSubject } from 'rxjs';
import {AuthenticationApiService, LoginResponse} from '@loan/app/shared/openapi';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly authApi = inject(AuthenticationApiService);

  // State
  private readonly accessToken = signal<string | null>(null);
  private readonly isAuthenticatedSignal = signal<boolean>(false);
  private readonly isRefreshing = new BehaviorSubject<boolean>(false);

  // Public readonly signals
  public readonly token$ = this.accessToken.asReadonly();
  public readonly isAuthenticated$ = this.isAuthenticatedSignal.asReadonly();

  /**
   * Get the current access token
   */
  getToken(): string | null {
    return this.accessToken();
  }

  /**
   * Set the access token
   */
  setToken(token: string): void {
    this.accessToken.set(token);
    this.isAuthenticatedSignal.set(true);
  }

  /**
   * Clear the access token
   */
  clearToken(): void {
    this.accessToken.set(null);
    this.isAuthenticatedSignal.set(false);
  }

  /**
   * Check if user is authenticated by calling the API
   */
  checkAuthentication(): Observable<boolean> {
    return this.authApi.isAuthenticated().pipe(
      tap((isAuth) => {
        this.isAuthenticatedSignal.set(isAuth);
        if (!isAuth) {
          this.clearToken();
        }
      }),
      catchError(() => {
        this.clearToken();
        return of(false);
      }),
    );
  }

  /**
   * Get authorization token from API
   * This should be called after login to get the access token
   */
  getAuthorizationToken(): Observable<LoginResponse> {
    return this.authApi.getAuthorizationToken().pipe(
      tap((response) => {
        if (response.accessToken) {
          this.setToken(response.accessToken);
        }
      }),
      catchError((error) => {
        this.clearToken();
        throw error;
      }),
    );
  }

  /**
   * Refresh the authentication token
   * Called when token expires (401/403)
   */
  refreshToken(): Observable<LoginResponse> {
    if (this.isRefreshing.value) {
      // Already refreshing, wait for it to complete
      return new Observable((observer) => {
        const subscription = this.isRefreshing.subscribe((isRefreshing) => {
          if (!isRefreshing && this.accessToken()) {
            observer.next({
              accessToken: this.accessToken()!,
            } as LoginResponse);
            observer.complete();
          }
        });

        return () => subscription.unsubscribe();
      });
    }

    this.isRefreshing.next(true);

    return this.authApi.getAuthorizationToken().pipe(
      tap((response) => {
        if (response.accessToken) {
          this.setToken(response.accessToken);
        }
        this.isRefreshing.next(false);
      }),
      catchError((error) => {
        this.clearToken();
        this.isRefreshing.next(false);
        throw error;
      }),
    );
  }

  /**
   * Navigate to login page
   */
  navigateToLogin(): void {
    this.clearToken();
    this.router.navigate(['/login']);
  }

  /**
   * Logout user
   */
  logout(): Observable<void> {
    return this.authApi.logOut().pipe(
      tap(() => {
        this.clearToken();
        this.navigateToLogin();
      }),
      catchError(() => {
        // Even if logout fails, clear local state
        this.clearToken();
        this.navigateToLogin();
        return of(undefined);
      }),
    );
  }
}
