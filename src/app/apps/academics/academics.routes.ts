import { Routes } from '@angular/router';
import { CrudService } from '../crud/services/crud.service';
import { TeacherService } from '../crud/services/teacher.service';
import { SchoolService } from '../crud/services/school.service';
import { SubjectService } from '../crud/services/subject.service';
import { RoomService } from '../crud/services/room.service';

export default [
    {
        path: 'room',
        loadComponent: () => import('../crud/crud'),
        // TODO: RESOLVER WORKS AFTER PROVIDERS. WHY!!!
        // resolve: { roomTypes: roomTypesResolver },
        data: { breadcrumb: 'rooms' },
        providers: [
            {
                provide: CrudService,
                useClass: RoomService
            }
        ]
    },
    {
        path: 'subject',
        loadComponent: () => import('../crud/crud'),
        data: { breadcrumb: 'subjects' },
        providers: [
            {
                provide: CrudService,
                useClass: SubjectService
            }
        ]
    },
    {
        path: 'school',
        loadComponent: () => import('../crud/crud'),
        data: { breadcrumb: 'schools' },
        providers: [
            {
                provide: CrudService,
                useClass: SchoolService
            }
        ]
    },
    {
        path: 'teacher',
        loadComponent: () => import('./teachers/teachers.component'),
        data: { breadcrumb: 'teachers' },
        providers: [
            TeacherService,
            {
                provide: CrudService,
                useExisting: TeacherService
            }
        ]
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
