import { inject, Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { TableColumn } from '../types/table';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class RegionsService extends CrudService {
    override urlCreate = 'api-rb/region';
    override urlUpdate = 'api-rb/region';
    override urlDelete = 'api-rb/region';
    private route = inject(ActivatedRoute);

    override urlGetAll = 'api-rb/region';
    override title: string = 'countries';
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
            field: 'countryName'
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
            key: 'countryId',
            type: 'input',
            props: {
                label: 'countryId',
                placeholder: 'countryId',
                required: true
            }
        },
        {
            key: 'countryName',
            type: 'input',
            props: {
                label: 'countryName',
                placeholder: 'countryIdName',
                required: true
            }
        },
    ];
}
