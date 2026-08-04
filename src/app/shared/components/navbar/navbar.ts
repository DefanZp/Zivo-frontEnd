import { Component, inject, signal } from '@angular/core';
import { Auth } from '../../../core/services/auth/auth';
import { Router } from '@angular/router';
import { Toast } from '../../../core/services/toast';
import { ConfirmationModal } from '../confirmation-modal/confirmation-modal';

@Component({
  selector: 'app-navbar',
  imports: [
    ConfirmationModal,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  // state services
  authService = inject(Auth);
  toastService = inject(Toast);

  // state router
  router = inject(Router);

  // state loading
  logouting = signal(false);

  // state modal
  showLogoutModal = signal(false);

  logout():void {
    
    this.logouting.set(true);

    this.authService
    .logout()
    .subscribe({
      next: () => {
        this.logouting.set(false);
        this.authService.clearAuth();
        this.router.navigate(['/auth/login'])
      },
      error: (error) => {
        this.logouting.set(false);
        console.log(error);
      }
    })
  }

  openLogoutModal () {
    this.showLogoutModal.set(true);
  }

  closeLogoutModal () {
    this.showLogoutModal.set(false);
  }

  navigateToAdminProducts():void {
    this.router.navigate(['/admin/products']);
  } 
  
  navigateToCart():void {
    this.router.navigate(['/cart']);
  }
}
