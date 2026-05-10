import { HttpInterceptorFn, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';

interface RefreshResponse {
  token: string;
  refreshToken: string;
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const http = inject(HttpClient);
  const token = localStorage.getItem('token');

  let authReq = req;
  if (token) {
    console.log('[authInterceptor] Adding token to request');
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log('[authInterceptor] Caught error:', error.status, error.url);
      const isLoginRequest = req.url.includes('/v1/auth/login');
      const isRefreshRequest = req.url.includes('/v1/auth/refresh');

      if (error.status === 401 && !isLoginRequest && !isRefreshRequest) {
        console.log('[authInterceptor] 401 Error, attempting refresh...');
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          return http.post<RefreshResponse>('/v1/auth/refresh', { refreshToken }).pipe(
            switchMap((res) => {
              console.log('[authInterceptor] Refresh successful, retrying request');
              localStorage.setItem('token', res.token);
              localStorage.setItem('refreshToken', res.refreshToken);

              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${res.token}`,
                },
              });
              return next(retryReq);
            }),
            catchError((refreshError) => {
              console.error('[authInterceptor] Refresh failed, logging out', refreshError);
              localStorage.removeItem('token');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('user');
              router.navigate(['/login']);
              return throwError(() => refreshError);
            }),
          );
        } else {
          console.log('[authInterceptor] No refresh token found, logging out');
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          router.navigate(['/login']);
        }
      }
      return throwError(() => error);
    }),
  );
};
