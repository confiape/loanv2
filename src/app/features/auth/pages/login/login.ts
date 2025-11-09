import {Component, computed, signal} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Input} from '@loan/app/shared/components/input/input';
import {Button} from '@loan/app/shared/components/button/button';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, Input, Button, ReactiveFormsModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  // Form
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  // UI State
  showPassword = signal(false);
  isLoading = signal(false);

  // Computed
  isSubmitDisabled = computed(() =>
    this.isLoading() || this.loginForm.invalid
  );

  togglePasswordVisibility() {
    this.showPassword.update(v => !v);
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);

    // Simulación de login
    setTimeout(() => {
      console.log('Login:', this.loginForm.value);
      this.isLoading.set(false);
    }, 2000);
  }
}
