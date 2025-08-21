import { inject, Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { TableColumn } from '../types/table';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';
import { SettingsService } from 'src/shared/services/settings.service';
import { TableLazyLoadEvent } from 'primeng/table';
import { GridResponse } from '../types/base.model';
import { StorageCategory } from 'src/core/services/file-storage.service';

@Injectable()
export class SchoolService extends CrudService {
    override url = 'academic/schools';
    override title: string = 'schools';
    override columns: TableColumn[] = [
        {
            field: 'logo',
            type: 'image'
        },
        {
            field: 'code',
            sortable: true
        },
        {
            field: 'name',
            sortable: true,
            primary: true
        },
        // {
        //     field: 'description'
        // },
        {
            field: 'email'
        },
        {
            field: 'phone'
        },
        {
            field: 'address'
        },
        // {
        //     field: 'website'
        // },
        {
            field: 'ordering'
        },
        {
            field: 'active',
            type: 'switcher',
            sortable: true
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
                translate: true,
                label: 'code',
                placeholder: 'code',
                required: true
            }
        },
        {
            key: 'description',
            type: 'textarea',
            props: {
                translate: true,
                label: 'description',
                placeholder: 'description',
                required: true,
                rows: 3
            }
        },
        {
            key: 'address',
            type: 'textarea',
            props: {
                translate: true,
                label: 'address',
                placeholder: 'address',
                required: true,
                rows: 3
            }
        },
        {
            fieldGroupClassName: 'flex gap-4',
            fieldGroup: [
                {
                    key: 'phone',
                    type: 'input-mask',
                    className: 'flex-1',
                    props: {
                        translate: true,
                        label: 'phone',
                        placeholder: '998(99) 99-99-99',
                        mask: '999(99) 999-99-99',
                        unmask: true,
                        required: true
                    }
                },
                {
                    key: 'email',
                    type: 'input',
                    className: 'flex-1',
                    props: {
                        translate: true,
                        label: 'email',
                        placeholder: 'email',
                        required: true
                    }
                }
            ]
        },
        {
            key: 'logo',
            type: 'upload',
            props: {
                translate: true,
                label: 'logo',
                placeholder: 'logo',
                category: StorageCategory.SCHOOL_DOCUMENT,
                required: true
            }
        },
        {
            key: 'website',
            type: 'input',
            props: {
                translate: true,
                label: 'website',
                placeholder: 'website',
                required: true
            }
        },
        {
            key: 'ordering',
            type: 'input-number',
            className: 'w-1/3',
            props: {
                translate: true,
                label: 'ordering',
                placeholder: 'ordering',
                required: true
            }
        },
        {
            key: 'active',
            type: 'checkbox',
            defaultValue: true,
            props: {
                translate: true,
                label: 'active',
                required: true
            }
        }
    ];
}
