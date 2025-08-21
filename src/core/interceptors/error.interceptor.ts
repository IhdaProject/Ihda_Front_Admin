import { ErrorModel } from '@/apps/crud/types/error.model';
import {
    HttpStatusCode,
    type HttpErrorResponse,
    type HttpInterceptorFn
} from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const $notification = inject(MessageService);
    const $router = inject(Router);
    console.log('Request URL: ' + req.url);
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status !== 401) {
                console.error(
                    'Logging Interceptor Functional Error:',
                    error.error
                );
                let e = error.error as ErrorModel;
                if (!e) {
                    e = {
                        error: 'Error',
                        message: error.message,
                        status: error.status,
                        path: error.url
                    };
                }
                $notification.add({
                    severity: 'error',
                    summary: e.error,
                    detail: `${e.status}: ${e.message}`
                });
            }
            return throwError(() => error);
        })
    );
};
