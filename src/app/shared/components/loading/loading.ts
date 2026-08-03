import { Component, input, } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.html',
})
export class Loading {
  type = input<'spinner' | 'skeleton-grid' | 'skeleton-list'>('skeleton-grid');
  items = input(8);
}