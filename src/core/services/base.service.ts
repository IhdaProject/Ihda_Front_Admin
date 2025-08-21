import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { shareReplay } from 'rxjs';
import { DatePipe } from '@angular/common';
import { DITokens } from '../utils/di.tokens';

@Injectable({
    providedIn: 'root'
})
export class BaseService {
    constructor(
        private http: HttpClient,
        @Inject(DITokens.API_BASE_URL) private apiBaseUrl: string,
        private $datePipe: DatePipe
    ) {}

    post<T>(
        path: string,
        body: any,
        options?: {
            headers?:
                | HttpHeaders
                | {
                      [header: string]: string | string[];
                  };
        }
    ) {
        this.transformDatesInBody<T>(body);
        return this.http
            .post<T>(`${this.apiBaseUrl}/${path}`, body, options)
            .pipe(shareReplay(1));
    }

    get<T>(
        path: string,
        obj?: {
            queryParams?: any;
            params?: HttpParams;
            headers?:
                | HttpHeaders
                | {
                      [header: string]: string | string[];
                  };
            responseType?:
                | 'json'
                | 'text'
                | 'blob'
                | 'arraybuffer'
                | 'json'
                | undefined;
        }
    ) {
        const params = obj?.params
            ? obj.params
            : new HttpParams({ fromObject: obj?.queryParams });
        return this.http
            .get<T>(`${this.apiBaseUrl}/${path}`, {
                params,
                headers: obj?.headers,
                responseType: obj?.responseType as any
            })
            .pipe(shareReplay(1));
    }

    put<T>(
        path: string,
        id?: string,
        body?: any,
        options?: {
            headers?:
                | HttpHeaders
                | {
                      [header: string]: string | string[];
                  };
        }
    ) {
        this.transformDatesInBody<T>(body);
        return this.http.put<T>(
            id
                ? `${this.apiBaseUrl}/${path}/${id}`
                : `${this.apiBaseUrl}/${path}`,
            body,
            options
        );
    }

    delete<T>(
        path: string,
        id: number,
        options?: {
            headers?:
                | HttpHeaders
                | {
                      [header: string]: string | string[];
                  };
        }
    ) {
        return this.http.delete<T>(`${this.apiBaseUrl}/${path}/${id}`, options);
    }

    private transformDatesInBody<T>(body: any) {
        if (body) {
            if (typeof body === 'object') {
                Object.keys(body).forEach((key) => {
                    if (body[key] instanceof Date) {
                        body[key] = this.$datePipe.transform(
                            body[key],
                            'yyyy-MM-dd'
                        );
                    }
                });
            }
        }
    }
}
