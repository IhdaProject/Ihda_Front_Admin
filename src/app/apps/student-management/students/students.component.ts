import { GridResponse } from '@/apps/crud/types/base.model';
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    signal
} from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { StudentsService } from './service/students.service';
import { SkeletonModule } from 'primeng/skeleton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { Stage } from 'src/core/enums/stage.enum';

// TODO: MAKE BASE GRID COMPONENT IF REALYY NEEDED
@Component({
    selector: 'app-students',
    imports: [
        TableModule,
        ButtonModule,
        TranslocoModule,
        SkeletonModule,
        SelectButtonModule,
        FormsModule
    ],
    providers: [StudentsService],
    template: `
        <div class="card" #card>
            <p-table
                #dt
                [value]="data().content"
                [paginator]="true"
                [tableStyle]="{ 'min-width': '75rem' }"
                [rowHover]="true"
                dataKey="id"
                [currentPageReportTemplate]="
                    'currentPageReportTemplate' | transloco
                "
                [showCurrentPageReport]="true"
                [rowsPerPageOptions]="[10, 20, 30]"
                [scrollable]="true"
                [lazy]="true"
                [rows]="data().page.size"
                [totalRecords]="data().page.totalElements"
                (onLazyLoad)="loadData($event)"
            >
                <ng-template #caption>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <h3 class="m-0 font-semibold text-xl">
                                {{ 'students' | transloco }}
                            </h3>
                        </div>
                        <div>
                            <!-- RIGHT -->
                        </div>
                    </div>

                    <p-selectbutton
                        [options]="stateOptions"
                        [(ngModel)]="stage"
                        optionLabel="label"
                        optionValue="value"
                        aria-labelledby="basic"
                        class="mt-4"
                        (ngModelChange)="dt.filter($event, 'stage', 'contains')"
                    >
                        <ng-template #item let-item>
                            {{ item.label | transloco }}
                        </ng-template>
                    </p-selectbutton>
                </ng-template>

                <ng-template #header>
                    <tr>
                        <th [pSortableColumn]="'fullName'">
                            <span class="flex items-center gap-2"
                                >{{ 'fullName' | transloco }}
                                <p-sortIcon [field]="'fullName'" />
                            </span>
                        </th>
                        <th [pSortableColumn]="'email'">
                            <span class="flex items-center gap-2"
                                >{{ 'email' | transloco }}
                                <p-sortIcon [field]="'email'" />
                            </span>
                        </th>
                        <th [pSortableColumn]="'phone'">
                            <span class="flex items-center gap-2"
                                >{{ 'phone' | transloco }}
                                <p-sortIcon [field]="'phone'" />
                            </span>
                        </th>
                        <th>
                            {{ 'contract' | transloco }}
                        </th>
                        <th>
                            {{ 'birthDate' | transloco }}
                        </th>
                        <th>
                            {{ 'school' | transloco }}
                        </th>
                        <th>
                            {{ 'programme' | transloco }}
                        </th>
                        <th>
                            {{ 'studentNumber' | transloco }}
                        </th>
                        <th>
                            {{ 'status' | transloco }}
                        </th>
                    </tr>
                </ng-template>

                <ng-template #body let-rowData>
                    @if (!rowData.loading) {
                        <tr>
                            <td>{{ rowData.fullName }}</td>
                            <td>{{ rowData.email }}</td>
                            <td>{{ rowData.phone }}</td>
                            <td>{{ rowData.contract }}</td>
                            <td>{{ rowData.birthDate }}</td>
                            <td>{{ rowData.school }}</td>
                            <td>{{ rowData.programme }}</td>
                            <td>{{ rowData.studentNumber }}</td>
                            <td>{{ rowData.status }}</td>
                        </tr>
                    } @else {
                        <tr>
                            @for (col of [].constructor(5); track $index) {
                                <td>
                                    <p-skeleton height="20px" />
                                </td>
                            }
                            <td>
                                <p-skeleton height="20px" />
                            </td>
                        </tr>
                    }
                </ng-template>

                <ng-template #emptymessage>
                    <tr>
                        <td [attr.colspan]="5">
                            <div
                                class="text-center"
                                style="margin: 150px 0"
                                [style.width]="card.clientWidth - 40 + 'px'"
                            >
                                <i
                                    class="pi pi-inbox"
                                    style="font-size: 50px"
                                ></i>
                                <p>{{ 'no.data' | transloco }}</p>
                            </div>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    styleUrl: './students.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export default class StudentsComponent {
    private $data = inject(StudentsService);
    data = signal<GridResponse>({
        content: Array.from({ length: 10 }).map(
            (_, i) => ({ loading: true }) as any
        ),
        page: {
            number: 0,
            size: 10,
            totalElements: 10,
            totalPages: 1
        }
    });

    stateOptions: any[] = [
        { label: 'unassigned', value: Stage.UNASSIGNED },
        { label: 'assigned', value: Stage.ENROLLED }
    ];

    stage: Stage = Stage.UNASSIGNED;

    loadData(e: TableLazyLoadEvent) {
        this.$data.getAll(e, this.stage).subscribe((w) => {
            this.data.set(w);
        });
    }
}
