import { inject, Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { TableColumn } from '../types/table';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class CourseFormsService extends CrudService {
    override urlCreate = 'api-qc/TrainingCenter/CreateCourseForm';
    override urlUpdate = 'api-qc/TrainingCenter/UpdateCourseForm';
    override urlDelete = 'api-qc/TrainingCenter/DeleteCourseForm'; // to‘g‘ri DELETE endpoint bo‘lsa shuni yozish kerak
    override urlGetAll = 'api-qc/TrainingCenter/GetCourseForm';

    private route = inject(ActivatedRoute);

    override title: string = 'course-forms';

    override columns: TableColumn[] = [
        { field: 'id', header: 'ID' },
        { field: 'name', header: 'Name' },
        { field: 'description', header: 'Description' },
        { field: 'admissionQuota', header: 'Admission Quota' },
        { field: 'duration', header: 'Duration' },
        { field: 'forGender', header: 'Gender' },
        { field: 'transitionTime', header: 'Transition Time' },
        { field: 'trainingCenterId', header: 'Training Center' }
    ];

    override fields: FormlyFieldConfig[] = [
        {
            key: 'name',
            type: 'input',
            props: {
                translate: true,
                label: 'Name',
                placeholder: 'Enter course name',
                required: true
            }
        },
        {
            key: 'description',
            type: 'textarea',
            props: {
                label: 'Description',
                placeholder: 'Enter description'
            }
        },
        {
            key: 'admissionQuota',
            type: 'input',
            props: {
                type: 'number',
                label: 'Admission Quota',
                placeholder: 'Enter admission quota',
                required: true
            }
        },
        {
            key: 'duration',
            type: 'input',
            props: {
                type: 'number',
                label: 'Duration',
                placeholder: 'Enter duration (e.g. in hours or days)',
                required: true
            }
        },
        {
            key: 'forGender',
            type: 'select',
            props: {
                label: 'Gender',
                options: [
                    { value: 1, label: 'Male' },
                    { value: 2, label: 'Female' }
                ]
            }
        },
        {
            key: 'transitionTime',
            fieldGroupClassName: 'grid grid-cols-2 gap-4',
            templateOptions: { label: 'Ish vaqtlari' },
            fieldGroup: [
                {
                    key: 'monday',
                    type: 'input',
                    templateOptions: { label: 'Dushanba' }
                },
                {
                    key: 'tuesday',
                    type: 'input',
                    templateOptions: { label: 'Seshanba' }
                },
                {
                    key: 'wednesday',
                    type: 'input',
                    templateOptions: { label: 'Chorshanba' }
                },
                {
                    key: 'thursday',
                    type: 'input',
                    templateOptions: { label: 'Payshanba' }
                },
                {
                    key: 'friday',
                    type: 'input',
                    templateOptions: { label: 'Juma' }
                },
                {
                    key: 'saturday',
                    type: 'input',
                    templateOptions: { label: 'Shanba' }
                },
                {
                    key: 'sunday',
                    type: 'input',
                    templateOptions: { label: 'Yakshanba' }
                }
            ]
        },
        {
            key: 'trainingCenterId',
            type: 'input', // keyinchalik dropdown qilib, TrainingCenter ro‘yxatidan olish mumkin
            props: {
                type: 'number',
                label: 'Training Center',
                placeholder: 'Enter Training Center ID',
                required: true
            }
        }
    ];
}
