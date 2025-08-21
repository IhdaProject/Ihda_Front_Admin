import { inject, Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { TableColumn } from '../types/table';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';
import { SettingsService } from 'src/shared/services/settings.service';
import { TableLazyLoadEvent } from 'primeng/table';
import { GridResponse } from '../types/base.model';
import { Types } from 'src/core/enums/types.enum';

@Injectable()
export class SubjectService extends CrudService {
    override url = 'academic/subjects';
    override title: string = 'subjects';
    override columns: TableColumn[] = [
        {
            field: 'code',
            sortable: true
        },
        {
            field: 'name',
            sortable: true,
            primary: true
        },
        {
            field: 'poster',
            sortable: true
        },
        {
            field: 'stageTypeName',
            header: 'stageType'
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
            key: 'poster',
            type: 'input',
            props: {
                translate: true,
                label: 'poster',
                required: true,
                placeholder: 'test'
            }
        },
        {
            key: 'stageType',
            type: 'select',
            props: {
                translate: true,
                label: 'stageType',
                filter: true,
                placeholder: 'stageType',
                required: true,
                appendTo: 'body',
                options: inject(SettingsService).types(Types.StageTypes)
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

    // override getAll(tableLazyLoadEvent: TableLazyLoadEvent): Observable<any> {
    //     return super.getAll(tableLazyLoadEvent).pipe(
    //         map(
    //             (res) =>
    //                 ({
    //                     page: res.page,
    //                     content: res.content.map((w) => ({
    //                         ...w,
    //                         stageTypeName: w.stageType?.name,
    //                         stageType: w.stageType?.id
    //                     }))
    //                 }) as GridResponse
    //         )
    //     );
    // }
}
