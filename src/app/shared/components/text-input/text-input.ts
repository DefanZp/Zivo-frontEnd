import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './text-input.html',
  styleUrl: './text-input.css',
})
export class TextInput {

  label = input('');
  type = input('text');
  placeholder = input('');
  control = input.required<FormControl>();

}
