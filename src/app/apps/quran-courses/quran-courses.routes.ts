import { Routes } from '@angular/router';
import { CrudService } from '../crud/services/crud.service';
import { TrainingCentersService } from '../crud/services/training-centers.service';
import { CourseFormsService } from '../crud/services/course-forms.service';

export default [
    {
        path: 'training-centers',
        loadComponent: () => import('./training-centers/training-centers.component'),
        data: { breadcrumb: 'training-centers' },
        providers: [
            {
                provide: CrudService,
                useClass: TrainingCentersService
            }
        ]
    },
    {
        path: 'course-forms',
        loadComponent: () => import('./course-forms/course-forms.component'),
        data: { breadcrumb: 'course-forms' },
        providers: [
            {
                provide: CrudService,
                useClass: CourseFormsService
            }
        ]
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
