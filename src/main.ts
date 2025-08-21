import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app.config';
import { AppComponent } from './app.component';
import { InjectorHelper } from './core/utils/injector.helper';

bootstrapApplication(AppComponent, appConfig)
    .then((appRef) => {
        InjectorHelper.injector = appRef.injector;
    })
    .catch((err) => console.error(err));
