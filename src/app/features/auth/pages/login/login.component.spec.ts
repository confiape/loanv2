import { Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { of, throwError } from 'rxjs';
import { vi, describe, it, expect } from 'vitest';
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

  function createComponent() {
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

    const fixture = TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: AuthenticationApiService, useValue: authApiMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: ToastService, useValue: toastServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).createComponent(LoginComponent);
    TestBed.tick();

    return {
      fixture,
      authApiMock,
      authServiceMock,
      toastServiceMock,
      routerMock,
    };
  }

  describe('Component Initialization', () => {
    it('should create', () => {
      const { fixture } = createComponent();
      expect(fixture.componentInstance).toBeTruthy();
    });

    it('should initialize with empty credentials', () => {
      const { fixture } = createComponent();
      const emailInput = fixture.nativeElement.querySelector('input[type="email"]');
      const passwordInput = fixture.nativeElement.querySelector('input[type="password"]');

      expect(emailInput?.value).toBe('');
      expect(passwordInput?.value).toBe('');
    });

    it('should render form with email and password fields', () => {
      const { fixture } = createComponent();
      const form = fixture.nativeElement.querySelector('form');
      const emailInput = fixture.nativeElement.querySelector('input[type="email"]');
      const passwordInput = fixture.nativeElement.querySelector('input[type="password"]');

      expect(form).toBeTruthy();
      expect(emailInput).toBeTruthy();
      expect(emailInput?.type).toBe('email');
      expect(passwordInput).toBeTruthy();
      expect(passwordInput?.type).toBe('password');
    });

    it('should render submit button', () => {
      const { fixture } = createComponent();
      const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(submitButton).toBeTruthy();
    });
  });

  describe('Form Validation', () => {
    it('should disable submit button when form is invalid', () => {
      const { fixture } = createComponent();
      const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(submitButton?.disabled).toBe(true);
    });

    it('should enable submit button when form is valid', () => {
      const { fixture } = createComponent();
      const emailInput = fixture.nativeElement.querySelector('input[type="email"]');
      const passwordInput = fixture.nativeElement.querySelector('input[type="password"]');

      if (emailInput && passwordInput) {
        emailInput.value = 'test@test.com';
        emailInput.dispatchEvent(new Event('input'));
        passwordInput.value = 'password123';
        passwordInput.dispatchEvent(new Event('input'));
        TestBed.tick();
      }

      const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(submitButton?.disabled).toBeFalsy();
    });
  });

  describe('Form Submission Success', () => {
    it('should call authApi.logIn on submit with valid credentials', async () => {
      const { fixture, authApiMock, authServiceMock } = createComponent();
      const component = fixture.componentInstance;

      authApiMock.logIn.mockReturnValue(of(undefined));
      authServiceMock.getAuthorizationToken.mockReturnValue(of(mockLoginResponse));

      // Set form values directly
      component.loginForm.patchValue({
        email: 'test@test.com',
        password: 'password123',
      });
      TestBed.tick();

      // Call onSubmit directly
      component.onSubmit();
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(authApiMock.logIn).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password123',
      });
    });

    it('should show success toast after successful login', async () => {
      const { fixture, authApiMock, authServiceMock, toastServiceMock } = createComponent();
      const component = fixture.componentInstance;

      authApiMock.logIn.mockReturnValue(of(undefined));
      authServiceMock.getAuthorizationToken.mockReturnValue(of(mockLoginResponse));

      // Set form values directly
      component.loginForm.patchValue({
        email: 'test@test.com',
        password: 'password123',
      });
      TestBed.tick();

      // Call onSubmit directly
      component.onSubmit();
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(toastServiceMock.success).toHaveBeenCalledWith('Inicio de sesión exitoso');
    });

    it('should navigate to home after successful login', async () => {
      const { fixture, authApiMock, authServiceMock, routerMock } = createComponent();
      const component = fixture.componentInstance;

      authApiMock.logIn.mockReturnValue(of(undefined));
      authServiceMock.getAuthorizationToken.mockReturnValue(of(mockLoginResponse));

      // Set form values directly
      component.loginForm.patchValue({
        email: 'test@test.com',
        password: 'password123',
      });
      TestBed.tick();

      // Call onSubmit directly
      component.onSubmit();
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
    });
  });

  describe('Form Submission Failure', () => {
    it('should show error toast on login failure', async () => {
      const { fixture, authApiMock, toastServiceMock } = createComponent();
      const component = fixture.componentInstance;

      const error = {
        error: { message: 'Email o contraseña incorrectos' },
      };
      authApiMock.logIn.mockReturnValue(throwError(() => error));

      // Set form values directly
      component.loginForm.patchValue({
        email: 'test@test.com',
        password: 'wrong-password',
      });
      TestBed.tick();

      // Call onSubmit directly
      component.onSubmit();
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(toastServiceMock.error).toHaveBeenCalledWith(
        'Email o contraseña incorrectos',
        'Error de Autenticación',
      );
    });

    it('should show generic error message when no message provided', async () => {
      const { fixture, authApiMock, toastServiceMock } = createComponent();
      const component = fixture.componentInstance;

      authApiMock.logIn.mockReturnValue(throwError(() => ({ error: {} })));

      // Set form values directly
      component.loginForm.patchValue({
        email: 'test@test.com',
        password: 'password123',
      });
      TestBed.tick();

      // Call onSubmit directly
      component.onSubmit();
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(toastServiceMock.error).toHaveBeenCalledWith(
        'Error al iniciar sesión',
        'Error de Autenticación',
      );
    });
  });
});
