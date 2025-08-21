import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { TableColumn } from '../types/table';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Injectable()
export class UserService extends CrudService {
    override url = 'api-auth/user/getusers';
    override title: string = 'users';
    override columns: TableColumn[] = [
        {
            field: 'fullName',
            sortable: true,
            primary: true
        }
    ];

    override fields: FormlyFieldConfig[] = [
        {
            key: 'fullName',
            type: 'input',
            props: {
                translate: true,
                label: 'firstName',
                placeholder: 'firstName',
                required: true
            }
        }
    ];
}
