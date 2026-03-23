import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../auth.model';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  let user = auth.currentUser();

  if (!user) {
    const storedUser = localStorage.getItem('user_data');
    if (storedUser) {
      user = JSON.parse(storedUser) as User;
      auth.currentUser.set(user);
    }
  }

  if (!user || user.role !== 1) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
