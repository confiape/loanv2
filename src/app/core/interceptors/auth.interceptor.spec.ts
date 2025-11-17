import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi, Mock, afterEach } from 'vitest';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';
import { LoginResponse } from '@loan/app/shared/openapi';

describe('authInterceptor', () => {
  const mockLoginResponse: LoginResponse = {
    user: {
      name: 'Test User',
      dni: '12345678',
      phoneNumber: '123456789',
    },
    accessToken: 'mock-access-token',
    tokenType: 'Bearer',
  };

  function setupTestBed(authService: Record<string, Mock>, router: Record<string, Mock>) {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    });

    const httpClient = TestBed.inject(HttpClient);
    const httpTestingController = TestBed.inject(HttpTestingController);

    afterEach(() => {
      httpTestingController.verify();
    });

    return { httpClient, httpTestingController };
  }

  describe('Public Endpoints', () => {
    it('should allow request to public endpoint without token', () => {
      // Arrange
      const authService = {
        getToken: vi.fn() as Mock,
        checkAuthentication: vi.fn() as Mock,
        getAuthorizationToken: vi.fn() as Mock,
        navigateToLogin: vi.fn() as Mock,
      };
      const router = { navigate: vi.fn() as Mock };

      const { httpClient, httpTestingController } = setupTestBed(authService, router);

      // Act
      httpClient.get('/api/Authentication/IsAuthenticated').subscribe();

      // Assert
      const req = httpTestingController.expectOne('/api/Authentication/IsAuthenticated');
      expect(req.request.headers.has('Authorization')).toBe(false);
      req.flush(true);
    });

    it('should allow login endpoint', () => {
      // Arrange
      const authService = {
        getToken: vi.fn() as Mock,
        checkAuthentication: vi.fn() as Mock,
        getAuthorizationToken: vi.fn() as Mock,
        navigateToLogin: vi.fn() as Mock,
      };
      const router = { navigate: vi.fn() as Mock };

      const { httpClient, httpTestingController } = setupTestBed(authService, router);

      // Act
      httpClient.post('/api/Authentication/LogIn', {}).subscribe();

      // Assert
      const req = httpTestingController.expectOne('/api/Authentication/LogIn');
      expect(req.request.headers.has('Authorization')).toBe(false);
      req.flush({});
    });

    it('should allow GetAuthorizationToken endpoint', () => {
      // Arrange
      const authService = {
        getToken: vi.fn() as Mock,
        checkAuthentication: vi.fn() as Mock,
        getAuthorizationToken: vi.fn() as Mock,
        navigateToLogin: vi.fn() as Mock,
      };
      const router = { navigate: vi.fn() as Mock };

      const { httpClient, httpTestingController } = setupTestBed(authService, router);

      // Act
      httpClient.post('/api/Authentication/GetAuthorizationToken', {}).subscribe();

      // Assert
      const req = httpTestingController.expectOne('/api/Authentication/GetAuthorizationToken');
      expect(req.request.headers.has('Authorization')).toBe(false);
      req.flush(mockLoginResponse);
    });
  });

  describe('Authenticated Requests', () => {
    it('should add Authorization header when token exists', () => {
      // Arrange
      const authService = {
        getToken: vi.fn(() => 'test-token') as Mock,
        checkAuthentication: vi.fn() as Mock,
        getAuthorizationToken: vi.fn() as Mock,
        navigateToLogin: vi.fn() as Mock,
      };
      const router = { navigate: vi.fn() as Mock };

      const { httpClient, httpTestingController } = setupTestBed(authService, router);

      // Act
      httpClient.get('/api/users').subscribe();

      // Assert
      const req = httpTestingController.expectOne('/api/users');
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
      req.flush([]);
    });

    it('should proceed with request when token exists', () => {
      // Arrange
      const authService = {
        getToken: vi.fn(() => 'test-token') as Mock,
        checkAuthentication: vi.fn() as Mock,
        getAuthorizationToken: vi.fn() as Mock,
        navigateToLogin: vi.fn() as Mock,
      };
      const router = { navigate: vi.fn() as Mock };

      const { httpClient, httpTestingController } = setupTestBed(authService, router);

      // Act & Assert
      httpClient.get('/api/users').subscribe((response) => {
        expect(response).toEqual([{ id: 1, name: 'Test' }]);
      });

      const req = httpTestingController.expectOne('/api/users');
      req.flush([{ id: 1, name: 'Test' }]);
    });
  });

  describe('Unauthenticated Requests', () => {
    it('should check authentication when no token exists', () => {
      // Arrange
      const authService = {
        getToken: vi.fn(() => null) as Mock,
        checkAuthentication: vi.fn(() => of(false)) as Mock,
        getAuthorizationToken: vi.fn() as Mock,
        navigateToLogin: vi.fn() as Mock,
      };
      const router = { navigate: vi.fn() as Mock };

      const { httpClient } = setupTestBed(authService, router);

      // Act
      httpClient.get('/api/users').subscribe({
        next: () => {
          // Expected path
        },
        error: () => {
          // Error case
        },
      });

      // Assert
      expect(authService.checkAuthentication).toHaveBeenCalled();
      expect(authService.navigateToLogin).toHaveBeenCalled();
    });

    it('should redirect to login when not authenticated', () => {
      // Arrange
      const authService = {
        getToken: vi.fn(() => null) as Mock,
        checkAuthentication: vi.fn(() => of(false)) as Mock,
        getAuthorizationToken: vi.fn() as Mock,
        navigateToLogin: vi.fn() as Mock,
      };
      const router = { navigate: vi.fn() as Mock };

      const { httpClient } = setupTestBed(authService, router);

      // Act
      httpClient.get('/api/users').subscribe({
        next: () => {
          // Expected path
        },
        error: (error) => {
          expect(error.message).toBe('Not authenticated');
        },
      });

      // Assert
      expect(authService.navigateToLogin).toHaveBeenCalled();
    });

    it('should get authorization token after successful authentication check', () => {
      // Arrange
      const authService = {
        getToken: vi.fn(() => null) as Mock,
        checkAuthentication: vi.fn(() => of(true)) as Mock,
        getAuthorizationToken: vi.fn(() => of(mockLoginResponse)) as Mock,
        navigateToLogin: vi.fn() as Mock,
      };
      const router = { navigate: vi.fn() as Mock };

      const { httpClient, httpTestingController } = setupTestBed(authService, router);

      // Act
      httpClient.get('/api/users').subscribe();

      // Assert
      expect(authService.checkAuthentication).toHaveBeenCalled();
      expect(authService.getAuthorizationToken).toHaveBeenCalled();

      const req = httpTestingController.expectOne('/api/users');
      expect(req.request.headers.get('Authorization')).toBe('Bearer mock-access-token');
      req.flush([]);
    });

    it('should redirect to login when getAuthorizationToken fails', () => {
      // Arrange
      const authService = {
        getToken: vi.fn(() => null) as Mock,
        checkAuthentication: vi.fn(() => of(true)) as Mock,
        getAuthorizationToken: vi.fn(() => throwError(() => new Error('Token error'))) as Mock,
        navigateToLogin: vi.fn() as Mock,
      };
      const router = { navigate: vi.fn() as Mock };

      const { httpClient } = setupTestBed(authService, router);

      // Act
      httpClient.get('/api/users').subscribe({
        next: () => {
          // Expected path
        },
        error: () => {
          // Error case
        },
      });

      // Assert
      expect(authService.navigateToLogin).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should redirect to login when authentication check fails', () => {
      // Arrange
      const authService = {
        getToken: vi.fn(() => null) as Mock,
        checkAuthentication: vi.fn(() => throwError(() => new Error('Auth check failed'))) as Mock,
        getAuthorizationToken: vi.fn() as Mock,
        navigateToLogin: vi.fn() as Mock,
      };
      const router = { navigate: vi.fn() as Mock };

      const { httpClient } = setupTestBed(authService, router);

      // Act
      httpClient.get('/api/users').subscribe({
        next: () => {
          // Expected path
        },
        error: (error) => {
          expect(error.message).toBe('Auth check failed');
        },
      });

      // Assert
      expect(authService.navigateToLogin).toHaveBeenCalled();
    });
  });
});
