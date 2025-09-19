import { AsyncPipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    Input,
    input,
    OnInit
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { TabsModule } from 'primeng/tabs';
import { Types } from 'src/core/enums/types.enum';
import { SettingsService } from 'src/shared/services/settings.service';
import { TeacherSetings } from '../common/settings.model';
import { TypesResponse } from '@/apps/crud/types/types';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
    selector: 'app-teacher-details',
    imports: [
        ReactiveFormsModule,
        FormlyForm,
        TabsModule,
        CheckboxModule,
        DatePickerModule,
        FormsModule,
        TranslocoModule
    ],
    template: `
        <p-tabs value="0">
            <p-tablist>
                <p-tab value="0">{{ 'personalInfo' | transloco }}</p-tab>
                <p-tab value="1">{{ 'lessonTypes' | transloco }}</p-tab>
                <p-tab value="2">{{ 'availability' | transloco }}</p-tab>
            </p-tablist>
            <p-tabpanels>
                <p-tabpanel value="0">
                    <form [formGroup]="personalInfoForm">
                        <formly-form
                            [form]="personalInfoForm"
                            [fields]="personalInfoFields"
                            [model]="personalInfoModel"
                        ></formly-form>
                    </form>
                </p-tabpanel>
                <p-tabpanel value="1">
                    <p class="text-gray-500 mb-4">
                        {{ 'selectTypesLessons' | transloco }}
                    </p>
                    @for (lessonType of lessonTypes; track $index) {
                        <div class="flex items-center mb-4">
                            <p-checkbox
                                [inputId]="lessonType.id"
                                name="lessonTypes"
                                [value]="lessonType"
                                [(ngModel)]="lessonTypesSelected"
                            />
                            <label [for]="lessonType.id" class="ml-2">
                                {{ lessonType.name }}
                            </label>
                        </div>
                    }
                </p-tabpanel>
                <p-tabpanel value="2">
                    @for (day of weekDayTypes; track day) {
                        <div class="border rounded-lg p-4 gap-4 mb-4">
                            <div class="flex items-center mb-4 border-b pb-4">
                                <p-checkbox
                                    [inputId]="day.name"
                                    [name]="day.name"
                                    [binary]="true"
                                    [(ngModel)]="day.checkedAll"
                                    (ngModelChange)="handleCheckedAll(day)"
                                />
                                <label [for]="day.name" class="ml-2">
                                    {{ day.name }}
                                </label>
                            </div>
                            <div class="grid grid-cols-2 gap-2">
                                @for (slot of timeSlots; track $index) {
                                    <div class="flex items-center">
                                        <p-checkbox
                                            inputId="{{ day.id }}_{{ slot.id }}"
                                            name="{{ day.id }}"
                                            [value]="slot"
                                            [(ngModel)]="day.slots"
                                        />
                                        <label
                                            for="{{ day.id }}_{{ slot.id }}"
                                            class="ml-2"
                                        >
                                            {{ slot.label }}
                                        </label>
                                    </div>
                                }
                            </div>
                        </div>
                    }
                </p-tabpanel>
            </p-tabpanels>
        </p-tabs>
    `,
    styleUrl: './teacher-details.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeacherDetailsComponent implements OnInit {
    @Input({ required: true })
    personalInfoModel: any;

    settings = input<TeacherSetings>();

    personalInfoForm = new FormGroup({});

    readonly personalInfoFields: FormlyFieldConfig[] = [
        {
            key: 'userCrudDto',
            fieldGroup: [
                {
                    key: 'firstName',
                    type: 'input',
                    props: {
                        translate: true,
                        label: 'firstName',
                        placeholder: 'firstName',
                        required: true
                    }
                },
                {
                    key: 'lastName',
                    type: 'input',
                    props: {
                        translate: true,
                        label: 'lastName',
                        placeholder: 'lastName',
                        required: true
                    }
                },
                {
                    key: 'middleName',
                    type: 'input',
                    props: {
                        translate: true,
                        label: 'middleName',
                        placeholder: 'middleName',
                        required: true
                    }
                },
                {
                    key: 'phone',
                    type: 'input-mask',
                    props: {
                        translate: true,
                        label: 'phone',
                        placeholder: '998(99) 99-99-99',
                        mask: '999(99) 999-99-99',
                        unmask: true,
                        required: true
                    }
                },
                {
                    key: 'email',
                    type: 'input',
                    props: {
                        translate: true,
                        label: 'email',
                        placeholder: 'email',
                        required: true
                    }
                }
            ]
        },
        {
            key: 'academicTitle',
            type: 'select',
            className: 'flex-1',
            props: {
                translate: true,
                label: 'academicTitle',
                filter: true,
                placeholder: 'academicTitle',
                required: true,
                options: inject(SettingsService).types(Types.AcademicTitleTypes)
            }
        }
    ];

    lessonTypesSelected: any[] = [];

    lessonTypes: TypesResponse[] = [];
    weekDayTypes: any[] = [];
    timeSlots: any[] = [];
    private $cdr = inject(ChangeDetectorRef);
    private $settings = inject(SettingsService);

    ngOnInit(): void {
        this.getLessonTypes();
        this.getTimeSlotsAndWeekDays();
    }

    private getTimeSlotsAndWeekDays() {
        this.$settings.timeSlots(true).subscribe((w) => {
            this.timeSlots = w;

            this.$settings.typesFull(Types.WeekDayTypes).subscribe((w) => {
                this.weekDayTypes = w.map((weekDay) => {
                    const slots =
                        this.settings()?.workingSlots?.find(
                            (ws) => ws.dayOfWeek.id === weekDay.id
                        )?.slots || [];
                    const filteredSlots = this.timeSlots.filter((ts) =>
                        slots.find((s) => s.id == ts.id)
                    );

                    return {
                        ...weekDay,
                        slots: filteredSlots,
                        checkedAll:
                            filteredSlots.length === this.timeSlots.length
                    };
                });
                this.$cdr.markForCheck;
            });
        });
    }

    private getLessonTypes() {
        this.$settings.typesFull(Types.LessonTypes).subscribe((w) => {
            this.lessonTypes = w;
            this.lessonTypesSelected = this.lessonTypes.filter((lt) =>
                this.settings()?.lessonTypes?.find(
                    (lessonType) => lessonType.id === lt.id
                )
            );
            this.$cdr.markForCheck;
        });
    }

    handleCheckedAll(day: any) {
        day.slots = [];
        if (day.checkedAll) {
            this.timeSlots.forEach((slot) => {
                day.slots.push(slot);
            });
        }
    }
}
