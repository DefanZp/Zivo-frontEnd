import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../../core/services/auth/auth';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Toast } from '../../../core/services/toast';
import { TextInput } from '../../../shared/components/text-input/text-input';
import { ValidationMessage } from '../../../shared/components/validation-message/validation-message';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
    TextInput,
    ValidationMessage,
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  private formBuilder = inject(NonNullableFormBuilder);
  private authService = inject(Auth);
  private toastService = inject(Toast);
  private router = inject(Router);

  registerForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    password_confirmation: ['', Validators.required],
  })

  loading = signal(false);
  errorMessage = signal('');

  submitRegister(): void {
    if (this.registerForm.invalid) {
      return;
    }

    const formData = this.registerForm.getRawValue();

    this.loading.set(true);

    this.authService
    .register(formData)
    .subscribe({
      next: () => {
        this.errorMessage.set('');
        this.loading.set(false);
        this.toastService.success('Registration successful, please log in.');
        this.router.navigate(['/auth/login']);
      },
      error: (response) => {
        this.errorMessage.set(response.error.message);
        this.toastService.error(response.error.message);
        this.loading.set(false);
      }
    });
  }
}
