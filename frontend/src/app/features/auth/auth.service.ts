import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export interface User {
  id: string;
  name?: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  
  private userState = signal<User | null>(null);
  private loadingState = signal<boolean>(true);

  user = this.userState.asReadonly();
  isLoading = this.loadingState.asReadonly();
  isAuthenticated = computed(() => !!this.userState());

  constructor() {
    this.hydrate();
  }

  private hydrate() {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    console.log('[AuthService] Hydrating from localStorage...', { hasUser: !!savedUser, hasToken: !!token });
    
    if (savedUser && token) {
      try {
        const user = JSON.parse(savedUser);
        console.log('[AuthService] Hydrated user:', user.email);
        this.userState.set(user);
        this.loadingState.set(false);
      } catch (e) {
        console.error('[AuthService] Hydrate error:', e);
        this.logout();
      }
    } else {
      this.loadingState.set(false);
    }
  }

  async checkAuth() {
    console.log('[AuthService] checkAuth triggered');
    this.loadingState.set(true);
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();
      return;
    }

    try {
      const res = await firstValueFrom(this.http.get<User>('/v1/auth/me'));
      this.setSession(token, localStorage.getItem('refreshToken') || '', res);
    } catch {
      this.logout();
    } finally {
      this.loadingState.set(false);
    }
  }

  login(token: string, refreshToken: string, user: User) {
    console.log('[AuthService] Login method called for:', user.email);
    this.setSession(token, refreshToken, user);
  }

  private setSession(token: string, refreshToken: string, user: User) {
    console.log('[AuthService] Setting session in localStorage and updating signal...');
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    this.userState.set(user);
    this.loadingState.set(false);
    console.log('[AuthService] Session set successfully. isAuthenticated:', !!this.userState());
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.userState.set(null);
    this.loadingState.set(false);
  }
}
