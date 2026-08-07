import { Component, inject, signal, computed } from '@angular/core';
import { Auth } from '../../../core/services/auth/auth';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Toast } from '../../../core/services/toast';
import { ConfirmationModal } from '../confirmation-modal/confirmation-modal';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [ConfirmationModal, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  authService  = inject(Auth);
  toastService = inject(Toast);
  router       = inject(Router);

  logouting       = signal(false);
  showLogoutModal = signal(false);

  // Computed — cek apakah user adalah admin
  isAdmin = computed(() => this.authService.currentUser()?.role === 'admin');
  isLoggedIn = computed(() => !!this.authService.currentUser());

  currentUser = computed(() => this.authService.currentUser());

  logout(): void {
    this.logouting.set(true);
    this.authService.logout().subscribe({
      next: () => {
        this.logouting.set(false);
        this.authService.clearAuth();
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        this.logouting.set(false);
      }
    });
  }

  openLogoutModal()  { this.showLogoutModal.set(true); }
  closeLogoutModal() { this.showLogoutModal.set(false); }
}