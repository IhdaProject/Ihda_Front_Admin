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
import { BaseService } from 'src/core/services/base.service';
import { HttpParams } from '@angular/common/http';
import { map, tap, switchMap, of } from 'rxjs';

@Component({
    selector: 'app-structures',
    imports: [Crud, Button, RouterLink],
    template: `
        <app-crud
            [extraBtnsTemplate]="extraBtns"
            [widthActions]="'150px'"
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
    protected $base = inject(BaseService);

    parentTypeName = signal<string | undefined>(undefined);
    crud = viewChild<Crud<any>>('crud');

    back() {
        this.location.back();
    }

    getUserById = (modal: any) => {
        const params = new HttpParams()
            .append(
                'FilteringExpressionsJson',
                JSON.stringify([
                    {
                        PropertyName: 'structureid',
                        Value: `${modal.id}`,
                        Type: '=='
                    }
                ])
            )
            .append('skip', '0')
            .append('take', '1000');
        return of(null).pipe(
            switchMap((res) =>
                this.$base
                    .get<any>('api-auth/Role/GetStructureById', {
                        params
                    })
                    .pipe(
                        map((res) => {
                            return {
                                ...modal,
                                permissionIds: (res.content as any[]).map(
                                    (l) => {
                                        return l.id as number;
                                    }
                                )
                            };
                        })
                    )
            )
        );
    };
}
