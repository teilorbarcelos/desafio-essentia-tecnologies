import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, filter, firstValueFrom, Observable, take, throwError, finalize } from 'rxjs';

export interface User {
  id: string;
  name?: string;
  email: string;
}

interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private userState = signal<User | null>(null);
  private loadingState = signal<boolean>(true);
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  user = this.userState.asReadonly();
  isLoading = this.loadingState.asReadonly();
  isAuthenticated = computed(() => !!this.userState());

  constructor() {
    this.hydrate();
  }

  private hydrate() {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (savedUser && token) {
      try {
        const user = JSON.parse(savedUser);
        this.userState.set(user);
        this.loadingState.set(false);
      } catch (e) {
        this.logout();
      }
    } else {
      this.loadingState.set(false);
    }
  }

  async checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return;
    }

    this.loadingState.set(true);
    try {
      const res = await firstValueFrom(this.http.get<User>('/v1/auth/me'));
      this.setSession(token, localStorage.getItem('refreshToken') || '', res);
    } catch (err: any) {
      console.warn('[AuthService] checkAuth /me failed, status:', err.status);
      // Se falhar o /me por 401, o interceptor já deve ter tentado o refresh.
      // Se cair aqui e continuar sem user, deslogamos.
      if (!this.userState()) {
        this.logout();
      }
    } finally {
      this.loadingState.set(false);
    }
  }

  handleRefreshToken(): Observable<string> {
    if (this.isRefreshing) {
      console.log('[AuthService] Refresh already in progress, waiting...');
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1)
      ) as Observable<string>;
    }

    console.log('[AuthService] Starting refresh token request...');
    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      console.error('[AuthService] No refresh token found in storage!');
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }

    return new Observable<string>(observer => {
      this.http.post<AuthResponse>('/v1/auth/refresh', { refreshToken }).pipe(
        finalize(() => {
          this.isRefreshing = false;
        })
      ).subscribe({
        next: (res) => {
          console.log('[AuthService] Refresh success! Updating session.');
          this.setSession(res.token, res.refreshToken, res.user);
          this.refreshTokenSubject.next(res.token);
          observer.next(res.token);
          observer.complete();
        },
        error: (err) => {
          console.error('[AuthService] Refresh request failed:', err);
          this.logout();
          observer.error(err);
        }
      });
    });
  }

  login(token: string, refreshToken: string, user: User) {
    this.setSession(token, refreshToken, user);
  }

  private setSession(token: string, refreshToken: string, user: User) {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    this.userState.set(user);
    this.loadingState.set(false);
  }

  logout() {
    console.log('[AuthService] Logging out and clearing storage.');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.userState.set(null);
    this.loadingState.set(false);
    this.router.navigate(['/login']);
  }
}
