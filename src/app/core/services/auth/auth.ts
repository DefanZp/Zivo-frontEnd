import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { RegisterRequest } from '../../models/auth/register-request.model';
import { AuthResponse } from '../../models/auth/auth-response.model';
import { LoginRequest } from '../../models/auth/login-request.model';
import { User } from '../../models/auth/user.model';
import { environment } from '../../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl;

  private platformId = inject(PLATFORM_ID);

  // Mengecek apakah kode dijalankan di browser 
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  // Api
  register(data: RegisterRequest) {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/register`, 
      data
    );
  }

  login(data: LoginRequest) {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/login`,
      data
    )
  }

  logout() {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/logout`,
      {}
    )
  }

  // Local Storage

  // simpan token ke localStorage
  saveToken(token: string): void {
    // update Signal
    this.tokenSignal.set(token);

    if (!this.isBrowser()) {
      return;
    }

    localStorage.setItem('token', token);
  }

  // dapatkan token dari localStorage
  loadToken(): string | null {
    if (!this.isBrowser()) {
      return null;
    }
    return localStorage.getItem('token');
  }

  // hapus token dari localStorage
  clearToken(): void {

    // update Signal
    this.tokenSignal.set('');
    
    if (!this.isBrowser()) {
      return;
    }

    localStorage.removeItem('token');
  }

  saveUser(user: User): void {
    // update Signal
    this.userSignal.set(user);

    if (!this.isBrowser()) {
      return;
    }

    localStorage.setItem(
      'user', 
      JSON.stringify(user)
    );
  }

  loadUser(): User | null {

    if (!this.isBrowser()) {
      return null;
    }

    const user = localStorage.getItem('user');

    if (!user) {
      return null;
    }

    return JSON.parse(user);
  }

  clearUser():void {
    // Update Signal
    this.userSignal.set(null);

    if (!this.isBrowser()) {
      return;
    }

    localStorage.removeItem('user');
  }

  // Signal state

  private userSignal = signal<User | null>(
    this.loadUser()
  );

  private tokenSignal = signal<string | null>(
    this.loadToken()
  );

  // Helper

  currentUser() {
    return this.userSignal();
  }

  currentToken() {
    return this.tokenSignal();
  }

  isLoggedIn() {
    return this.tokenSignal() !== null;
  }

  isAdmin() {
    const user = this.userSignal();

    return user?.role === 'admin';
  }

  clearAuth():void {
    this.clearToken();
    this.clearUser();
  }

  updateUser(user: User): void {
    this.saveUser(user);
  }
}
