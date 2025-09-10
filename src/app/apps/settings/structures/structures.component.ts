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
    selector: 'app-structures',
    imports: [Crud, Button, RouterLink],
    template: `
        <app-crud
            [extraBtnsTemplate]="extraBtns"
            [widthActions]="'150px'"
            [filters]="typeCode()"
            [editPermission]="[10110006]"
            [addPermission]="[10110005]"
            [deletePermission]="[10110009]"
            [viewPermission]="[10110004]"
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
    styleUrl: './structures.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export default class StructuresComponent {
    private route = inject(ActivatedRoute);
    private location = inject(Location);

    typeCode = signal<any>({
        typeCode: { value: this.route.snapshot.queryParams['typeCode'] }
    });
    parentTypeName = signal<string | undefined>(undefined);
    crud = viewChild<Crud<any>>('crud');

    constructor() {
        this.route.queryParams.subscribe((params) => {
            this.parentTypeName.set(params['parentTypeName']);
            const crud = this.crud();
            if (crud) {
                crud.dt().filter(params['typeCode'], 'typeCode', '');
            }
        });
    }

    back() {
        this.location.back();
    }
}
