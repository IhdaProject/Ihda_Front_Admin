import { inject, Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { TableColumn } from '../types/table';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class CourseApplicationsService extends CrudService {
    override urlCreate = 'api-qc/QuranCourse/CreateCourseForm';
    override urlUpdate = 'api-qc/QuranCourse/UpdateCourseForm';
    override urlDelete = 'api-qc/QuranCourse/DeleteCourseForm'; // to‘g‘ri DELETE endpoint bo‘lsa shuni yozish kerak
    override urlGetAll = 'api-qc/QuranCourse/GetAllPetitions';

    private route = inject(ActivatedRoute);

    override title: string = 'course-forms';

    override columns: TableColumn[] = [
        { field: 'id', header: 'ID' },
        { field: 'fullName', header: 'Full Name' },
        { field: 'phoneNumber', header: 'Phone Number' },
        { field: 'status', header: 'Status' },
        { field: 'birthDay', header: 'Birth Day' },
        { field: 'gender', header: 'Gender' }
    ];

    override fields: FormlyFieldConfig[] = [];
}
