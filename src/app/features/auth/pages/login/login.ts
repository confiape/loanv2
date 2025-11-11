import { Component, signal, inject, DestroyRef } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, catchError, finalize, switchMap, tap } from 'rxjs';

import { AuthenticationApiService } from '@loan/app/shared/openapi';
import { AuthService } from '@loan/app/core/services/auth.service';
import { ToastService } from '@loan/app/core/services/toast.service';
import { Input } from '@loan/app/shared/components/input/input';
import { PasswordInput } from '@loan/app/shared/components/password-input/password-input';
import { Button } from '@loan/app/shared/components/button/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, Input, PasswordInput, Button, ReactiveFormsModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  private readonly authApi = inject(AuthenticationApiService);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly loginForm = new FormGroup({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  // UI State
  readonly isLoading = signal(false);

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    if (this.isLoading()) {
      return;
    }

    const credentials = this.loginForm.getRawValue();
    this.isLoading.set(true);

    this.authApi
      .logIn(credentials)
      .pipe(
        switchMap(() => this.authService.getAuthorizationToken()),
        tap(() => {
          this.toastService.success('Inicio de sesión exitoso');
          this.router.navigate(['/home']);
        }),
        catchError((error) => {
          this.handleLoginError(error);
          return EMPTY;
        }),
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  isSubmitDisabled(): boolean {
    return this.isLoading() || this.loginForm.invalid;
  }

  private handleLoginError(error: unknown): void {
    const apiError = error as { error?: { message?: string }; status?: number };

    if (apiError.status === 401) {
      this.toastService.error('Email o contraseña incorrectos', 'Error de Autenticación');
    } else if (apiError.status === 0) {
      this.toastService.error('No se pudo conectar con el servidor', 'Error de Conexión');
    } else {
      const message = apiError.error?.message ?? 'Error al iniciar sesión';
      this.toastService.error(message, 'Error de Autenticación');
    }
  }
}
