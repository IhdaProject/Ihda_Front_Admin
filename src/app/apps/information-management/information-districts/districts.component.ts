import { GridResponse } from '@/apps/crud/types/base.model';
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    signal,
    viewChild
} from '@angular/core';
import { Button } from 'primeng/button';
import { Location } from '@angular/common';
import Crud from '@/apps/crud/crud';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DistrictsService } from '@/apps/crud/services/districts.service';

// TODO: MAKE BASE GRID COMPONENT IF REALYY NEEDED
@Component({
    selector: 'app-districts',
    imports: [
        RouterLink,
        Crud,
        Button
    ],
    providers: [DistrictsService],
    template: `
        <app-crud
            [extraBtnsTemplate]="extraBtns"
            [widthActions]="'150px'"
            [editPermission]="[30100005]"
            [addPermission]="[30100003]"
            [deletePermission]="[30100004]"
            [viewPermission]="[30100002]"
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
    styleUrl: './districts.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export default class DistrictsComponent {
    private route = inject(ActivatedRoute);
    private location = inject(Location);

    parentTypeName = signal<string | undefined>(undefined);
    crud = viewChild<Crud<any>>('crud');

    constructor() {
    }

    back() {
        this.location.back();
    }
}
