import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthUtils } from '../utils/auth.utils';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
    const $router = inject(Router);
    const $auth = inject(AuthService);

    if (AuthUtils.isTokenExpired(StorageService.accessToken)) {
        const refreshToken = StorageService.refreshToken;
        if (AuthUtils.isTokenExpired(refreshToken)) {
            $router.navigate(['/auth/login']);
            return false;
        }

        return $auth.refreshToken(refreshToken).pipe(
            catchError(() => of(false)),
            map((w) => !!w)
        );
    }

    return true;
};
