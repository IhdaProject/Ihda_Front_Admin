import { inject, Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { TableColumn } from '../types/table';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { userTypes } from 'src/core/enums/user-types.enum';
import { map, Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { TableLazyLoadEvent } from 'primeng/table';
import { GridResponse } from '../types/base.model';

@Injectable()
export class YearService extends CrudService {
    override url = 'academic/years';
    override title: string = 'years';
    override columns: TableColumn[] = [
        {
            field: 'name',
            sortable: true,
            primary: true
        },
        {
            field: 'admissionYear',
            sortable: true
        },
        {
            field: 'code'
        },
        {
            field: 'startOfYear',
            type: 'date'
        },
        {
            field: 'endOfYear',
            type: 'date'
        },
        {
            field: 'currentYear',
            type: 'yesNo'
        }
    ];

    override fields: FormlyFieldConfig[] = [
        {
            key: 'name',
            type: 'input',
            props: {
                translate: true,
                label: 'name',
                placeholder: '2023-2024',
                required: true
            }
        },
        {
            key: 'code',
            type: 'input',
            props: {
                translate: true,
                label: 'code',
                placeholder: 'Y2023',
                required: true
            }
        },
        {
            key: 'admissionYear',
            type: 'input-number',
            props: {
                translate: true,
                label: 'admissionYear',
                placeholder: '2023',
                required: true,
                useGrouping: false
            }
        },
        {
            fieldGroupClassName: 'flex gap-4',
            fieldGroup: [
                {
                    key: 'startOfYear',
                    type: 'datepicker',
                    className: 'w-full',
                    props: {
                        translate: true,
                        label: 'startOfYear',
                        placeholder: 'startOfYear',
                        required: true,
                        appendTo: 'body'
                    }
                },
                {
                    key: 'endOfYear',
                    type: 'datepicker',
                    className: 'w-full',
                    props: {
                        translate: true,
                        label: 'endOfYear',
                        placeholder: 'endOfYear',
                        required: true,
                        appendTo: 'body'
                    }
                }
            ]
        },
        {
            key: 'currentYear',
            type: 'checkbox',
            defaultValue: true,
            props: {
                translate: true,
                label: 'currentYear',
                required: true
            }
        }
    ];

    // override getAll(
    //     tableLazyLoadEvent: TableLazyLoadEvent
    // ): Observable<GridResponse> {
    //     return super.getAll(tableLazyLoadEvent).pipe(
    //         map((w) => ({
    //             content: w.content.map((item) => ({
    //                 ...item,
    //                 startOfYear: new Date(item.startOfYear),
    //                 endOfYear: new Date(item.endOfYear)
    //             })),
    //             page: w.page
    //         }))
    //     );
    // }
}
