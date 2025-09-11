import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { BaseService } from 'src/core/services/base.service';

@Injectable({ providedIn: 'root' })
export class PermissionsService {
  private permissions$ = new BehaviorSubject<any[]>([]);
  private loadedAll = false;
  private page = 0;
  private readonly pageSize = 50;

  constructor(private base: BaseService) {}

  loadMore(): Observable<any[]> {
    if (this.loadedAll) {
      return of(this.permissions$.value);
    }

    const params = new HttpParams()
      .append('skip', `${this.page * this.pageSize}`)
      .append('take', `${this.pageSize}`);

    return this.base.get<any[]>('api-auth/role/getpermissions', { params }).pipe(
      tap((res) => {
        if (!res || res.length < this.pageSize) {
          this.loadedAll = true;
        }
        this.page++;
        this.permissions$.next([...this.permissions$.value, ...res]);
      })
    );
  }

  all$(): Observable<any[]> {
    return this.permissions$.asObservable();
  }
}
