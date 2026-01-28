import {
    HTTP_INTERCEPTORS,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpHandler,
    HttpRequest
} from '@angular/common/http';

import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';

const TOKEN_HEADER_KEY = 'Authorization'; // for Spring Boot back-end

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> =
        new BehaviorSubject<any>(null);

    constructor(private authService: AuthService) {}

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<Object>> {
        let authReq = req;
        const token = StorageService.accessToken;

        if (token != null) {
            authReq = this.addTokenHeader(req, token);
        }

        return next.handle(authReq).pipe(
            catchError((error) => {
                if (
                    error instanceof HttpErrorResponse &&
                    error.status === 401
                ) {
                    return this.handle401Error(authReq, next);
                }

                return throwError(() => error);
            })
        );
    }

    private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            const token = StorageService.refreshToken;

            if (token)
                return this.authService.refreshToken(token).pipe(
                    switchMap((res) => {
                        this.isRefreshing = false;
                        return next.handle(
                            this.addTokenHeader(
                                request,
                                res.content.accessToken
                            )
                        );
                    }),
                    catchError((err) => {
                        if (
                            err instanceof HttpErrorResponse &&
                            err.status === 401
                        ) {
                            this.isRefreshing = false;
                            this.authService.logoutLocal();
                        }

                        return throwError(() => err);
                    })
                );
        }

        return this.refreshTokenSubject.pipe(
            filter((token) => token !== null),
            take(1),
            switchMap((token) =>
                next.handle(this.addTokenHeader(request, token))
            )
        );
    }

    private addTokenHeader(request: HttpRequest<any>, token: string) {
        /* for Spring Boot back-end */
        // return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });

        /* for Node.js Express back-end */
        return request.clone({
            headers: request.headers.set(TOKEN_HEADER_KEY, `Bearer ${token}`)
        });
    }
}
