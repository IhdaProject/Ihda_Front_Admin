import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse } from '../types/auth';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { Constants } from '../configs/constants';
import { GeneralModel } from 'src/shared/types/general-model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(
        private http: HttpClient,
        private router: Router
    ) {}

    login(username: string, password: string) {
        const url =
            'http://167.86.71.210/gw/api-auth/auth/sign';

        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        const body = { username: username, password: password };

        return this.http.post<GeneralModel<LoginResponse>>(url, body, { headers }).pipe(
            tap((w) => {
                if (w && w.content) {
                    StorageService.accessToken = w.content.accessToken;
                    StorageService.refreshToken = w.content.refreshToken;
                }
            })
        );
    }

    refreshToken(refreshToken: string) {
        const url =
            'http://167.86.71.210/gw/api-auth/auth/refreshtoken';

        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        const body = {
            accessToken: "",
            refreshToken: refreshToken,
            expireRefreshToken: null
         };

        return this.http
            .post<GeneralModel<LoginResponse>>(url, body, { headers })
            .pipe(
                tap((w) => {
                    if (w && w.content) {
                        StorageService.accessToken = w.content.accessToken;
                        StorageService.refreshToken = w.content.refreshToken;
                    }
                })
            );
    }

    logout() {
        const url =
            'http://167.86.71.210/gw/api-auth/auth/logout';

        return this.http
            .delete<GeneralModel<LoginResponse>>(url)
            .pipe(
                tap((w) => {
                    if (w && w.content) {
                        StorageService.remove('access_token');
                        StorageService.remove('refresh_token');
                        this.router.navigate(['/auth/login']);
                    }
                })
            );
    }
}
