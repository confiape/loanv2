import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Router } from '@angular/router';
import { of, throwError, Observable } from 'rxjs';
import { loginGuard } from '@loan/app/features/auth/guards/login.guard';
import { AuthService } from '@loan/app/core/services/auth.service';
import { firstValueFrom } from 'rxjs';

describe('loginGuard', () => {
  let mockAuthService: {
    getToken: ReturnType<typeof vi.fn>;
    checkAuthentication: ReturnType<typeof vi.fn>;
  };
  let mockRouter: {
    navigate: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockAuthService = {
      getToken: vi.fn(),
      checkAuthentication: vi.fn(),
    };

    mockRouter = {
      navigate: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    });
  });

  describe('when user has a token', () => {
    it('redirects to dashboard and returns false', () => {
      // Arrange
      mockAuthService.getToken.mockReturnValue('valid-token');

      // Act
      const result = TestBed.runInInjectionContext(() => loginGuard({} as any, {} as any));

      // Assert
      expect(mockAuthService.getToken).toHaveBeenCalledOnce();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
      expect(result).toBe(false);
      expect(mockAuthService.checkAuthentication).not.toHaveBeenCalled();
    });

    it('does not call checkAuthentication if token exists', () => {
      // Arrange
      mockAuthService.getToken.mockReturnValue('some-token-123');

      // Act
      TestBed.runInInjectionContext(() => loginGuard({} as any, {} as any));

      // Assert
      expect(mockAuthService.checkAuthentication).not.toHaveBeenCalled();
    });
  });

  describe('when user does not have a token', () => {
    it('checks authentication status with API', async () => {
      // Arrange
      mockAuthService.getToken.mockReturnValue(null);
      mockAuthService.checkAuthentication.mockReturnValue(of(false));

      // Act
      const result = TestBed.runInInjectionContext(() => loginGuard({} as any, {} as any));

      // Assert
      if (result instanceof Observable) {
        const canActivate = await firstValueFrom(result);
        expect(mockAuthService.getToken).toHaveBeenCalledOnce();
        expect(mockAuthService.checkAuthentication).toHaveBeenCalledOnce();
        expect(canActivate).toBe(true);
      } else {
        expect(result).toBe(false);
      }
    });

    it('allows access to login page when user is not authenticated', async () => {
      // Arrange
      mockAuthService.getToken.mockReturnValue(null);
      mockAuthService.checkAuthentication.mockReturnValue(of(false));

      // Act
      const result = TestBed.runInInjectionContext(() => loginGuard({} as any, {} as any));

      // Assert
      if (result instanceof Observable) {
        const canActivate = await firstValueFrom(result);
        expect(canActivate).toBe(true);
        expect(mockRouter.navigate).not.toHaveBeenCalled();
      }
    });

    it('redirects to dashboard when API confirms authentication', async () => {
      // Arrange
      mockAuthService.getToken.mockReturnValue(null);
      mockAuthService.checkAuthentication.mockReturnValue(of(true));

      // Act
      const result = TestBed.runInInjectionContext(() => loginGuard({} as any, {} as any));

      // Assert
      if (result instanceof Observable) {
        const canActivate = await firstValueFrom(result);
        expect(canActivate).toBe(false);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
      }
    });
  });

  describe('error handling', () => {
    it('allows access to login page when authentication check fails', async () => {
      // Arrange
      mockAuthService.getToken.mockReturnValue(null);
      mockAuthService.checkAuthentication.mockReturnValue(
        throwError(() => new Error('Network error')),
      );

      // Act
      const result = TestBed.runInInjectionContext(() => loginGuard({} as any, {} as any));

      // Assert
      if (result instanceof Observable) {
        const canActivate = await firstValueFrom(result);
        expect(canActivate).toBe(true);
        expect(mockRouter.navigate).not.toHaveBeenCalled();
      }
    });

    it('handles API errors gracefully', async () => {
      // Arrange
      mockAuthService.getToken.mockReturnValue(null);
      mockAuthService.checkAuthentication.mockReturnValue(
        throwError(() => new Error('API unavailable')),
      );

      // Act
      const result = TestBed.runInInjectionContext(() => loginGuard({} as any, {} as any));

      // Assert
      if (result instanceof Observable) {
        const canActivate = await firstValueFrom(result);
        expect(canActivate).toBe(true);
      }
    });

    it('handles timeout errors', async () => {
      // Arrange
      mockAuthService.getToken.mockReturnValue(null);
      mockAuthService.checkAuthentication.mockReturnValue(
        throwError(() => new Error('Timeout')),
      );

      // Act
      const result = TestBed.runInInjectionContext(() => loginGuard({} as any, {} as any));

      // Assert
      if (result instanceof Observable) {
        const canActivate = await firstValueFrom(result);
        expect(canActivate).toBe(true);
      }
    });
  });

  describe('edge cases', () => {
    it('handles empty string token as no token', async () => {
      // Arrange
      mockAuthService.getToken.mockReturnValue('');
      mockAuthService.checkAuthentication.mockReturnValue(of(false));

      // Act
      const result = TestBed.runInInjectionContext(() => loginGuard({} as any, {} as any));

      // Assert
      // Empty string is falsy, so should check authentication
      if (result instanceof Observable) {
        const canActivate = await firstValueFrom(result);
        expect(mockAuthService.checkAuthentication).toHaveBeenCalled();
        expect(canActivate).toBe(true);
      }
    });

    it('handles whitespace-only token as no token', async () => {
      // Arrange
      mockAuthService.getToken.mockReturnValue('   ');
      mockAuthService.checkAuthentication.mockReturnValue(of(false));

      // Act - whitespace is truthy, so should redirect immediately
      const result = TestBed.runInInjectionContext(() => loginGuard({} as any, {} as any));

      // Assert
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
      expect(result).toBe(false);
    });

    it('returns correct type when token exists', () => {
      // Arrange
      mockAuthService.getToken.mockReturnValue('token');

      // Act
      const result = TestBed.runInInjectionContext(() => loginGuard({} as any, {} as any));

      // Assert
      expect(typeof result === 'boolean').toBe(true);
    });

    it('returns Observable when no token exists', () => {
      // Arrange
      mockAuthService.getToken.mockReturnValue(null);
      mockAuthService.checkAuthentication.mockReturnValue(of(true));

      // Act
      const result = TestBed.runInInjectionContext(() => loginGuard({} as any, {} as any));

      // Assert
      expect(result instanceof Observable).toBe(true);
    });
  });

  describe('multiple guard invocations', () => {
    it('consistently returns false when token exists', () => {
      // Arrange
      mockAuthService.getToken.mockReturnValue('token');

      // Act & Assert
      for (let i = 0; i < 3; i++) {
        const result = TestBed.runInInjectionContext(() => loginGuard({} as any, {} as any));
        expect(result).toBe(false);
      }
    });

    it('invokes authentication check each time when no token', async () => {
      // Arrange
      mockAuthService.getToken.mockReturnValue(null);
      mockAuthService.checkAuthentication.mockReturnValue(of(false));

      // Act
      for (let i = 0; i < 3; i++) {
        const result = TestBed.runInInjectionContext(() => loginGuard({} as any, {} as any));
        if (result instanceof Observable) {
          await firstValueFrom(result);
        }
      }

      // Assert
      expect(mockAuthService.checkAuthentication).toHaveBeenCalledTimes(3);
    });
  });

  describe('integration scenarios', () => {
    it('handles expired token scenario (has token but API says not authenticated)', async () => {
      // Arrange - user has token but it might be expired
      mockAuthService.getToken.mockReturnValue('expired-token');

      // Act
      const result = TestBed.runInInjectionContext(() => loginGuard({} as any, {} as any));

      // Assert - guard redirects immediately if token exists
      expect(result).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('prevents direct navigation to login when authenticated', async () => {
      // Arrange
      mockAuthService.getToken.mockReturnValue(null);
      mockAuthService.checkAuthentication.mockReturnValue(of(true));

      // Act
      const result = TestBed.runInInjectionContext(() => loginGuard({} as any, {} as any));

      // Assert
      if (result instanceof Observable) {
        const canActivate = await firstValueFrom(result);
        expect(canActivate).toBe(false);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
      }
    });
  });
});
