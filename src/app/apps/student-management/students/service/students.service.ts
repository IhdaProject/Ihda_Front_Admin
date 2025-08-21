import { GridResponse } from '@/apps/crud/types/base.model';
import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TableLazyLoadEvent } from 'primeng/table';
import { Stage } from 'src/core/enums/stage.enum';
import { BaseService } from 'src/core/services/base.service';

@Injectable()
export class StudentsService {
    readonly url = 'management/students';

    private $base = inject(BaseService);

    getAll(tableLazyLoadEvent: TableLazyLoadEvent, stage: Stage) {
        let params = new HttpParams()
            .append(
                'page',
                `${(tableLazyLoadEvent.first || 0) / (tableLazyLoadEvent.rows || 1)}`
            )
            .append('size', `${tableLazyLoadEvent.rows}`);

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
            `${this.url}/${stage === Stage.UNASSIGNED ? 'unassigned' : 'assigned'}`,
            { params }
        );
    }
}
