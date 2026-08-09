import { Component, computed, inject, signal } from '@angular/core';
import { Auth } from '../../../core/services/auth/auth';
import { User } from '../../../core/services/user/user';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextInput } from '../../../shared/components/text-input/text-input';
import { ValidationMessage } from '../../../shared/components/validation-message/validation-message';
import { LoadingButton } from '../../../shared/components/loading-button/loading-button';

@Component({
  selector: 'app-profile',
  imports: [
    ReactiveFormsModule,
    TextInput,
    ValidationMessage,
    LoadingButton,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {

  private authService = inject(Auth);
  private userSettingsService = inject(User);
  private formBuilder = inject(NonNullableFormBuilder);

  // state User
  currentUser = computed(() => {
    return this.authService.currentUser();
  })

  loading = signal(false);
  isEditing = signal(false);

  profileForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
  })

  startEditing(): void {
    
    const user = this.currentUser();

    if (!user) {
      return;
    }

    this.profileForm.patchValue({
      name: user.name,
      email: user.email,
    })

    this.isEditing.set(true);
  }

  cancelEditing(): void {
    this.isEditing.set(false);
  }

  saveProfile(): void {
  
    if(this.profileForm.invalid) {
      return;
    }

    this.loading.set(true);

    const formData = this.profileForm.getRawValue();

    this.userSettingsService
      .updateProfile(formData)
      .subscribe({
        next: (response) => {
          this.authService.updateUser(response.data);
          this.loading.set(false);
          this.isEditing.set(false);
        },
        error: () => {
          this.loading.set(false);
        }
      })
  }
}
