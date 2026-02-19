import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AppConfigurator } from '@/layout/components/app.configurator';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, ToastModule, ConfirmDialogModule, AppConfigurator],
    // providers: [MessageService, ConfirmationService],
    template: `<router-outlet></router-outlet>
        <p-toast />
        <p-confirmDialog [style]="{ width: '450px' }" />
        <app-configurator simple />`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {}
