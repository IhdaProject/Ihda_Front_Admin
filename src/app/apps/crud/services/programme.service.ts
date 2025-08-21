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
export class ProgrammeService extends CrudService {
    override url = 'academic/programmes';
    override title: string = 'programmes';
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
            field: 'description',
            sortable: true
        },
        {
            field: 'schoolName',
            header: 'school'
        },
        {
            field: 'degreeTypeName',
            header: 'degreeType'
        },
        {
            field: 'ordering',
            sortable: true
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
            key: 'school',
            type: 'select',
            props: {
                translate: true,
                label: 'school',
                filter: true,
                placeholder: 'school',
                required: true,
                options: inject(SettingsService).schools()
            }
        },
        {
            key: 'degreeType',
            type: 'select',
            props: {
                translate: true,
                label: 'degreeType',
                filter: true,
                placeholder: 'degreeType',
                required: true,
                options: inject(SettingsService).types(Types.DegreeTypes)
            }
        },
        {
            key: 'ordering',
            type: 'input-number',
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

    // override getAll(tableLazyLoadEvent: TableLazyLoadEvent): Observable<any> {
    //     return super.getAll(tableLazyLoadEvent).pipe(
    //         map(
    //             (res) =>
    //                 ({
    //                     page: res.page,
    //                     content: res.content.map((w) => ({
    //                         ...w,
    //                         schoolName: w.school?.name,
    //                         school: w.school?.id,
    //                         degreeTypeName: w.degreeType?.name,
    //                         degreeType: w.degreeType?.id
    //                     }))
    //                 }) as GridResponse
    //         )
    //     );
    // }
}
