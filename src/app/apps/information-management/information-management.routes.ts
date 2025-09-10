import { Routes } from '@angular/router';

export default [
    { path: '', pathMatch: 'full', redirectTo: 'informations/country' },
    {
        path: 'country',
        loadComponent: () => import('./information-country/country.component'),
        data: { breadcrumb: 'country' }
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
