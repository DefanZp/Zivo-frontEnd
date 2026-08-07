import { Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-modal',
  imports: [CommonModule],
  templateUrl: './confirmation-modal.html',
  styleUrl: './confirmation-modal.css',
})
export class ConfirmationModal {

  // Inputs konten
  isOpen      = input(false);
  title       = input('');
  description = input('');
  confirmText = input('Confirm');
  cancelText  = input('Cancel');
  warningText = input('');         
  loadingText = input('Processing...');

  // Input state
  loading = input(false);

  // Variant — tentukan warna icon dan tombol konfirmasi
  variant = input<'danger' | 'warning' | 'info'>('info');

  // Outputs
  confirm = output<void>();
  cancel  = output<void>();

  // Computed — warna icon container berdasarkan variant
  iconContainerClass = computed(() => {
    const map = {
      danger:  'bg-red-50 dark:bg-red-950',
      warning: 'bg-amber-50 dark:bg-amber-950',
      info:    'bg-blue-50 dark:bg-blue-950',
    };
    return map[this.variant()];
  });

  // Computed — warna tombol konfirmasi berdasarkan variant
  confirmButtonClass = computed(() => {
    const map = {
      danger:  'bg-red-500 hover:bg-red-600',
      warning: 'bg-amber-500 hover:bg-amber-600',
      info:    'bg-black hover:bg-zinc-700',
    };
    return map[this.variant()];
  });
}