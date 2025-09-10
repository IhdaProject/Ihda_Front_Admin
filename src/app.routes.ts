import { Routes } from '@angular/router';
import { AppLayout } from '@/layout/components/app.layout';
import { authGuard } from './core/guards/auth.guard';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [authGuard],
        children: [
            {
                path: 'settings',
                loadChildren: () => import('@/apps/settings/settings.routes'),
                data: { breadcrumb: 'Settings' }
            },
            {
                path: 'academics',
                loadChildren: () => import('@/apps/academics/academics.routes'),
                data: { breadcrumb: 'Academics' }
            },
            {
                path: 'administration',
                loadChildren: () =>
                    import('@/apps/administration/administration.routes'),
                data: { breadcrumb: 'Administration' }
            },
            {
                path: 'informations',
                loadChildren: () =>
                    import(
                        '@/apps/information-management/information-management.routes'
                    ),
                data: { breadcrumb: 'informations' }
            }
        ]
    },
    {
        path: 'auth',
        loadChildren: () => import('@/pages/auth/auth.routes')
    },
    {
        path: 'notfound',
        loadComponent: () =>
            import('@/pages/notfound/notfound').then((c) => c.Notfound)
    },
    { path: '**', redirectTo: '/notfound' }
];
