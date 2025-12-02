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

// getPermissions() qaytarishi kerak bo'lgan kutilgan tur
interface PermissionOption {
    value: number; // Yoki string
    label: string;
}

// Props turini kengaytirish
interface ModalPermissionsProps extends FormlyFieldProps {
    buttonText?: string;
    options: Observable<PermissionOption[]>; // Permissions list
}

@Component({
    selector: 'app-formly-modal-field', // Selector sizning yangi component nomingizga mos
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
    // Modelga yozishdan oldin modal ichida vaqtinchalik tanlovni ushlab turish
    currentSelection = signal<number[]>([]);

    // FIX 1: Display qiymatini reaktiv ushlab turish uchun signal
    modelValueSignal = signal<number[]>([]);

    // Modal holati
    isModalOpen = signal(false);

    // Barcha ruxsatnomalarni saqlash uchun sinyal
    allPermissions = signal<PermissionOption[]>([]);

    private $settings = inject(SettingsService);

    // FIX 2: selectedLabels endi modelValueSignal ga bog'liq
    selectedLabels = computed(() => {
        const selectedIds = this.modelValueSignal(); // <-- ModelValueSignal dan o'qiydi
        const all = this.allPermissions();

        if (selectedIds.length === 0 || all.length === 0) {
            return '';
        }

        const labels = all
            .filter((p) => selectedIds.includes(p.value))
            .map((p) => p.label);

        return labels.join(', ');
    });

    ngOnInit() {
        // FIX 3: Komponent yuklanganda formControl.value ni display signaliga yuklash.
        this.modelValueSignal.set(this.formControl.value || []);

        // 1. Ruxsatnomalar listini Service orqali olish (faqat bir marta)
        this.$settings
            .getPermissions()
            .pipe(take(1))
            .subscribe((perms) => {
                this.allPermissions.set(perms as unknown as PermissionOption[]);
            });

        // 2. Tashqi model o'zgarganda (masalan, API orqali) displayni yangilash
        this.formControl.valueChanges.subscribe((value) => {
            // Faqat tashqaridan kelgan o'zgarishlar uchun displayni yangilaydi
            this.modelValueSignal.set(value || []);
        });
    }

    openModal() {
        // Modal ochilganda modeldagi joriy qiymatni sinyalga yuklash (edit qilish uchun)
        // currentSelection display signalining joriy qiymatidan boshlanadi.
        this.currentSelection.set(this.modelValueSignal() || []);
        this.isModalOpen.set(true);
    }

    closeModal(commitChanges: boolean = false) {
        if (commitChanges) {
            // OK bosilganda:
            // 1. Formly modelini yangilash
            this.formControl.setValue(this.currentSelection());

            // FIX 4: Display signalini ham yangilash. Bu 'selectedLabels' ni qayta hisoblashga majbur qiladi.
            this.modelValueSignal.set(this.currentSelection());

            this.formControl.markAsDirty();
            this.formControl.markAsTouched();
        }
        // Agar commitChanges false bo'lsa (backdrop bosilganda), qiymatlar bekor qilinmaydi
        this.isModalOpen.set(false);
    }

    // Joriy ruxsatnoma (ID) modal ichida tanlanganmi
    isPermissionSelected(permissionId: number): boolean {
        return this.currentSelection().includes(permissionId);
    }

    // Modal ichidagi element bosilganda tanlovni almashtirish
    onPermissionChange(permissionId: number): void {
        const currentIds: number[] = this.currentSelection();
        let newIds: number[];

        if (currentIds.includes(permissionId)) {
            // Agar tanlangan bo'lsa, uni o'chirish
            newIds = currentIds.filter((id) => id !== permissionId);
        } else {
            // Agar tanlanmagan bo'lsa, uni qo'shish
            newIds = [...currentIds, permissionId];
        }

        // Sinnalni yangilash
        this.currentSelection.set(newIds);
    }
}
