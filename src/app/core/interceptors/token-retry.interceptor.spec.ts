import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { of, throwError } from 'rxjs';
import { vi, Mock } from 'vitest';
import { AuthService } from '../services/auth.service';
import {LoginResponse} from '@loan/app/shared/openapi';
import {ToastService} from '@loan/app/shared/components/toast/toast.service';
import {tokenRetryInterceptor} from '@loan/app/core/interceptors/token-retry.interceptor';


describe('tokenRetryInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let authService: {
    refreshToken: Mock;
    navigateToLogin: Mock;
  };
  let toastService: {
    error: Mock;
  };

  const mockLoginResponse: LoginResponse = {
    user: {
      name: 'Test User',
      dni: '12345678',
      phoneNumber: '123456789',
    },
    accessToken: 'new-access-token',
    tokenType: 'Bearer',
  };

  beforeEach(() => {
    authService = {
      refreshToken: vi.fn() as Mock,
      navigateToLogin: vi.fn() as Mock,
    };

    toastService = {
      error: vi.fn() as Mock,
    };

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(withInterceptors([tokenRetryInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authService },
        { provide: ToastService, useValue: toastService },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('401 Unauthorized Errors', () => {
    it('should retry request after refreshing token on 401 error', () => {
      authService.refreshToken!.mockReturnValue(of(mockLoginResponse));

      httpClient.get('/api/users').subscribe((response) => {
        expect(response).toEqual([{ id: 1, name: 'Test' }]);
      });

      // First request fails with 401
      const req1 = httpTestingController.expectOne('/api/users');
      req1.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

      // Expect refresh to be called
      expect(authService.refreshToken).toHaveBeenCalled();

      // Second request (retry) succeeds
      const req2 = httpTestingController.expectOne('/api/users');
      expect(req2.request.headers.get('Authorization')).toBe('Bearer new-access-token');
      req2.flush([{ id: 1, name: 'Test' }]);
    });

    it('should show error and redirect to login if refresh fails on 401', () => {
      authService.refreshToken!.mockReturnValue(throwError(() => new Error('Refresh failed')));

      httpClient.get('/api/users').subscribe({
        next: () => {
          // Expected path
        },
        error: () => {
          // Error case
        },
      });

      // First request fails with 401
      const req = httpTestingController.expectOne('/api/users');
      req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

      expect(authService.refreshToken).toHaveBeenCalled();
      expect(toastService.error).toHaveBeenCalledWith(
        'No tienes permisos para realizar esta acción o tu sesión ha expirado',
        'Sin Permisos',
      );
      expect(authService.navigateToLogin).toHaveBeenCalled();
    });
  });

  describe('403 Forbidden Errors', () => {
    it('should retry request after refreshing token on 403 error', () => {
      authService.refreshToken!.mockReturnValue(of(mockLoginResponse));

      httpClient.get('/api/users').subscribe((response) => {
        expect(response).toEqual([{ id: 1, name: 'Test' }]);
      });

      // First request fails with 403
      const req1 = httpTestingController.expectOne('/api/users');
      req1.flush({ message: 'Forbidden' }, { status: 403, statusText: 'Forbidden' });

      expect(authService.refreshToken).toHaveBeenCalled();

      // Second request (retry) succeeds
      const req2 = httpTestingController.expectOne('/api/users');
      expect(req2.request.headers.get('Authorization')).toBe('Bearer new-access-token');
      req2.flush([{ id: 1, name: 'Test' }]);
    });

    it('should show error and redirect to login if refresh fails on 403', () => {
      authService.refreshToken!.mockReturnValue(throwError(() => new Error('Refresh failed')));

      httpClient.get('/api/users').subscribe({
        next: () => {
          // Expected path
        },
        error: () => {
          // Error case
        },
      });

      // First request fails with 403
      const req = httpTestingController.expectOne('/api/users');
      req.flush({ message: 'Forbidden' }, { status: 403, statusText: 'Forbidden' });

      expect(toastService.error).toHaveBeenCalledWith(
        'No tienes permisos para realizar esta acción o tu sesión ha expirado',
        'Sin Permisos',
      );
      expect(authService.navigateToLogin).toHaveBeenCalled();
    });
  });

  describe('Other HTTP Errors', () => {
    it('should not retry on 404 error', () => {
      httpClient.get('/api/users').subscribe({
        next: () => {
          // Expected path
        },
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpTestingController.expectOne('/api/users');
      req.flush({ message: 'Not Found' }, { status: 404, statusText: 'Not Found' });

      expect(authService.refreshToken).not.toHaveBeenCalled();
    });

    it('should not retry on 500 error', () => {
      httpClient.get('/api/users').subscribe({
        next: () => {
          // Expected path
        },
        error: (error) => {
          expect(error.status).toBe(500);
        },
      });

      const req = httpTestingController.expectOne('/api/users');
      req.flush(
        { message: 'Internal Server Error' },
        { status: 500, statusText: 'Internal Server Error' },
      );

      expect(authService.refreshToken).not.toHaveBeenCalled();
    });
  });

  describe('Authentication Endpoints', () => {
    it('should not retry authentication endpoints on 401', () => {
      httpClient.post('/api/Authentication/LogIn', {}).subscribe({
        next: () => {
          // Expected path
        },
        error: (error) => {
          expect(error.status).toBe(401);
        },
      });

      const req = httpTestingController.expectOne('/api/Authentication/LogIn');
      req.flush({ message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });

      expect(authService.refreshToken).not.toHaveBeenCalled();
    });

    it('should not retry GetAuthorizationToken endpoint on 401', () => {
      httpClient.post('/api/Authentication/GetAuthorizationToken', {}).subscribe({
        next: () => {
          // Expected path
        },
        error: (error) => {
          expect(error.status).toBe(401);
        },
      });

      const req = httpTestingController.expectOne('/api/Authentication/GetAuthorizationToken');
      req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

      expect(authService.refreshToken).not.toHaveBeenCalled();
    });

    it('should not retry IsAuthenticated endpoint on 401', () => {
      httpClient.get('/api/Authentication/IsAuthenticated').subscribe({
        next: () => {
          // Expected path
        },
        error: (error) => {
          expect(error.status).toBe(401);
        },
      });

      const req = httpTestingController.expectOne('/api/Authentication/IsAuthenticated');
      req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

      expect(authService.refreshToken).not.toHaveBeenCalled();
    });
  });

  describe('Successful Requests', () => {
    it('should not intercept successful requests', () => {
      httpClient.get('/api/users').subscribe((response) => {
        expect(response).toEqual([{ id: 1, name: 'Test' }]);
      });

      const req = httpTestingController.expectOne('/api/users');
      req.flush([{ id: 1, name: 'Test' }]);

      expect(authService.refreshToken).not.toHaveBeenCalled();
    });
  });
});
