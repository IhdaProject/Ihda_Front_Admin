import { inject, Injectable } from '@angular/core';
import { TableColumn } from '../types/table';
import { Observable, of } from 'rxjs';
import { BaseService } from 'src/core/services/base.service';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TableLazyLoadEvent } from 'primeng/table';
import { HttpParams } from '@angular/common/http';

@Injectable()
export abstract class CrudService {
    abstract title: string;
    abstract columns: TableColumn[];
    abstract fields: FormlyFieldConfig[];
    model: any = {};

    abstract urlGetAll: string;
    abstract urlCreate: string;
    abstract urlUpdate: string;
    abstract urlDelete: string;

    protected $base = inject(BaseService);

    constructor() {}

    getAll<T>(tableLazyLoadEvent: TableLazyLoadEvent) {
        let params = new HttpParams()
            .append('skip', `${tableLazyLoadEvent.first || 0}`)
            .append('take', `${tableLazyLoadEvent.rows}`);

        const sortField = tableLazyLoadEvent.sortField;
        if (sortField) {
            params = params
                .append(
                    'direction',
                    tableLazyLoadEvent.sortOrder === 1 ? 'ASC' : 'DESC'
                )
                .append('sort', `${[sortField]}`);
        }

        const filters = tableLazyLoadEvent.filters;
        if (filters) {
            Object.entries(filters).forEach(([k, v]) => {
                if (v && !Array.isArray(v))
                    if (v.value) params = params.append(k, v.value);
            });
        }
        return this.$base.get<T>(this.urlGetAll, { params });
    }

    create<T>(model: any): Observable<T> {
        return this.$base.post<T>(this.urlCreate, model);
    }
    update<T>(id: string | undefined, model: any): Observable<T> {
        return this.$base.put<T>(this.urlUpdate, id, model);
    }
    delete<T>(id: number): Observable<T> {
        return this.$base.delete<T>(this.urlDelete, id);
    }

    editModal(id: number): Observable<any> {
        return of(null);
    }
}
