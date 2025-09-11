import { inject, Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { TableColumn } from '../types/table';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { map, Observable } from 'rxjs';
import { SettingsService } from 'src/shared/services/settings.service';
import { TableLazyLoadEvent } from 'primeng/table';
import { GridResponse } from '../types/base.model';

@Injectable()
export class RoomService extends CrudService {
    override urlCreate = 'academic/curriculums/courses';
    override urlUpdate = 'academic/curriculums/courses';
    override urlDelete = 'academic/curriculums/courses';
    override urlGetAll = 'academic/rooms';
    override title: string = 'rooms';
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
            field: 'description'
        },
        {
            field: 'capacity',
            sortable: true
        },
        {
            field: 'roomTypeName',
            header: 'roomType'
        },
        {
            field: 'buildingName',
            header: 'building'
        },
        {
            field: 'floor',
            sortable: true
        },
        {
            field: 'active',
            type: 'switcher',
            sortable: true
        },
        {
            field: 'showOnTimetable',
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
            fieldGroupClassName: 'flex gap-4',
            fieldGroup: [
                {
                    key: 'roomType',
                    type: 'select',
                    className: 'flex-1',
                    props: {
                        translate: true,
                        label: 'roomType',
                        filter: true,
                        placeholder: 'roomType',
                        required: true,
                        options: inject(SettingsService).getRoomTypes()
                    }
                },
                {
                    key: 'capacity',
                    type: 'input-number',
                    className: 'flex-1',
                    props: {
                        translate: true,
                        label: 'capacity',
                        placeholder: 'capacity',
                        required: true
                    }
                }
            ]
        },
        {
            fieldGroupClassName: 'flex gap-4',
            fieldGroup: [
                {
                    key: 'building',
                    type: 'select',
                    className: 'flex-1',
                    props: {
                        translate: true,
                        label: 'building',
                        filter: true,
                        placeholder: 'building',
                        required: true,
                        appendTo: 'body',
                        options: inject(SettingsService).getBuildingTypes()
                    }
                },
                {
                    key: 'floor',
                    type: 'input-number',
                    className: 'flex-1',
                    props: {
                        translate: true,
                        label: 'floor',
                        placeholder: 'floor',
                        required: true
                    }
                }
            ]
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
        },
        {
            key: 'showOnTimetable',
            type: 'checkbox',
            defaultValue: true,
            props: {
                translate: true,
                label: 'showOnTimetable',
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
    //                         roomTypeName: w.roomType?.name,
    //                         roomType: w.roomType?.id,
    //                         buildingName: w.building?.name,
    //                         building: w.building?.id
    //                     }))
    //                 }) as GridResponse
    //         )
    //     );
    // }
}
