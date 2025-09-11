import { inject, Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { TableColumn } from '../types/table';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { userTypes } from 'src/core/enums/user-types.enum';
import { map, Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { TableLazyLoadEvent } from 'primeng/table';
import { GridResponse } from '../types/base.model';
import { shifts } from 'src/core/enums/shift.enum';

@Injectable()
export class TimeSlotService extends CrudService {
    override urlCreate = 'academic/curriculums/courses';
    override urlUpdate = 'academic/curriculums/courses';
    override urlDelete = 'academic/curriculums/courses';
    override urlGetAll = 'schedule/time-slots';
    override title: string = 'timeSlots';
    override columns: TableColumn[] = [
        {
            field: 'label',
            sortable: true,
            primary: true
        },
        {
            field: 'order',
            sortable: true
        },
        {
            field: 'start',
            type: 'time'
        },
        {
            field: 'end',
            type: 'time'
        },
        {
            field: 'checkinStart',
            type: 'time'
        },
        {
            field: 'checkinEnd',
            type: 'time'
        },

        {
            field: 'checkoutStart',
            type: 'time'
        },
        {
            field: 'checkoutEnd',
            type: 'time'
        }
    ];

    override fields: FormlyFieldConfig[] = [
        {
            key: 'label',
            type: 'input',
            props: {
                translate: true,
                label: 'label',
                placeholder: 'label',
                required: true
            }
        },
        {
            key: 'shift',
            type: 'select',
            props: {
                translate: true,
                translateSelectOptions: true,
                label: 'shift',
                placeholder: 'shift',
                required: true,
                appendTo: 'body',
                options: shifts()
            }
        },
        {
            key: 'order',
            type: 'input-number',
            props: {
                translate: true,
                label: 'order',
                placeholder: 'order',
                required: true
            }
        },
        {
            fieldGroupClassName: 'flex gap-4',
            fieldGroup: [
                {
                    key: 'start',
                    type: 'datepicker',
                    className: 'w-full',
                    props: {
                        translate: true,
                        label: 'start',
                        placeholder: 'start',
                        required: true,
                        timeOnly: true,
                        appendTo: 'body'
                    }
                },
                {
                    key: 'end',
                    type: 'datepicker',
                    className: 'w-full',
                    props: {
                        translate: true,
                        label: 'end',
                        placeholder: 'end',
                        required: true,
                        timeOnly: true,
                        appendTo: 'body'
                    }
                }
            ]
        },
        {
            fieldGroupClassName: 'flex gap-4',
            fieldGroup: [
                {
                    key: 'checkinStart',
                    type: 'datepicker',
                    className: 'w-full',
                    props: {
                        translate: true,
                        label: 'checkinStart',
                        placeholder: 'checkinStart',
                        required: true,
                        timeOnly: true,
                        appendTo: 'body'
                    }
                },
                {
                    key: 'checkinEnd',
                    type: 'datepicker',
                    className: 'w-full',
                    props: {
                        translate: true,
                        label: 'checkinEnd',
                        placeholder: 'checkinEnd',
                        required: true,
                        timeOnly: true,
                        appendTo: 'body'
                    }
                }
            ]
        },
        {
            fieldGroupClassName: 'flex gap-4',
            fieldGroup: [
                {
                    key: 'checkoutStart',
                    type: 'datepicker',
                    className: 'w-full',
                    props: {
                        translate: true,
                        label: 'checkoutStart',
                        placeholder: 'checkoutStart',
                        required: true,
                        timeOnly: true,
                        appendTo: 'body'
                    }
                },
                {
                    key: 'checkoutEnd',
                    type: 'datepicker',
                    className: 'w-full',
                    props: {
                        translate: true,
                        label: 'checkoutEnd',
                        placeholder: 'checkoutEnd',
                        required: true,
                        timeOnly: true,
                        appendTo: 'body'
                    }
                }
            ]
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
    //                 start: this.makeDateFromTime(item.start),
    //                 end: this.makeDateFromTime(item.end),
    //                 checkinStart: this.makeDateFromTime(item.checkinStart),
    //                 checkinEnd: this.makeDateFromTime(item.checkinEnd),
    //                 checkoutStart: this.makeDateFromTime(item.checkoutStart),
    //                 checkoutEnd: this.makeDateFromTime(item.checkoutEnd)
    //             })),
    //             page: w.page
    //         }))
    //     );
    // }

    override create(model: any): Observable<any> {
        model.start = this.$date.transform(model.start, 'HH:mm');
        model.end = this.$date.transform(model.end, 'HH:mm');
        model.checkinStart = this.$date.transform(model.checkinStart, 'HH:mm');
        model.checkinEnd = this.$date.transform(model.checkinEnd, 'HH:mm');
        model.checkoutStart = this.$date.transform(
            model.checkoutStart,
            'HH:mm'
        );
        model.checkoutEnd = this.$date.transform(model.checkoutEnd, 'HH:mm');
        return super.create(model);
    }

    override update(id: string, model: any): Observable<any> {
        model.start = this.$date.transform(model.start, 'HH:mm');
        model.end = this.$date.transform(model.end, 'HH:mm');
        model.checkinStart = this.$date.transform(model.checkinStart, 'HH:mm');
        model.checkinEnd = this.$date.transform(model.checkinEnd, 'HH:mm');
        model.checkoutStart = this.$date.transform(
            model.checkoutStart,
            'HH:mm'
        );
        model.checkoutEnd = this.$date.transform(model.checkoutEnd, 'HH:mm');
        return super.update(id, model);
    }

    private makeDateFromTime(time: string) {
        const [hours, minutes, seconds] = time.split(':');

        const date = new Date();
        date.setHours(+hours);
        date.setMinutes(+minutes);
        date.setSeconds(+seconds);
        date.setMilliseconds(0);
        return date;
    }
}
