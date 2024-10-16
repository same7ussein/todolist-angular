import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const _platformId: Object = inject(PLATFORM_ID);
  if (isPlatformBrowser(_platformId)) {
    const userName = localStorage.getItem('userName');
    if (userName) {
      return true;
    } else {
      router.navigate(['/login']);
      return false;
    }
  }
  return false;
};
