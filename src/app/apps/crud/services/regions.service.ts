import { inject, Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { TableColumn } from '../types/table';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ActivatedRoute } from '@angular/router';
import { SettingsService } from 'src/shared/services/settings.service';

@Injectable()
export class RegionsService extends CrudService {
    override urlCreate = 'api-rb/region';
    override urlUpdate = 'api-rb/region';
    override urlDelete = 'api-rb/region';
    private route = inject(ActivatedRoute);
    private $settings = inject(SettingsService);

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
        {
            key: 'countryId',
            type: 'select',
            props: {
                translate: true,
                label: 'country',
                placeholder: 'coutry',
                required: true,
                appendTo: 'body',
                options: this.$settings.getCountries()
            }
        }
    ];
}
