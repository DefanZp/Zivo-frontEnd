import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-area',
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './text-area.html',
  styleUrl: './text-area.css',
})
export class TextArea {
  label = input('');
  placeholder = input('');
  rows = input(3); // Default tinggi textarea (jumlah baris)
  control = input.required<FormControl>();
}
