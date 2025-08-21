import { Routes } from '@angular/router';
import { CrudService } from '../crud/services/crud.service';
import { CourseService } from '../crud/services/course.service';
import { CurriculumsService } from '../crud/services/curriculums.service';
import { TeacherService } from '../crud/services/teacher.service';
import { SchoolService } from '../crud/services/school.service';
import { TimeSlotService } from '../crud/services/time-slot.service';
import { YearService } from '../crud/services/year.service';
import { ProgrammeService } from '../crud/services/programme.service';
import { SubjectService } from '../crud/services/subject.service';
import { RoomService } from '../crud/services/room.service';
import { TermService } from '../crud/services/term.service';

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
        path: 'programme',
        loadComponent: () => import('../crud/crud'),
        data: { breadcrumb: 'programmes' },
        providers: [
            {
                provide: CrudService,
                useClass: ProgrammeService
            }
        ]
    },
    {
        path: 'year',
        loadComponent: () => import('../crud/crud'),
        data: { breadcrumb: 'years' },
        providers: [
            {
                provide: CrudService,
                useClass: YearService
            }
        ]
    },
    {
        path: 'time-slot',
        loadComponent: () => import('../crud/crud'),
        data: { breadcrumb: 'timeSlots' },
        providers: [
            {
                provide: CrudService,
                useClass: TimeSlotService
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
    {
        path: 'curriculum',
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('./curriculum/curriculum.component'),
                data: { breadcrumb: 'curriculums' },
                providers: [
                    {
                        provide: CrudService,
                        useClass: CurriculumsService
                    }
                ]
            },
            {
                path: ':curriculum',
                loadComponent: () => import('../crud/crud'),
                data: { breadcrumb: 'courses', enableBack: true },
                providers: [
                    {
                        provide: CrudService,
                        useClass: CourseService
                    }
                ]
            }
        ]
    },
    {
        path: 'term',
        loadComponent: () => import('../crud/crud'),
        data: { breadcrumb: 'terms' },
        providers: [
            {
                provide: CrudService,
                useClass: TermService
            }
        ]
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
