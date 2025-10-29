import { inject, Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { TableColumn } from '../types/table';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ActivatedRoute } from '@angular/router';
import { SettingsService } from 'src/shared/services/settings.service';

@Injectable()
export class StructuresService extends CrudService {
    private route = inject(ActivatedRoute);
    private $settings = inject(SettingsService);

    override urlGetAll = 'api-auth/role/getallstructures';
    override urlCreate = 'api-auth/role/CreateStructure';
    override urlUpdate = 'api-auth/role/EditStructure';
    override urlDelete = 'api-auth/role/DeleteStructure';
    override title: string = 'structures';
    override columns: TableColumn[] = [
        {
            field: 'id'
        },
        {
            field: 'name',
            sortable: true,
            primary: true
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
        {
            key: 'permissionIds',
            type: 'multicheckbox',
            props: {
                translate: true,
                label: 'permissionIds',
                placeholder: 'permissionIds',
                required: true,
                appendTo: 'body',
                multiple: true,
                options: this.$settings.getPermissions()
            }
        }
    ];
}
