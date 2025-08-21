import { Routes } from '@angular/router';

export default [
    { path: '', pathMatch: 'full', redirectTo: 'students' },
    {
        path: 'students',
        loadComponent: () => import('./students/students.component'),
        data: { breadcrumb: 'students' }
    }
] as Routes;
