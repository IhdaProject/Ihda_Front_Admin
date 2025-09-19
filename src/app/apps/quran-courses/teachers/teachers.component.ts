import {
    ChangeDetectionStrategy,
    Component,
    inject,
    signal
} from '@angular/core';
import { Button } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { TeacherDetailsComponent } from './teacher-details/teacher-details.component';
import { catchError, of } from 'rxjs';
import { FullNamePipe } from 'src/shared/pipes/full-name.pipe';
import { TranslocoModule } from '@jsverse/transloco';
import { TeacherSetings } from './common/settings.model';
import { MessageService } from 'primeng/api';
import Crud from '@/apps/crud/crud';
import { TeacherService } from '@/apps/crud/services/teacher.service';

@Component({
    selector: 'app-teachers',
    imports: [
        Crud,
        Button,
        DrawerModule,
        TeacherDetailsComponent,
        FullNamePipe,
        TranslocoModule
    ],
    template: `
        <app-crud [extraBtnsTemplate]="extraBtns" [widthActions]="'150px'">
        </app-crud>

        <ng-template #extraBtns let-data>
            <p-button
                icon="pi pi-eye"
                class="mr-2"
                [rounded]="true"
                [outlined]="true"
                [loading]="data.btnLoading"
                (click)="showDetails(data)"
            />
        </ng-template>

        @if (settings(); as settingsData) {
            <p-drawer
                [header]="selectedTeacher.user | appFullName"
                [(visible)]="visibleDetails"
                position="right"
                styleClass="!w-full md:!w-1/2 lg:!w-2/5"
            >
                <app-teacher-details
                    #teacherDetails
                    [personalInfoModel]="selectedTeacher"
                    [settings]="settingsData"
                />

                <ng-template #footer>
                    <div class="flex justify-end">
                        <p-button
                            icon="pi pi-times"
                            class="mr-2"
                            severity="secondary"
                            [label]="'close' | transloco"
                            (click)="visibleDetails.set(false)"
                        />
                        <p-button
                            icon="pi pi-save"
                            class="mr-2"
                            [label]="'save' | transloco"
                            (click)="save(teacherDetails)"
                        />
                    </div>
                </ng-template>
            </p-drawer>
        }
    `,
    styleUrl: './teachers.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export default class TeachersComponent {
    visibleDetails = signal<boolean>(false);
    selectedTeacher: any = {};
    settings = signal<TeacherSetings | undefined>(undefined);

    private $data = inject(TeacherService);
    private $message = inject(MessageService);

    showDetails(data: any) {
        this.settings.set(undefined);
        this.selectedTeacher = data;

        data.btnLoading = true;
        this.$data
            .settingsById(data.id)
            .pipe(
                catchError((w) => {
                    return of(null);
                })
            )
            .subscribe((w) => {
                this.settings.set(w || ({} as TeacherSetings));
                data.btnLoading = false;
                this.visibleDetails.set(true);
            });
    }

    save(teacherDetails: TeacherDetailsComponent) {
        this.updateAvailabilityAndWorkingSlots(teacherDetails);
        this.updateTeacher();
    }

    private updateAvailabilityAndWorkingSlots(
        teacherDetails: TeacherDetailsComponent
    ) {
        const model = {
            workingSlots: teacherDetails.weekDayTypes
                .filter((w) => w.slots.length > 0)
                .map((w) => ({
                    dayOfWeek: {
                        ...w
                    },
                    slots: w.slots
                })),
            lessonTypes: teacherDetails.lessonTypesSelected.map((w) => ({
                ...w
            }))
        };
        this.$data
            .settingUpdate(this.selectedTeacher.id, model)
            .subscribe((w) => {
                this.$message.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Updated'
                });
            });
    }

    private updateTeacher() {
        this.$data
            .update(this.selectedTeacher.id, this.selectedTeacher)
            .subscribe();
    }
}
