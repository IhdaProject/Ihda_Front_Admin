import { Routes } from '@angular/router';
import { CrudService } from '../crud/services/crud.service';
import { TypesService } from '../crud/services/types.service';

export default [
    {
        path: 'types',
        loadComponent: () => import('./types/types.component'),
        data: { breadcrumb: 'types' },
        canMatch: [],
        providers: [
            {
                provide: CrudService,
                useClass: TypesService
            }
        ]
    },
    {
        path: 'group-settings',
        loadComponent: () => import('./group-settings/group-settings.component')
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
