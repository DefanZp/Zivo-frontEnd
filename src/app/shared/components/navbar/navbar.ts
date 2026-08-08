import { Component, inject, signal, computed, ElementRef, HostListener } from '@angular/core';
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
  elementRef   = inject(ElementRef);

  logouting       = signal(false);
  showLogoutModal = signal(false);

  isProfileMenuOpen = signal(false);
  isMobileMenuOpen = signal(false);

  // Computed — cek apakah user adalah admin
  isAdmin = computed(() => this.authService.currentUser()?.role === 'admin');
  isLoggedIn = computed(() => !!this.authService.currentUser());

  currentUser = computed(() => this.authService.currentUser());

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    // Cek apakah klik ada di dalam navbar atau tidak
    const clickedInsideNavbar = this.elementRef.nativeElement.contains(
      event.target as Node
    );

    // Kalau klik di luar navbar → tutup semua dropdown
    if (!clickedInsideNavbar) {
      this.isProfileMenuOpen.set(false);
      this.isMobileMenuOpen.set(false);
    }
  }
  

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

  openLogoutModal()  { 
    this.showLogoutModal.set(true); 
  }
  closeLogoutModal() { 
    this.showLogoutModal.set(false); 
  }

  toggleProfileMenu(): void {
  this.isProfileMenuOpen.update(prev => !prev);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(prev => !prev);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  openLogoutModalFromDropdown(): void {
    this.isProfileMenuOpen.set(false);
    this.openLogoutModal();
  }

  openLogoutModalFromMobile(): void {
    this.isMobileMenuOpen.set(false);
    this.openLogoutModal();
  }
  
}