import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../auth.service';
import { BehaviorSubject, firstValueFrom, take } from 'rxjs';

export const authGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  try {
    const currentUser = await firstValueFrom(auth.user$);
    if (currentUser) {
      return true;
    } else {
      await router.navigate(['/signin']);
      return false;
    }
  } catch (error) {
    await router.navigate(['/signin']);
    return false;
  }
};

export const signInRedirectGuard: CanActivateFn = async (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  try {
    const currentUser = await firstValueFrom(auth.user$);
    if (currentUser) {
      await router.navigate(['/']);
      return false;
    } else {
      return true;
    }
  } catch (error) {
    await router.navigate(['/']);
    return false;
  }
};
