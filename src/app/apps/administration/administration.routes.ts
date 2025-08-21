import { Routes } from '@angular/router';
import { CrudService } from '../crud/services/crud.service';
import { UserService } from '../crud/services/user.service';

export default [
    {
        path: 'user',
        loadComponent: () => import('../crud/crud'),
        data: { breadcrumb: 'users' },
        providers: [
            {
                provide: CrudService,
                useClass: UserService
            }
        ]
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
