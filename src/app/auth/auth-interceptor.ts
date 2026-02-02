import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthService} from './auth.service';
import {catchError, of, switchMap, throwError} from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = localStorage.getItem('access_token');

  // 1. Clonamos añadiendo SIEMPRE el Accept y el Token si existe
  let authReq = req.clone({
    setHeaders: {
      'Accept': 'application/json', // <--- Fundamental para Laravel
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  });

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      // Evitar bucles en login o refresh
      if (req.url.includes('/refresh') || req.url.includes('/login')) {
        return auth.logout().pipe(
          catchError(() => of(null)),
          switchMap(() => throwError(() => err))
        );
      }

      // Si es 401, intentamos refrescar
      if (err.status === 401) {
        return auth.refreshToken().pipe(
          switchMap((res) => {
            const newToken = res.access_token;
            const retryReq = req.clone({
              setHeaders: {
                'Authorization': `Bearer ${newToken}`,
                'Accept': 'application/json'
              }
            });
            return next(retryReq);
          }),
          catchError((refreshErr) => {
            return auth.logout().pipe(
              catchError(() => of(null)),
              switchMap(() => throwError(() => refreshErr))
            );
          })
        );
      }
      return throwError(() => err);
    })
  );
};
