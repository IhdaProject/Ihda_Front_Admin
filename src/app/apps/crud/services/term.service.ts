import { inject, Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { TableColumn } from '../types/table';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { map, Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { TableLazyLoadEvent } from 'primeng/table';
import { GridResponse } from '../types/base.model';
import { termTypes } from 'src/core/enums/term-type.enum';
import { SettingsService } from 'src/shared/services/settings.service';

@Injectable()
export class TermService extends CrudService {
    override urlCreate = 'academic/curriculums/courses';
    override urlUpdate = 'academic/curriculums/courses';
    override urlDelete = 'academic/curriculums/courses';
    override urlGetAll = 'academic/terms';
    override title: string = 'terms';
    override columns: TableColumn[] = [
        {
            field: 'name',
            sortable: true,
            primary: true
        },
        {
            field: 'academicName'
        },
        {
            field: 'yearModel.name',
            header: 'year'
        },
        {
            field: 'startDate',
            type: 'date'
        },
        {
            field: 'endDate',
            type: 'date'
        },
        // {
        //     field: 'registrationStartDate',
        //     type: 'date'
        // },
        // {
        //     field: 'registrationEndDate',
        //     type: 'date'
        // },
        {
            field: 'termType'
        },
        {
            field: 'weekCount'
        },

        {
            field: 'notes'
        },
        {
            field: 'active',
            type: 'switcher'
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
            key: 'academicName',
            type: 'input',
            props: {
                translate: true,
                label: 'academicName',
                placeholder: 'academicName',
                required: true
            }
        },
        {
            fieldGroupClassName: 'flex gap-4',
            fieldGroup: [
                {
                    key: 'year',
                    type: 'select',
                    className: 'flex-1',
                    props: {
                        translate: true,
                        label: 'year',
                        filter: true,
                        placeholder: 'year',
                        required: true,
                        appendTo: 'body',
                        options: inject(SettingsService).years()
                    }
                },
                {
                    key: 'termType',
                    type: 'select',
                    className: 'flex-1',
                    props: {
                        translate: true,
                        translateSelectOptions: true,
                        label: 'termType',
                        placeholder: 'termType',
                        required: true,
                        appendTo: 'body',
                        options: termTypes()
                    }
                }
            ]
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
            fieldGroupClassName: 'flex gap-4',
            fieldGroup: [
                {
                    key: 'registrationStartDate',
                    type: 'datepicker',
                    className: 'w-full',
                    props: {
                        translate: true,
                        label: 'registrationStartDate',
                        placeholder: 'registrationStartDate',
                        appendTo: 'body'
                    }
                },
                {
                    key: 'registrationEndDate',
                    type: 'datepicker',
                    className: 'w-full',
                    props: {
                        translate: true,
                        label: 'registrationEndDate',
                        placeholder: 'registrationEndDate',
                        appendTo: 'body'
                    }
                }
            ]
        },
        {
            key: 'weekCount',
            type: 'input-number',
            className: 'flex-1',
            props: {
                translate: true,
                label: 'weekCount',
                placeholder: 'weekCount'
            }
        },
        {
            key: 'notes',
            type: 'input',
            props: {
                translate: true,
                label: 'notes',
                placeholder: 'notes'
            }
        },
        {
            key: 'active',
            type: 'checkbox',
            defaultValue: true,
            props: {
                translate: true,
                label: 'active'
            }
        }
    ];

    private $date = inject(DatePipe);

    // override getAll(
    //     tableLazyLoadEvent: TableLazyLoadEvent
    // ): Observable<GridResponse> {
    //     return super.getAll(tableLazyLoadEvent).pipe(
    //         map((w) => ({
    //             content: w.content.map((item) => ({
    //                 ...item,
    //                 yearModel: item.year,
    //                 year: item.year.id,
    //                 startDate: new Date(item.startDate),
    //                 endDate: new Date(item.endDate),
    //                 registrationStartDate: new Date(item.registrationStartDate),
    //                 registrationEndDate: new Date(item.registrationEndDate)
    //             })),
    //             page: w.page
    //         }))
    //     );
    // }

    override create(model: any): Observable<any> {
        return super.create(model);
    }

    override update(id: string, model: any): Observable<any> {
        return super.update(id, model);
    }
}
