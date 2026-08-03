import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-button',
  imports: [],
  templateUrl: './loading-button.html',
  styleUrl: './loading-button.css',
})
export class LoadingButton {

  loading = input(false);
  text = input.required<string>();
  loadingText = input('Loading...');
  type = input<'button' | 'submit'>('submit');
}
