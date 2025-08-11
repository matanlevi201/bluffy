import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import {
  Observable,
  throwError,
  BehaviorSubject,
  catchError,
  filter,
  switchMap,
  take,
} from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!(window as any)._refreshing) {
    (window as any)._refreshing = false;
    (window as any)._refreshTokenSubject = new BehaviorSubject<string | null>(
      null
    );
  }
  const refreshing = (window as any)._refreshing;
  const refreshTokenSubject: BehaviorSubject<string | null> = (window as any)
    ._refreshTokenSubject;

  const authReq = req.clone({ withCredentials: true });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        if (!refreshing) {
          (window as any)._refreshing = true;
          refreshTokenSubject.next(null);

          return authService.refreshToken().pipe(
            switchMap(() => {
              (window as any)._refreshing = false;
              refreshTokenSubject.next('refreshed');
              return next(authReq);
            }),
            catchError((err) => {
              (window as any)._refreshing = false;
              authService.signout().subscribe();
              router.navigate(['/signin']);
              return throwError(() => err);
            })
          );
        } else {
          return refreshTokenSubject.pipe(
            filter((token) => token !== null),
            take(1),
            switchMap(() => next(authReq))
          );
        }
      }
      return throwError(() => error);
    })
  );
};
