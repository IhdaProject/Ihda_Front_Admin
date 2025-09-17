import { inject, Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { TableColumn } from '../types/table';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class CountriesService extends CrudService {
    override urlCreate = 'api-rb/country';
    override urlUpdate = 'api-rb/country';
    override urlDelete = 'api-rb/country';
    private route = inject(ActivatedRoute);

    override urlGetAll = 'api-rb/country';
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
            key: 'code',
            type: 'input',
            props: {
                label: 'code',
                placeholder: 'code',
                required: true
            }
        },
    ];
}
