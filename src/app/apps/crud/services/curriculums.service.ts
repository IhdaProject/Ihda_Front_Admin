import { inject, Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { TableColumn } from '../types/table';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { SettingsService } from 'src/shared/services/settings.service';
import { Types } from 'src/core/enums/types.enum';
import { TableLazyLoadEvent } from 'primeng/table';
import { map, Observable } from 'rxjs';
import { GridResponse } from '../types/base.model';

@Injectable()
export class CurriculumsService extends CrudService {
    override url = 'academic/curriculums';
    override title: string = 'curriculums';
    override columns: TableColumn[] = [
        {
            field: 'yearName',
            header: 'studyYear',
            primary: true
        },
        {
            field: 'termName',
            header: 'term',
            primary: true
        },
        {
            field: 'startDate',
            type: 'date'
        },
        {
            field: 'endDate',
            type: 'date'
        },
        {
            field: 'programmeName',
            header: 'programme'
        },
        {
            field: 'stageTypeName',
            header: 'stageType'
        },
        {
            field: 'studyFormName',
            header: 'studyForm'
        }
    ];

    override fields: FormlyFieldConfig[] = [
        {
            key: 'year',
            type: 'select',
            props: {
                translate: true,
                translateSelectOptions: true,
                label: 'studyYear',
                placeholder: 'studyYear',
                required: true,
                appendTo: 'body',
                options: inject(SettingsService).years()
            }
        },
        {
            key: 'term',
            type: 'select',
            props: {
                translate: true,
                translateSelectOptions: true,
                label: 'term',
                placeholder: 'term',
                required: true,
                appendTo: 'body',
                // options: inject(SettingsService).terms()
                options: [
                    {
                        label: 'Test',
                        value: '3656372a-8a20-4f7a-8058-e40c479bc288'
                    }
                ]
            }
        },
        {
            fieldGroupClassName: 'flex gap-4',
            fieldGroup: [
                {
                    key: 'startDate',
                    type: 'datepicker',
                    className: 'w-full',
                    props: {
                        translate: true,
                        label: 'startDate',
                        placeholder: 'startDate',
                        required: true,
                        appendTo: 'body'
                    }
                },
                {
                    key: 'endDate',
                    type: 'datepicker',
                    className: 'w-full',
                    props: {
                        translate: true,
                        label: 'endDate',
                        placeholder: 'endDate',
                        required: true,
                        appendTo: 'body'
                    }
                }
            ]
        },
        {
            key: 'programme',
            type: 'select',
            props: {
                translate: true,
                translateSelectOptions: true,
                label: 'programme',
                placeholder: 'programme',
                required: true,
                appendTo: 'body',
                options: inject(SettingsService).programmes()
            }
        },
        {
            key: 'stageType',
            type: 'select',
            props: {
                translate: true,
                translateSelectOptions: true,
                label: 'stageType',
                placeholder: 'stageType',
                required: true,
                appendTo: 'body',
                options: inject(SettingsService).types(Types.StageTypes)
            }
        },
        {
            key: 'studyForm',
            type: 'select',
            props: {
                translate: true,
                translateSelectOptions: true,
                label: 'studyForm',
                placeholder: 'studyForm',
                required: true,
                appendTo: 'body',
                options: inject(SettingsService).types(Types.StudyFormTypes)
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
    //                         yearName: w.year?.name,
    //                         year: w.year?.id,
    //                         termName: w.term?.name,
    //                         term: w.term?.id,
    //                         programmeName: w.programme?.name,
    //                         programme: w.programme?.id,
    //                         stageTypeName: w.stageType?.name,
    //                         stageType: w.stageType?.id,
    //                         studyFormName: w.studyForm?.name,
    //                         studyForm: w.studyForm?.id,
    //                         startDate: new Date(w.startDate),
    //                         endDate: new Date(w.endDate)
    //                     }))
    //                 }) as GridResponse
    //         )
    //     );
    // }
}
