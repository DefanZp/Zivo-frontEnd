import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../../core/services/auth/auth';
import { Router, RouterLink } from '@angular/router';
import { Toast } from '../../../core/services/toast';
import { TextInput } from '../../../shared/components/text-input/text-input';
import { ValidationMessage } from '../../../shared/components/validation-message/validation-message';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    TextInput,
    ValidationMessage,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private formBuilder = inject(NonNullableFormBuilder);
  private authService = inject(Auth);
  private toastService = inject(Toast);
  private router = inject(Router);

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  })

  errorMessage = signal('');
  loading = signal(false);

  submitLogin(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const formData = this.loginForm.getRawValue();

    this.loading.set(true);

    this.authService
    .login(formData)
    .subscribe({
      next: (response) => {

        this.errorMessage.set('');

        // Save token dan user ke localStorage
        this.authService.saveToken(response.token);
        this.authService.saveUser(response.user);

        this.toastService.success('Login successful.!');

        this.loading.set(false);
        // Redirect ke halaman utama
        this.router.navigate(['/']);
      },

      error: (response) => {
        this.errorMessage.set(response.error.message);
        this.toastService.error('Login failed!');
        this.loading.set(false);
      }
    })
  }
}
