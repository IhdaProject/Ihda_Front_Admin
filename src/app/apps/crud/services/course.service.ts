import { inject, Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { TableColumn } from '../types/table';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { SettingsService } from 'src/shared/services/settings.service';
import { TableLazyLoadEvent } from 'primeng/table';
import { map, Observable } from 'rxjs';
import { GridResponse } from '../types/base.model';
import { Router } from '@angular/router';
import { fullName } from 'src/core/utils/util';

@Injectable()
export class CourseService extends CrudService {
    override urlCreate = 'academic/curriculums/courses';
    override urlUpdate = 'academic/curriculums/courses';
    override urlDelete = 'academic/curriculums/courses';
    private router = inject(Router);

    get curriculum() {
        const urls = this.router.url.split('/');
        return urls[urls.length - 1];
    }

    override urlGetAll = 'academic/curriculums/courses';
    override title: string = 'courses';
    override columns: TableColumn[] = [
        {
            field: 'subjectName',
            header: 'subject',
            primary: true
        },
        {
            field: 'lectureHours'
        },
        {
            field: 'seminarHours'
        },
        {
            field: 'practiceHours'
        },
        {
            field: 'laboratoryHours'
        },
        {
            field: 'credit'
        },
        {
            field: 'from',
            type: 'date'
        },
        {
            field: 'to',
            type: 'date'
        },
        {
            field: 'leaderName',
            header: 'leader'
        },
        {
            field: 'mandatory',
            type: 'switcher'
        }
    ];

    override fields: FormlyFieldConfig[] = [
        {
            key: 'subject',
            type: 'select',
            props: {
                translate: true,
                translateSelectOptions: true,
                label: 'subject',
                placeholder: 'subject',
                required: true,
                appendTo: 'body',
                options: inject(SettingsService).subjects()
            }
        },
        {
            fieldGroupClassName: 'flex gap-4',
            fieldGroup: [
                {
                    key: 'lectureHours',
                    type: 'input-number',
                    className: 'flex-1',
                    props: {
                        translate: true,
                        label: 'lectureHours',
                        placeholder: 'lectureHours',
                        required: true
                    }
                },
                {
                    key: 'seminarHours',
                    type: 'input-number',
                    className: 'flex-1',
                    props: {
                        translate: true,
                        label: 'seminarHours',
                        placeholder: 'seminarHours',
                        required: true
                    }
                }
            ]
        },
        {
            fieldGroupClassName: 'flex gap-4',
            fieldGroup: [
                {
                    key: 'practiceHours',
                    type: 'input-number',
                    className: 'flex-1',
                    props: {
                        translate: true,
                        label: 'practiceHours',
                        placeholder: 'practiceHours',
                        required: true
                    }
                },
                {
                    key: 'laboratoryHours',
                    type: 'input-number',
                    className: 'flex-1',
                    props: {
                        translate: true,
                        label: 'laboratoryHours',
                        placeholder: 'laboratoryHours',
                        required: true
                    }
                },
                {
                    key: 'credit',
                    type: 'input-number',
                    className: 'flex-1',
                    props: {
                        translate: true,
                        label: 'credit',
                        placeholder: 'credit',
                        required: true
                    }
                }
            ]
        },
        {
            fieldGroupClassName: 'flex gap-4',
            fieldGroup: [
                {
                    key: 'from',
                    type: 'datepicker',
                    className: 'w-full',
                    props: {
                        translate: true,
                        label: 'from',
                        placeholder: 'from',
                        required: true,
                        appendTo: 'body'
                    }
                },
                {
                    key: 'to',
                    type: 'datepicker',
                    className: 'w-full',
                    props: {
                        translate: true,
                        label: 'to',
                        placeholder: 'to',
                        required: true,
                        appendTo: 'body'
                    }
                }
            ]
        },
        {
            key: 'leader',
            type: 'select',
            props: {
                translate: true,
                translateSelectOptions: true,
                label: 'leader',
                placeholder: 'leader',
                required: true,
                appendTo: 'body',
                options: inject(SettingsService).teachers()
            }
        },
        {
            key: 'mandatory',
            type: 'checkbox',
            defaultValue: true,
            props: {
                translate: true,
                label: 'mandatory',
                required: true
            }
        }
    ];

    // override getAll(tableLazyLoadEvent: TableLazyLoadEvent): Observable<any> {
    //     if (!tableLazyLoadEvent.filters) {
    //         tableLazyLoadEvent.filters = {};
    //     }
    //     tableLazyLoadEvent.filters = {
    //         ...tableLazyLoadEvent.filters,
    //         curriculum: { value: this.curriculum }
    //     };

    //     return super.getAll(tableLazyLoadEvent).pipe(
    //         map(
    //             (res) =>
    //                 ({
    //                     page: res.page,
    //                     content: res.content.map((w) => ({
    //                         ...w,
    //                         subjectName: w.subject?.name,
    //                         subject: w.subject?.id,
    //                         leaderName: fullName(w.leader.user),
    //                         leader: w.leader?.id,
    //                         from: new Date(w.from),
    //                         to: new Date(w.to)
    //                     }))
    //                 }) as GridResponse
    //         )
    //     );
    // }

    override create(model: any): Observable<any> {
        model.curriculum = this.curriculum;
        return super.create(model);
    }

    override update(id: string, model: any): Observable<any> {
        model.curriculum = this.curriculum;
        return super.update(id, model);
    }
}
