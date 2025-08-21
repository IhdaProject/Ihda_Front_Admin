import { inject, Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { TableColumn } from '../types/table';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { types } from 'src/core/enums/types.enum';

@Injectable()
export class TypesService extends CrudService {
    private route = inject(ActivatedRoute);

    override url = 'api-auth/role/getPermissions';
    override title: string = 'types';
    override columns: TableColumn[] = [
        {
            field: 'id'
        },
        {
            field: 'name',
            sortable: true,
            primary: true
        },
        {
            field: 'code'
        }
    ];

    override fields: FormlyFieldConfig[] = [
        {
            key: 'name',
            type: 'input',
            props: {
                translate: true,
                label: 'name',
                placeholder: 'name',
                required: true
            }
        },
    ];

    override update(id: string, model: any): Observable<any> {
        model.typeCode = this.route.snapshot.queryParams['typeCode'];
        return super.update(id, model);
    }
}
