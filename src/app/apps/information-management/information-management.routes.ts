import { Routes } from '@angular/router';
import { CountriesService } from '../crud/services/countries.service';
import { CrudService } from '../crud/services/crud.service';

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
        loadComponent: () => import('./information-region/region.component'),
        data: { breadcrumb: 'region' }
    },
    {
        path: 'district',
        loadComponent: () => import('./information-district/district.component'),
        data: { breadcrumb: 'district' }
    }
] as Routes;
