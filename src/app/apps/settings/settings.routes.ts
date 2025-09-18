import { Routes } from '@angular/router';
import { CrudService } from '../crud/services/crud.service';
import { PermissionsService } from '../crud/services/permissions.service';
import { StructuresService } from '../crud/services/structures.service';

export default [
    {
        path: 'permissions',
        loadComponent: () => import('./permissions/permissions.component'),
        data: { breadcrumb: 'types' },
        canMatch: [],
        providers: [
            {
                provide: CrudService,
                useClass: PermissionsService
            }
        ]
    },
    {
        path: 'structures',
        loadComponent: () => import('./structures/structures.component'),
        data: { breadcrumb: 'structures' },
        canMatch: [],
        providers: [
            {
                provide: CrudService,
                useClass: StructuresService
            }
        ]
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
