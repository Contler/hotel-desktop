import { inject } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { Router, type CanActivateFn } from '@angular/router';
import { map, tap } from 'rxjs';

export const isLoginGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  return user(auth).pipe(
    map((user) => !!user),
    tap((isLoggedIn) => {
      if (!isLoggedIn) {
        router.navigate(['/login']);
      }
    })
  );
};
