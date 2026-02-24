import {
    Component,
    inject,
    signal,
    computed,
    OnInit,
    ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    FieldType,
    FieldTypeConfig,
    FormlyModule,
    FormlyFieldProps
} from '@ngx-formly/core';
import { ButtonDirective } from 'primeng/button';
import { SettingsService } from 'src/shared/services/settings.service';
import { Observable, take } from 'rxjs';
import { TranslocoModule } from '@jsverse/transloco';
import { DrawerModule } from 'primeng/drawer';

interface SelectionOption {
    value: string | number;
    label: string;
}

interface ModalPermissionsProps extends FormlyFieldProps {
    buttonText?: string;
    options: Observable<SelectionOption[]>;
}

@Component({
    selector: 'app-formly-modal-field',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        FormlyModule,
        ButtonDirective,
        TranslocoModule,
        DrawerModule
    ],
    templateUrl: './formly-modal-field.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormlyModalField
    extends FieldType<FieldTypeConfig<ModalPermissionsProps>>
    implements OnInit
{
    currentSelection = signal<(string | number)[]>([]);

    modelValueSignal = signal<(string | number)[]>([]);

    isModalOpen = signal(false);

    allSelections = signal<SelectionOption[]>([]);

    private $settings = inject(SettingsService);

    selectedLabels = computed(() => {
        const selectedIds = this.modelValueSignal();
        const all = this.allSelections();

        if (selectedIds.length === 0 || all.length === 0) {
            return '';
        }

        const labels = all
            .filter((p) => selectedIds.includes(p.value))
            .map((p) => p.label)
            .slice(0, 3);

        return labels.join(', ') + '  . . . .';
    });

    ngOnInit() {
        this.modelValueSignal.set(this.formControl.value || []);

        this.field.props?.options?.pipe(take(1)).subscribe((perms) => {
            this.allSelections.set(perms as unknown as SelectionOption[]);
        });

        this.formControl.valueChanges.subscribe((value) => {
            this.modelValueSignal.set(value || []);
        });
    }

    openModal() {
        this.currentSelection.set(this.modelValueSignal() || []);
        this.isModalOpen.set(true);
    }

    closeModal(commitChanges: boolean = false) {
        if (commitChanges) {
            this.formControl.setValue(this.currentSelection());

            this.modelValueSignal.set(this.currentSelection());

            this.formControl.markAsDirty();
            this.formControl.markAsTouched();
        }
        this.isModalOpen.set(false);
    }

    isOptionsSelected(optionsId: string | number): boolean {
        return this.currentSelection().includes(optionsId);
    }

    onOptionsChange(optionsId: string | number): void {
        const currentIds: (string | number)[] = this.currentSelection();
        let newIds: (string | number)[];

        if (currentIds.includes(optionsId)) {
            newIds = currentIds.filter((id) => id !== optionsId);
        } else {
            newIds = [...currentIds, optionsId];
        }

        this.currentSelection.set(newIds);
    }
}
