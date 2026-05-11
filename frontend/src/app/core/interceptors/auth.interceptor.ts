import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../features/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const injector = inject(Injector);
  const token = localStorage.getItem('token');

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Evitamos interceptar erros de rotas de auth para não entrar em loop
      const isAuthRequest = req.url.includes('/v1/auth/');
      const isRefreshRequest = req.url.includes('/refresh');

      if (error.status === 401 && !isRefreshRequest) {
        console.warn('[authInterceptor] 401 Detectado em:', req.url);
        
        // Se for 401 na própria tentativa de login, não fazemos nada
        if (req.url.includes('/login')) {
          return throwError(() => error);
        }

        // Obtemos o AuthService de forma Lazy para evitar dependência circular
        const authService = injector.get(AuthService);

        console.log('[authInterceptor] Iniciando fluxo de refresh...');
        return authService.handleRefreshToken().pipe(
          switchMap((newToken) => {
            console.log('[authInterceptor] Refresh concluído, repetindo request original...');
            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`,
              },
            });
            return next(retryReq);
          }),
          catchError((refreshError) => {
            console.error('[authInterceptor] Falha crítica no refresh:', refreshError);
            return throwError(() => refreshError);
          })
        );
      }

      return throwError(() => error);
    }),
  );
};
