import { Routes } from '@angular/router';
import { CrudService } from '../crud/services/crud.service';
import { TypesService } from '../crud/services/types.service';
import { StructuresService } from '../crud/services/structures.service';

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
