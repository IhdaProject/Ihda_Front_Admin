import { inject, Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { TableColumn } from '../types/table';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class DistrictsService extends CrudService {
    override urlCreate = 'api-rb/district';
    override urlUpdate = 'api-rb/district';
    override urlDelete = 'api-rb/district';
    private route = inject(ActivatedRoute);

    override urlGetAll = 'api-rb/district';
    override title: string = 'districts';
    override columns: TableColumn[] = [
        {
            field: 'id'
        },
        {
            field: 'name'
        },
        {
            field: 'code'
        },
        {
            field: 'regionName'
        },
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
            key: 'code',
            type: 'input',
            props: {
                label: 'code',
                placeholder: 'code',
                required: true
            }
        },
        {
            key: 'regionId',
            type: 'input',
            props: {
                label: 'regionId',
                placeholder: 'regionId',
                required: true
            }
        },
        {
            key: 'regionName',
            type: 'input',
            props: {
                label: 'regionName',
                placeholder: 'regionName',
                required: true
            }
        },
    ];
}
