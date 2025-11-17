import { Router } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';
import { of, throwError } from 'rxjs';
import { vi, describe, it, expect } from 'vitest';
import { render } from '@testing-library/angular';
import { LoginComponent } from './login';
import { AuthenticationApiService, LoginResponse } from '@loan/app/shared/openapi';
import { AuthService } from '@loan/app/core/services/auth.service';
import { ToastService } from '@loan/app/core/services/toast.service';

describe('LoginComponent', () => {
  const mockLoginResponse: LoginResponse = {
    user: {
      name: 'Test User',
      dni: '12345678',
      phoneNumber: '123456789',
    },
    accessToken: 'mock-access-token',
    tokenType: 'Bearer',
  };

  async function createComponent() {
    const authApiMock = {
      logIn: vi.fn(),
    };

    const authServiceMock = {
      getAuthorizationToken: vi.fn(),
    };

    const toastServiceMock = {
      success: vi.fn(),
      error: vi.fn(),
    };

    const routerMock = {
      navigate: vi.fn(),
    };

    const { container, detectChanges } = await render(LoginComponent, {
      providers: [
        provideZonelessChangeDetection(),
        { provide: AuthenticationApiService, useValue: authApiMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: ToastService, useValue: toastServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    return {
      container,
      detectChanges,
      authApiMock,
      authServiceMock,
      toastServiceMock,
      routerMock,
    };
  }

  describe('Component Initialization', () => {
    it('should create', async () => {
      const { container } = await createComponent();
      expect(container).toBeTruthy();
    });

    it('should initialize with empty credentials', async () => {
      const { container } = await createComponent();
      const emailInput = container.querySelector<HTMLInputElement>('input[type="email"]');
      const passwordInput = container.querySelector<HTMLInputElement>('input[type="password"]');

      expect(emailInput?.value).toBe('');
      expect(passwordInput?.value).toBe('');
    });

    it('should render form with email and password fields', async () => {
      const { container } = await createComponent();
      const form = container.querySelector('form');
      const emailInput = container.querySelector<HTMLInputElement>('input[type="email"]');
      const passwordInput = container.querySelector<HTMLInputElement>('input[type="password"]');

      expect(form).toBeTruthy();
      expect(emailInput).toBeTruthy();
      expect(emailInput?.type).toBe('email');
      expect(passwordInput).toBeTruthy();
      expect(passwordInput?.type).toBe('password');
    });

    it('should render submit button', async () => {
      const { container } = await createComponent();
      const submitButton = container.querySelector<HTMLButtonElement>('button[type="submit"]');
      expect(submitButton).toBeTruthy();
    });
  });

  describe('Form Validation', () => {
    it('should disable submit button when form is invalid', async () => {
      const { container } = await createComponent();
      const submitButton = container.querySelector<HTMLButtonElement>('button[type="submit"]');
      expect(submitButton?.disabled).toBe(true);
    });

    it('should enable submit button when form is valid', async () => {
      const { container, detectChanges } = await createComponent();
      const emailInput = container.querySelector<HTMLInputElement>('input[type="email"]');
      const passwordInput = container.querySelector<HTMLInputElement>('input[type="password"]');

      if (emailInput && passwordInput) {
        emailInput.value = 'test@test.com';
        emailInput.dispatchEvent(new Event('input'));
        passwordInput.value = 'password123';
        passwordInput.dispatchEvent(new Event('input'));
        detectChanges();
      }

      const submitButton = container.querySelector<HTMLButtonElement>('button[type="submit"]');
      expect(submitButton?.disabled).toBeFalsy();
    });
  });

  describe('Form Submission Success', () => {
    it('should call authApi.logIn on submit with valid credentials', async () => {
      const { container, authApiMock, authServiceMock } = await createComponent();
      const emailInput = container.querySelector<HTMLInputElement>('input[type="email"]');
      const passwordInput = container.querySelector<HTMLInputElement>('input[type="password"]');

      authApiMock.logIn.mockReturnValue(of(undefined));
      authServiceMock.getAuthorizationToken.mockReturnValue(of(mockLoginResponse));

      if (emailInput && passwordInput) {
        emailInput.value = 'test@test.com';
        emailInput.dispatchEvent(new Event('input'));
        passwordInput.value = 'password123';
        passwordInput.dispatchEvent(new Event('input'));

        const submitButton = container.querySelector<HTMLButtonElement>('button[type="submit"]');
        submitButton?.click();

        await new Promise((resolve) => setTimeout(resolve, 100));

        expect(authApiMock.logIn).toHaveBeenCalledWith({
          email: 'test@test.com',
          password: 'password123',
        });
      }
    });

    it('should show success toast after successful login', async () => {
      const { container, authApiMock, authServiceMock, toastServiceMock } =
        await createComponent();
      const emailInput = container.querySelector<HTMLInputElement>('input[type="email"]');
      const passwordInput = container.querySelector<HTMLInputElement>('input[type="password"]');

      authApiMock.logIn.mockReturnValue(of(undefined));
      authServiceMock.getAuthorizationToken.mockReturnValue(of(mockLoginResponse));

      if (emailInput && passwordInput) {
        emailInput.value = 'test@test.com';
        emailInput.dispatchEvent(new Event('input'));
        passwordInput.value = 'password123';
        passwordInput.dispatchEvent(new Event('input'));

        const submitButton = container.querySelector<HTMLButtonElement>('button[type="submit"]');
        submitButton?.click();

        await new Promise((resolve) => setTimeout(resolve, 100));

        expect(toastServiceMock.success).toHaveBeenCalledWith('Inicio de sesión exitoso');
      }
    });

    it('should navigate to home after successful login', async () => {
      const { container, authApiMock, authServiceMock, routerMock } = await createComponent();
      const emailInput = container.querySelector<HTMLInputElement>('input[type="email"]');
      const passwordInput = container.querySelector<HTMLInputElement>('input[type="password"]');

      authApiMock.logIn.mockReturnValue(of(undefined));
      authServiceMock.getAuthorizationToken.mockReturnValue(of(mockLoginResponse));

      if (emailInput && passwordInput) {
        emailInput.value = 'test@test.com';
        emailInput.dispatchEvent(new Event('input'));
        passwordInput.value = 'password123';
        passwordInput.dispatchEvent(new Event('input'));

        const submitButton = container.querySelector<HTMLButtonElement>('button[type="submit"]');
        submitButton?.click();

        await new Promise((resolve) => setTimeout(resolve, 100));

        expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
      }
    });
  });

  describe('Form Submission Failure', () => {
    it('should show error toast on login failure', async () => {
      const { container, authApiMock, toastServiceMock } = await createComponent();
      const emailInput = container.querySelector<HTMLInputElement>('input[type="email"]');
      const passwordInput = container.querySelector<HTMLInputElement>('input[type="password"]');

      const error = {
        error: { message: 'Email o contraseña incorrectos' },
      };
      authApiMock.logIn.mockReturnValue(throwError(() => error));

      if (emailInput && passwordInput) {
        emailInput.value = 'test@test.com';
        emailInput.dispatchEvent(new Event('input'));
        passwordInput.value = 'wrong-password';
        passwordInput.dispatchEvent(new Event('input'));

        const submitButton = container.querySelector<HTMLButtonElement>('button[type="submit"]');
        submitButton?.click();

        await new Promise((resolve) => setTimeout(resolve, 100));

        expect(toastServiceMock.error).toHaveBeenCalledWith(
          'Email o contraseña incorrectos',
          'Error de Autenticación',
        );
      }
    });

    it('should show generic error message when no message provided', async () => {
      const { container, authApiMock, toastServiceMock } = await createComponent();
      const emailInput = container.querySelector<HTMLInputElement>('input[type="email"]');
      const passwordInput = container.querySelector<HTMLInputElement>('input[type="password"]');

      authApiMock.logIn.mockReturnValue(throwError(() => ({ error: {} })));

      if (emailInput && passwordInput) {
        emailInput.value = 'test@test.com';
        emailInput.dispatchEvent(new Event('input'));
        passwordInput.value = 'password123';
        passwordInput.dispatchEvent(new Event('input'));

        const submitButton = container.querySelector<HTMLButtonElement>('button[type="submit"]');
        submitButton?.click();

        await new Promise((resolve) => setTimeout(resolve, 100));

        expect(toastServiceMock.error).toHaveBeenCalledWith(
          'Error al iniciar sesión',
          'Error de Autenticación',
        );
      }
    });
  });
});
