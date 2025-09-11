import { inject, Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { TableColumn } from '../types/table';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { userTypes } from 'src/core/enums/user-types.enum';
import { genders } from 'src/core/enums/gender.enum';
import { languages } from 'src/core/enums/language.enum';
import { SettingsService } from 'src/shared/services/settings.service';
import { Types } from 'src/core/enums/types.enum';
import { TableLazyLoadEvent } from 'primeng/table';
import { map, Observable } from 'rxjs';
import { GridResponse } from '../types/base.model';
import { TeacherSetings } from '@/apps/academics/teachers/common/settings.model';
import { StorageCategory } from 'src/core/services/file-storage.service';

@Injectable()
export class TeacherService extends CrudService {
    override urlCreate = 'academic/curriculums/courses';
    override urlUpdate = 'academic/curriculums/courses';
    override urlDelete = 'academic/curriculums/courses';
    override urlGetAll = 'academic/teachers';
    override title: string = 'teachers';
    override columns: TableColumn[] = [
        {
            field: 'userCrudDto.avatar',
            type: 'image'
        },
        {
            field: 'userCrudDto.firstName',
            header: 'firstName',
            sortable: true,
            primary: true
        },
        {
            field: 'userCrudDto.lastName',
            header: 'lastName',
            sortable: true,
            primary: true
        },
        {
            field: 'userCrudDto.middleName',
            header: 'middleName',
            primary: true
        },
        {
            field: 'userCrudDto.userType',
            header: 'userType',
            type: 'translate'
        },
        {
            field: 'userCrudDto.email',
            header: 'email'
        },
        {
            field: 'userCrudDto.phone',
            header: 'phone'
        },
        {
            field: 'userCrudDto.gender',
            header: 'gender',
            type: 'translate'
        },
        {
            field: 'userCrudDto.language',
            header: 'language',
            type: 'translate'
        },
        {
            field: 'academicTitleName',
            header: 'academicTitle'
        },
        {
            field: 'schoolName',
            header: 'school'
        },
        {
            field: 'active',
            type: 'switcher',
            sortable: true
        }
    ];

    override fields: FormlyFieldConfig[] = [
        {
            key: 'userCrudDto',
            fieldGroup: [
                {
                    key: 'firstName',
                    type: 'input',
                    props: {
                        translate: true,
                        label: 'firstName',
                        placeholder: 'firstName',
                        required: true
                    }
                },
                {
                    key: 'lastName',
                    type: 'input',
                    props: {
                        translate: true,
                        label: 'lastName',
                        placeholder: 'lastName',
                        required: true
                    }
                },
                {
                    key: 'middleName',
                    type: 'input',
                    props: {
                        translate: true,
                        label: 'middleName',
                        placeholder: 'middleName',
                        required: true
                    }
                },
                {
                    key: 'avatar',
                    type: 'upload',
                    props: {
                        translate: true,
                        label: 'avatar',
                        placeholder: 'avatar',
                        category: StorageCategory.PROFILE_PICTURE,
                        required: true
                    }
                },
                {
                    fieldGroupClassName: 'flex gap-4',
                    fieldGroup: [
                        {
                            key: 'gender',
                            type: 'select',
                            className: 'flex-1',
                            props: {
                                translate: true,
                                translateSelectOptions: true,
                                label: 'gender',
                                placeholder: 'gender',
                                required: true,
                                appendTo: 'body',
                                options: genders()
                            }
                        },
                        {
                            key: 'userType',
                            type: 'select',
                            className: 'flex-1',
                            props: {
                                translate: true,
                                translateSelectOptions: true,
                                label: 'userType',
                                placeholder: 'userType',
                                required: true,
                                appendTo: 'body',
                                options: userTypes()
                            }
                        }
                    ]
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
                    key: 'language',
                    type: 'select',
                    className: 'flex-1',
                    props: {
                        translate: true,
                        translateSelectOptions: true,
                        label: 'language',
                        placeholder: 'language',
                        required: true,
                        appendTo: 'body',
                        options: languages()
                    }
                },
                {
                    key: 'enabled',
                    type: 'checkbox',
                    defaultValue: true,
                    props: {
                        translate: true,
                        label: 'enabled',
                        required: true
                    }
                }
            ]
        },
        {
            key: 'school',
            type: 'select',
            className: 'flex-1',
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
            key: 'academicTitle',
            type: 'select',
            className: 'flex-1',
            props: {
                translate: true,
                label: 'academicTitle',
                filter: true,
                placeholder: 'academicTitle',
                required: true,
                options: inject(SettingsService).types(Types.AcademicTitleTypes)
            }
        },
        {
            key: 'employeeNumber',
            type: 'input',
            props: {
                translate: true,
                label: 'employeeNumber',
                placeholder: 'employeeNumber',
                required: true
            }
        },
        {
            fieldGroupClassName: 'flex gap-4',
            fieldGroup: [
                {
                    key: 'hiredDate',
                    type: 'datepicker',
                    className: 'w-full',
                    props: {
                        translate: true,
                        label: 'hiredDate',
                        placeholder: 'hiredDate',
                        required: true,
                        appendTo: 'body'
                    }
                },
                {
                    key: 'birthDate',
                    type: 'datepicker',
                    className: 'w-full',
                    props: {
                        translate: true,
                        label: 'birthDate',
                        placeholder: 'birthDate',
                        required: true,
                        appendTo: 'body'
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
    //                         userCrudDto: w.user,
    //                         academicTitleName: w.academicTitle?.name,
    //                         academicTitle: w.academicTitle?.id,
    //                         schoolName: w.school?.name,
    //                         school: w.school?.id,
    //                         hiredDate: new Date(w.hiredDate),
    //                         birthDate: new Date(w.birthDate)
    //                     }))
    //                 }) as GridResponse
    //         )
    //     );
    // }

    settingsById(id: number) {
        return this.$base.get<TeacherSetings>(
            `academic/teachers/${id}/settings`
        );
    }

    settingUpdate(id: number, model: any) {
        return this.$base.put(
            `academic/teachers/${id}/settings`,
            undefined,
            model
        );
    }
}
