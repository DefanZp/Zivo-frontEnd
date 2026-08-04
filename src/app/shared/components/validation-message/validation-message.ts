import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-validation-message',
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './validation-message.html',
  styleUrl: './validation-message.css',
})
export class ValidationMessage {

  control = input.required<FormControl>();
  fieldName = input('Field');
  
  getErrorMessage (): string {

    const error = this.control().errors;

    if (!error) {
      return '';
    }

    if (error['required']) {
      return `Field ${this.fieldName()} wajib diisi.`;
    }

    if (error['email']) {
      return 'Email tidak valid';
    }

    if (error['minlength']) {
      return `Minimal ${error['minlength'].requiredLength} karakter`;
    }

    if (error['maxlength']) {
      return `Maksimal ${error['maxlength'].requiredLength} karakter`;
    }

    return 'Input tidak valid.';

  }

}
