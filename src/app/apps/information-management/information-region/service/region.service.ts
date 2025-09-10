import { GridResponse } from '@/apps/crud/types/base.model';
import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TableLazyLoadEvent } from 'primeng/table';
import { BaseService } from 'src/core/services/base.service';

@Injectable()
export class RegionService {
    readonly url = 'api-rb/region/getall';

    private $base = inject(BaseService);

    getAll(tableLazyLoadEvent: TableLazyLoadEvent) {
        let params = new HttpParams()
            .append(
                'skip',
                `${tableLazyLoadEvent.first}`
            )
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
                    if (v.value != undefined)
                        params = params.append(k, v.value);
            });
        }
        return this.$base.get<GridResponse>(
            `${this.url}`,
            { params }
        );
    }
}
