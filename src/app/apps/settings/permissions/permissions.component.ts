import {
    ChangeDetectionStrategy,
    Component,
    inject,
    signal,
    viewChild
} from '@angular/core';
import { Button } from 'primeng/button';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import Crud from '@/apps/crud/crud';

@Component({
    selector: 'app-permissions',
    imports: [Crud, Button, RouterLink],
    template: `
        <app-crud
            [extraBtnsTemplate]="extraBtns"
            [widthActions]="'150px'"
            [editPermission]="[10110002]"
            #crud
        >
            @if (parentTypeName(); as parentTypeName) {
                <ng-container titleLeft>
                    <i class="pi  pi-angle-right"></i>
                    <a
                        (click)="back()"
                        class="cursor-pointer hover:text-primary"
                        >...</a
                    >

                    <i class="pi pi-angle-right"></i>

                    {{ parentTypeName }}
                </ng-container>
            }
        </app-crud>

        <ng-template #extraBtns let-data>
            <p-button
                icon="pi pi-eye"
                class="mr-2"
                [rounded]="true"
                [outlined]="true"
                [routerLink]="[]"
                queryParamsHandling="merge"
                [queryParams]="{
                    typeCode: data['value'],
                    parentTypeName: data['name']
                }"
            />
        </ng-template>
    `,
    styleUrl: './permissions.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export default class PermissionsComponent {
    private route = inject(ActivatedRoute);
    private location = inject(Location);

    parentTypeName = signal<string | undefined>(undefined);
    crud = viewChild<Crud<any>>('crud');

    back() {
        this.location.back();
    }
}
