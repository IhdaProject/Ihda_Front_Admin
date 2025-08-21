import { HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import type { ResolveFn } from '@angular/router';
import { map, Observable } from 'rxjs';
import { BaseService } from 'src/core/services/base.service';
import { TypesResponse } from '../types/types';
import { Types } from 'src/core/enums/types.enum';

export const roomTypesResolver: ResolveFn<
    Observable<{ label: string; value: string }[]>
> = (route, state) => {
    const params = new HttpParams()
        .append('page', '0')
        .append('size', '1000')
        .append('typeCode', Types.RoomTypes);
    return inject(BaseService)
        .get<{ content: TypesResponse[] }>('core/types', { params })
        .pipe(
            map((w) =>
                w.content.map((item) => ({ label: item.name, value: item.id }))
            )
        );
};
