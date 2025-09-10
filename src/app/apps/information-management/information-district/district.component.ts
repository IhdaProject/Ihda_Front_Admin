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
import { SkeletonModule } from 'primeng/skeleton';
import { FormsModule } from '@angular/forms';
import { DistrictService } from './service/district.service';

// TODO: MAKE BASE GRID COMPONENT IF REALYY NEEDED
@Component({
    selector: 'app-district',
    imports: [
        TableModule,
        ButtonModule,
        TranslocoModule,
        SkeletonModule,
        FormsModule
    ],
    providers: [DistrictService],
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
                                {{ 'district' | transloco }}
                            </h3>
                        </div>
                        <div>
                            <!-- RIGHT -->
                        </div>
                    </div>
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
    styleUrl: './district.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export default class DistrictComponent {
    private $data = inject(DistrictService);
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

    loadData(e: TableLazyLoadEvent) {
        this.$data.getAll(e).subscribe((w) => {
            this.data.set(w);
        });
    }
}
