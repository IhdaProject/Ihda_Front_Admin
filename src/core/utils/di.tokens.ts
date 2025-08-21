import { InjectionToken } from '@angular/core';

export class DITokens {
    public static API_BASE_URL = new InjectionToken<string>('API_BASE_URL');
}
