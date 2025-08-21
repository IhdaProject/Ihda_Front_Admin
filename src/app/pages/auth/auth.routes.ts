import { Routes } from '@angular/router';
import { AccessDenied } from './accessdenied';
import { Login } from './login';
import { Error } from './error';

export default [
    { path: 'access', component: AccessDenied },
    { path: 'error', component: Error },
    { path: 'login', component: Login , canMatch: []}
] as Routes;
