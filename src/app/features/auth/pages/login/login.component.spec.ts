import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';
import { of, throwError } from 'rxjs';
import { vi, Mock } from 'vitest';
import { LoginComponent } from './login';
import {AuthenticationApiService, LoginResponse} from '@loan/app/shared/openapi';
import {AuthService} from '@loan/app/core/services/auth.service';
import {ToastService} from '@loan/app/shared/components/toast/toast.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let compiled: HTMLElement;
  let authApiMock: {
    logIn: Mock;
  };
  let authServiceMock: {
    getAuthorizationToken: Mock;
  };
  let toastServiceMock: {
    success: Mock;
    error: Mock;
  };
  let routerMock: {
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

  beforeEach(async () => {
    authApiMock = {
      logIn: vi.fn() as Mock,
    };

    authServiceMock = {
      getAuthorizationToken: vi.fn() as Mock,
    };

    toastServiceMock = {
      success: vi.fn() as Mock,
      error: vi.fn() as Mock,
    };

    routerMock = {
      navigate: vi.fn() as Mock,
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: AuthenticationApiService, useValue: authApiMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: ToastService, useValue: toastServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with empty credentials', () => {
      expect(component.email()).toBe('');
      expect(component.password()).toBe('');
    });

    it('should initialize with loading false', () => {
      expect(component.isLoading()).toBe(false);
    });

    it('should initialize with password hidden', () => {
      expect(component.showPassword()).toBe(false);
    });
  });

  describe('Template Rendering', () => {
    it('should render login form', () => {
      const form = compiled.querySelector('form');
      expect(form).toBeTruthy();
    });

    it('should render email input', () => {
      const emailInput = compiled.querySelector<HTMLInputElement>('#email');
      expect(emailInput).toBeTruthy();
      expect(emailInput?.type).toBe('email');
    });

    it('should render password input', () => {
      const passwordInput = compiled.querySelector<HTMLInputElement>('#password');
      expect(passwordInput).toBeTruthy();
      expect(passwordInput?.type).toBe('password');
    });

    it('should render submit button', () => {
      const submitButton = compiled.querySelector<HTMLButtonElement>('button[type="submit"]');
      expect(submitButton).toBeTruthy();
    });

    it('should disable submit button when form is invalid', () => {
      const submitButton = compiled.querySelector<HTMLButtonElement>('button[type="submit"]');
      expect(submitButton?.disabled).toBe(true);
    });

    it('should enable submit button when form is valid', () => {
      component.email.set('test@test.com');
      component.password.set('password123');
      fixture.detectChanges();

      const submitButton = compiled.querySelector<HTMLButtonElement>('button[type="submit"]');
      expect(submitButton?.disabled).toBe(false);
    });
  });

  describe('Password Visibility Toggle', () => {
    it('should toggle password visibility', () => {
      expect(component.showPassword()).toBe(false);

      component.togglePasswordVisibility();
      expect(component.showPassword()).toBe(true);

      component.togglePasswordVisibility();
      expect(component.showPassword()).toBe(false);
    });

    it('should change input type when toggling password visibility', () => {
      component.showPassword.set(false);
      fixture.detectChanges();

      let passwordInput = compiled.querySelector<HTMLInputElement>('#password');
      expect(passwordInput?.type).toBe('password');

      component.showPassword.set(true);
      fixture.detectChanges();

      passwordInput = compiled.querySelector<HTMLInputElement>('#password');
      expect(passwordInput?.type).toBe('text');
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      component.email.set('test@test.com');
      component.password.set('password123');
    });

    it('should call authApi.logIn on submit', () => {
      authApiMock.logIn!.mockReturnValue(of(undefined));
      authServiceMock.getAuthorizationToken!.mockReturnValue(of(mockLoginResponse));

      component.onSubmit();

      expect(authApiMock.logIn).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password123',
      });
    });

    it('should set loading state during submission', () => {
      authApiMock.logIn!.mockReturnValue(of(undefined));
      authServiceMock.getAuthorizationToken!.mockReturnValue(of(mockLoginResponse));

      expect(component.isLoading()).toBe(false);

      component.onSubmit();
      expect(component.isLoading()).toBe(true);
    });

    it('should not submit if already loading', () => {
      component.isLoading.set(true);
      component.onSubmit();

      expect(authApiMock.logIn).not.toHaveBeenCalled();
    });
  });

  describe('Successful Login', () => {
    beforeEach(() => {
      component.email.set('test@test.com');
      component.password.set('password123');
    });

    it('should get authorization token after successful login', async () => {
      authApiMock.logIn!.mockReturnValue(of(undefined));
      authServiceMock.getAuthorizationToken!.mockReturnValue(of(mockLoginResponse));

      component.onSubmit();

      await fixture.whenStable();
      expect(authServiceMock.getAuthorizationToken).toHaveBeenCalled();
    });

    it('should show success toast after successful login', async () => {
      authApiMock.logIn!.mockReturnValue(of(undefined));
      authServiceMock.getAuthorizationToken!.mockReturnValue(of(mockLoginResponse));

      component.onSubmit();

      await fixture.whenStable();
      expect(toastServiceMock.success).toHaveBeenCalledWith('Inicio de sesión exitoso');
    });

    it('should navigate to dashboard after successful login', async () => {
      authApiMock.logIn!.mockReturnValue(of(undefined));
      authServiceMock.getAuthorizationToken!.mockReturnValue(of(mockLoginResponse));

      component.onSubmit();

      await fixture.whenStable();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard']);
    });
  });

  describe('Failed Login', () => {
    beforeEach(() => {
      component.email.set('test@test.com');
      component.password.set('wrong-password');
    });

    it('should show error toast on login failure', async () => {
      const error = {
        error: { message: 'Email o contraseña incorrectos' },
      };
      authApiMock.logIn!.mockReturnValue(throwError(() => error));

      component.onSubmit();

      await fixture.whenStable();
      expect(toastServiceMock.error).toHaveBeenCalledWith(
        'Email o contraseña incorrectos',
        'Error de Autenticación',
      );
      expect(component.isLoading()).toBe(false);
    });

    it('should show generic error message when no message provided', async () => {
      authApiMock.logIn!.mockReturnValue(throwError(() => ({ error: {} })));

      component.onSubmit();

      await fixture.whenStable();
      expect(toastServiceMock.error).toHaveBeenCalledWith(
        'Email o contraseña incorrectos',
        'Error de Autenticación',
      );
    });

    it('should stop loading on login failure', async () => {
      authApiMock.logIn!.mockReturnValue(throwError(() => new Error('Login failed')));

      component.onSubmit();

      await fixture.whenStable();
      expect(component.isLoading()).toBe(false);
    });
  });

  describe('Authorization Token Failure', () => {
    beforeEach(() => {
      component.email.set('test@test.com');
      component.password.set('password123');
    });

    it('should show error toast if getAuthorizationToken fails', async () => {
      authApiMock.logIn!.mockReturnValue(of(undefined));
      authServiceMock.getAuthorizationToken!.mockReturnValue(
        throwError(() => new Error('Token error')),
      );

      component.onSubmit();

      await fixture.whenStable();
      expect(toastServiceMock.error).toHaveBeenCalledWith(
        'Error al obtener el token de autorización',
      );
      expect(component.isLoading()).toBe(false);
    });
  });
});
