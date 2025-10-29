import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthUtils } from '../utils/auth.utils';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';
import { AccountService } from 'src/shared/services/account.service';

export const authGuard: CanActivateFn = (route, state) => {
    const $router = inject(Router);
    const $auth = inject(AuthService);
    const $account = inject(AccountService);

    if (AuthUtils.isTokenExpired(StorageService.accessToken)) {
        $router.navigate(['/auth/login']);
        return false;
    }


    return $account.initUser().pipe(
        map((user) => {
            return user != null;
        }),
        catchError(() => {
            $router.navigate(['/auth/login']);
            return of(false);
        })
    );
};
