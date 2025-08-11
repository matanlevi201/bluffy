import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { CurrentUserService } from '../services/current-user.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const currentUserService = inject(CurrentUserService);
  const router = inject(Router);

  return currentUserService
    .loadUser()
    .pipe(
      map((currentUser) =>
        currentUser ? true : router.createUrlTree(['/signin'])
      )
    );
};
