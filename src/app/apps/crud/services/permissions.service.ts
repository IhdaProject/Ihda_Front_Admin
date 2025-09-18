import { inject, Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { TableColumn } from '../types/table';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class PermissionsService extends CrudService {
    override urlCreate = 'academic/curriculums/courses';
    override urlUpdate = 'api-auth/role/UpdatePermissionName';
    override urlDelete = 'api-auth/role/UpdatePermission';
    private route = inject(ActivatedRoute);

    override urlGetAll = 'api-auth/role/getPermissions';
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
}
