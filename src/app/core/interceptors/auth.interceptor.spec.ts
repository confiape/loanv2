import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi, Mock } from 'vitest';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';
import { LoginResponse } from '../core/openapi/model/loginResponse';

describe('authInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let authService: {
    getToken: Mock;
    checkAuthentication: Mock;
    getAuthorizationToken: Mock;
    navigateToLogin: Mock;
  };
  let router: {
    navigate: Mock;
  };

  const mockLoginResponse: LoginResponse = {
    user: {
      name: 'Test User',
      dni: '12345678',
      phoneNumber: '123456789',
    },
    accessToken: 'mock-access-token',
    tokenType: 'Bearer',
  };

  beforeEach(() => {
    authService = {
      getToken: vi.fn() as Mock,
      checkAuthentication: vi.fn() as Mock,
      getAuthorizationToken: vi.fn() as Mock,
      navigateToLogin: vi.fn() as Mock,
    };

    router = {
      navigate: vi.fn() as Mock,
    };

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('Public Endpoints', () => {
    it('should allow request to public endpoint without token', () => {
      httpClient.get('/api/Authentication/IsAuthenticated').subscribe();

      const req = httpTestingController.expectOne('/api/Authentication/IsAuthenticated');
      expect(req.request.headers.has('Authorization')).toBe(false);
      req.flush(true);
    });

    it('should allow login endpoint', () => {
      httpClient.post('/api/Authentication/LogIn', {}).subscribe();

      const req = httpTestingController.expectOne('/api/Authentication/LogIn');
      expect(req.request.headers.has('Authorization')).toBe(false);
      req.flush({});
    });

    it('should allow GetAuthorizationToken endpoint', () => {
      httpClient.post('/api/Authentication/GetAuthorizationToken', {}).subscribe();

      const req = httpTestingController.expectOne('/api/Authentication/GetAuthorizationToken');
      expect(req.request.headers.has('Authorization')).toBe(false);
      req.flush(mockLoginResponse);
    });
  });

  describe('Authenticated Requests', () => {
    it('should add Authorization header when token exists', () => {
      authService.getToken!.mockReturnValue('test-token');

      httpClient.get('/api/users').subscribe();

      const req = httpTestingController.expectOne('/api/users');
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
      req.flush([]);
    });

    it('should proceed with request when token exists', () => {
      authService.getToken!.mockReturnValue('test-token');

      httpClient.get('/api/users').subscribe((response) => {
        expect(response).toEqual([{ id: 1, name: 'Test' }]);
      });

      const req = httpTestingController.expectOne('/api/users');
      req.flush([{ id: 1, name: 'Test' }]);
    });
  });

  describe('Unauthenticated Requests', () => {
    it('should check authentication when no token exists', () => {
      authService.getToken!.mockReturnValue(null);
      authService.checkAuthentication!.mockReturnValue(of(false));

      httpClient.get('/api/users').subscribe({
        next: () => {
          // Expected path
        },
        error: () => {
          // Error case
        },
      });

      expect(authService.checkAuthentication).toHaveBeenCalled();
      expect(authService.navigateToLogin).toHaveBeenCalled();
    });

    it('should redirect to login when not authenticated', () => {
      authService.getToken!.mockReturnValue(null);
      authService.checkAuthentication!.mockReturnValue(of(false));

      httpClient.get('/api/users').subscribe({
        next: () => {
          // Expected path
        },
        error: (error) => {
          expect(error.message).toBe('Not authenticated');
        },
      });

      expect(authService.navigateToLogin).toHaveBeenCalled();
    });

    it('should get authorization token after successful authentication check', () => {
      authService.getToken!.mockReturnValue(null);
      authService.checkAuthentication!.mockReturnValue(of(true));
      authService.getAuthorizationToken!.mockReturnValue(of(mockLoginResponse));

      httpClient.get('/api/users').subscribe();

      expect(authService.checkAuthentication).toHaveBeenCalled();
      expect(authService.getAuthorizationToken).toHaveBeenCalled();

      const req = httpTestingController.expectOne('/api/users');
      expect(req.request.headers.get('Authorization')).toBe('Bearer mock-access-token');
      req.flush([]);
    });

    it('should redirect to login when getAuthorizationToken fails', () => {
      authService.getToken!.mockReturnValue(null);
      authService.checkAuthentication!.mockReturnValue(of(true));
      authService.getAuthorizationToken!.mockReturnValue(
        throwError(() => new Error('Token error')),
      );

      httpClient.get('/api/users').subscribe({
        next: () => {
          // Expected path
        },
        error: () => {
          // Error case
        },
      });

      expect(authService.navigateToLogin).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should redirect to login when authentication check fails', () => {
      authService.getToken!.mockReturnValue(null);
      authService.checkAuthentication!.mockReturnValue(
        throwError(() => new Error('Auth check failed')),
      );

      httpClient.get('/api/users').subscribe({
        next: () => {
          // Expected path
        },
        error: (error) => {
          expect(error.message).toBe('Auth check failed');
        },
      });

      expect(authService.navigateToLogin).toHaveBeenCalled();
    });
  });
});
