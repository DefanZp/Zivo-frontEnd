import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { Auth } from '../services/auth/auth';

export const adminGuard: CanActivateFn = () => {

  // Mengambil AuthService
  const authService = inject(Auth);

  // Mengambil Router
  const router = inject(Router);


  // Jika belum login,
  // arahkan ke halaman login.
  if (!authService.isLoggedIn()) {

    router.navigate(['/auth/login']);

    return false;

  }

  // Jika bukan admin,
  // arahkan ke halaman utama.
  if (!authService.isAdmin()) {

    router.navigate(['/']);

    return false;

  }

  // Jika login dan admin,
  // izinkan membuka halaman.
  return true;

};