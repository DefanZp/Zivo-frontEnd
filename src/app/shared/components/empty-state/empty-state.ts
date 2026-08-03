import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empty-state.html',
})
export class EmptyState {
  type = input<'empty' | 'search' | 'error' | 'cart'>('empty');
  title = input('Belum ada data');
  description = input('');
}