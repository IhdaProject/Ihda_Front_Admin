import { Routes } from '@angular/router';
import { CountriesService } from '../crud/services/countries.service';
import { CrudService } from '../crud/services/crud.service';
import { RegionsService } from '../crud/services/regions.service';
import { DistrictsService } from '../crud/services/districts.service';

export default [
    { path: '', pathMatch: 'full', redirectTo: 'informations/countries' },
    {
        path: 'countries',
        loadComponent: () => import('./information-countries/countries.component'),
        data: { breadcrumb: 'countries' },
        providers: [
            {
                provide: CrudService,
                useClass: CountriesService
            }
        ]
    },
    {
        path: 'region',
        loadComponent: () => import('./information-regions/regions.component'),
        data: { breadcrumb: 'region' },
        providers: [
            {
                provide: CrudService,
                useClass: RegionsService
            }
        ]
    },
    {
        path: 'district',
        loadComponent: () => import('./information-districts/districts.component'),
        data: { breadcrumb: 'district' },
        providers: [
            {
                provide: CrudService,
                useClass: DistrictsService
            }
        ]
    }
] as Routes;
