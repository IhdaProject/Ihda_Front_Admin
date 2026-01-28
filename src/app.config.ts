import {
    HTTP_INTERCEPTORS,
    provideHttpClient,
    withFetch,
    withInterceptors,
    withInterceptorsFromDi
} from '@angular/common/http';
import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
    provideRouter,
    withEnabledBlockingInitialNavigation,
    withInMemoryScrolling
} from '@angular/router';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco, TranslocoService } from '@jsverse/transloco';
import { DITokens } from './core/utils/di.tokens';
import { environment } from './environments/environment';
import { FORMLY_CONFIG, provideFormlyCore } from '@ngx-formly/core';
import { withFormlyPrimeNG } from '@ngx-formly/primeng';
import { TypeDatepicker } from './shared/components/ngx-formly/type-datepicker';
import { TypeTextArea } from './shared/components/ngx-formly/type-textarea';
import { TypeInputNumber } from './shared/components/ngx-formly/type-input-number';
import { registerTranslateExtension } from './shared/components/ngx-formly/translate.extension';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TypeAutocomplete } from './shared/components/ngx-formly/type-autocomplete';
import { TypeInputMask } from './shared/components/ngx-formly/type-input-mask';
import { MessageBetterService } from './shared/services/message-better.service';
import { DatePipe } from '@angular/common';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { TypeUpload } from './shared/components/ngx-formly/type-upload.component';
import { FormlyModalField } from './shared/components/ngx-formly/formly-modal-field.component';
import { RepeatFileTypeComponent } from './shared/components/ngx-formly/repeat-file.type';
import { TypeMap } from './shared/components/ngx-formly/type-map.component';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(
            appRoutes,
            withInMemoryScrolling({
                anchorScrolling: 'enabled',
                scrollPositionRestoration: 'enabled'
            }),
            withEnabledBlockingInitialNavigation()
        ),
        provideHttpClient(
            withFetch(),
            withInterceptorsFromDi(),
            withInterceptors([errorInterceptor])
        ),
        provideAnimationsAsync(),

        providePrimeNG({
            theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } }
        }),

        provideTransloco({
            config: {
                availableLangs: ['en', 'ru', 'uz'],
                defaultLang: 'en',
                // Remove this option if your application doesn't support changing language in runtime.
                reRenderOnLangChange: true,
                // warningni o'chirish
                missingHandler: { logMissingKey: false },
                prodMode: !isDevMode()
            },
            loader: TranslocoHttpLoader
        }),

        provideFormlyCore([
            ...withFormlyPrimeNG(),
            {
                types: [
                    {
                        name: 'textarea',
                        component: TypeTextArea,
                        wrappers: ['form-field']
                    },
                    {
                        name: 'input-number',
                        component: TypeInputNumber,
                        wrappers: ['form-field']
                    },
                    {
                        name: 'input-mask',
                        component: TypeInputMask,
                        wrappers: ['form-field']
                    },
                    {
                        name: 'datepicker',
                        component: TypeDatepicker,
                        wrappers: ['form-field']
                    },
                    {
                        name: 'autocomplete',
                        component: TypeAutocomplete,
                        wrappers: ['form-field']
                    },
                    {
                        name: 'upload',
                        component: TypeUpload,
                        wrappers: ['form-field']
                    },
                    {
                        name: 'formly-modal-field',
                        component: FormlyModalField,
                        wrappers: ['form-field']
                    },
                    {
                        name: 'repeat-file',
                        component: RepeatFileTypeComponent
                    },
                    {
                        name: 'map',
                        component: TypeMap
                    }
                ]
            }
        ]),
        {
            provide: FORMLY_CONFIG,
            multi: true,
            useFactory: registerTranslateExtension,
            deps: [TranslocoService]
        },

        {
            provide: HTTP_INTERCEPTORS,
            multi: true,
            useClass: AuthInterceptor
        },

        { provide: DITokens.API_BASE_URL, useValue: environment.API_BASE_URL },

        DatePipe,

        ConfirmationService,
        { provide: MessageService, useClass: MessageBetterService }
    ]
};
