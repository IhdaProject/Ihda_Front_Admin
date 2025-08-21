import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    OnInit
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';
import {
    defaultGroupAssignmentLogics,
    GroupSettingRequest,
    GroupSettingResponse
} from './common/group-settings.model';
import { ButtonModule } from 'primeng/button';
import { TranslocoModule } from '@jsverse/transloco';
import { GroupSettingsService } from './common/group-settings.service';

@Component({
    selector: 'app-group-settings',
    imports: [FormlyForm, ReactiveFormsModule, ButtonModule, TranslocoModule],
    template: `
        <div class="card max-w-[600px]">
            <h1
                class="block text-surface-900 dark:text-surface-0 font-bold text-xl mb-6"
            >
                {{ 'group.settings' | transloco }}
            </h1>
            <form [formGroup]="form">
                <formly-form
                    [form]="form"
                    [fields]="fields"
                    [model]="model"
                ></formly-form>

                <p-button
                    [label]="'save' | transloco"
                    icon="pi pi-check"
                    (click)="submit()"
                    [loading]="form.disabled"
                    [disabled]="form.disabled"
                />
            </form>
        </div>
    `,
    styleUrl: './group-settings.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export default class GroupSettingsComponent implements OnInit {
    fields: FormlyFieldConfig[] = [
        {
            key: 'defaultGroupSize',
            type: 'input-number',
            props: {
                translate: true,
                label: 'defaultGroupSize',
                placeholder: 'defaultGroupSize',
                required: true
            }
        },
        {
            key: 'groupNamePattern',
            type: 'input',
            props: {
                translate: true,
                label: 'groupNamePattern',
                placeholder: 'groupNamePattern',
                required: true
            }
        },
        {
            key: 'defaultGroupAssignmentLogic',
            type: 'select',
            props: {
                translate: true,
                translateSelectOptions: true,
                label: 'defaultGroupAssignmentLogic',
                placeholder: 'defaultGroupAssignmentLogic',
                required: true,
                appendTo: 'body',
                options: defaultGroupAssignmentLogics()
            }
        },
        {
            key: 'autoArchiveGroupsAfterYears',
            type: 'input-number',
            props: {
                translate: true,
                label: 'autoArchiveGroupsAfterYears',
                placeholder: 'autoArchiveGroupsAfterYears',
                required: true
            }
        },
        {
            key: 'archiveDataRetentionPeriodDays',
            type: 'input-number',
            props: {
                translate: true,
                label: 'archiveDataRetentionPeriodDays',
                placeholder: 'archiveDataRetentionPeriodDays',
                required: true
            }
        },
        {
            key: 'defaultLMSGroupPrefix',
            type: 'input',
            props: {
                translate: true,
                label: 'defaultLMSGroupPrefix',
                placeholder: 'defaultLMSGroupPrefix',
                required: true
            }
        },
        {
            key: 'allowManualGroupCreation',
            type: 'checkbox',
            defaultValue: true,
            props: {
                translate: true,
                label: 'allowManualGroupCreation',
                required: true
            }
        },
        {
            key: 'syncGroupsToLMS',
            type: 'checkbox',
            defaultValue: true,
            props: {
                translate: true,
                label: 'syncGroupsToLMS',
                required: true
            }
        }
    ];
    form = new FormGroup({});
    model = {} as GroupSettingResponse;

    private $groupSettings = inject(GroupSettingsService);
    private $cdr = inject(ChangeDetectorRef);

    ngOnInit(): void {
        this.$groupSettings.get().subscribe((w) => {
            this.model = w;
            this.$cdr.markForCheck();
        });
    }

    submit() {
        if (this.model.id) {
            this.$groupSettings.put(this.model, this.model.id).subscribe();
            return;
        }
        this.$groupSettings.create(this.model).subscribe();
    }
}
