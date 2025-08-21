import { Injectable, OnInit, signal } from '@angular/core';
import { Account } from '../types/account';
import { BehaviorSubject, map, of, switchMap, take, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GeneralModel } from '../types/general-model';

@Injectable({
    providedIn: 'root'
})
export class AccountService {
    currentUser = new BehaviorSubject<Account | null>(null);
    constructor(private http: HttpClient) {
        this.initUser();
    }
    initUser(): void {
        const url = 'http://167.86.71.210/gw/api-auth/';

        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        this.http
            .get<GeneralModel<Account>>(url + 'user/getprofile', { headers })
            .pipe(
                switchMap((profileRes) => {
                    if (profileRes && profileRes.content) {
                        const account = profileRes.content;

                        return this.http
                            .get<
                                GeneralModel<number[]>
                            >(url + 'auth/mypermissions', { headers })
                            .pipe(
                                map((permRes) => {
                                    const permissions = permRes?.content ?? [];
                                    const user: Account = {
                                        ...account,
                                        permissions
                                    };
                                    this.currentUser.next(user);
                                    return user;
                                })
                            );
                    }
                    return of(null);
                }),
                take(1)
            )
            .subscribe();
    }
}
