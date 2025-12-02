import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, ToastModule, ConfirmDialogModule],
    // providers: [MessageService, ConfirmationService],
    template: `<router-outlet></router-outlet>
        <p-toast />
        <p-confirmDialog [style]="{ width: '450px' }" />`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {}
