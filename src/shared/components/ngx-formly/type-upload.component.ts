import { AsyncPipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { ButtonDirective } from 'primeng/button';
import { FileStorageService } from 'src/core/services/file-storage.service';
import { FileDownloadPipe } from 'src/shared/pipes/file-download.pipe';

@Component({
    selector: 'app-type-tag',
    standalone: true,
    imports: [
        FormsModule,
        FormlyModule,
        ButtonDirective,
        FileDownloadPipe,
        AsyncPipe
    ],
    template: `
        <input
            type="file"
            [hidden]="true"
            #file
            (change)="handleFileInput($event)"
        />
        <div class="flex gap-4 items-center">
            @if (formControl && formControl.value; as fileKey) {
                @if (fileKey | appFileDownload | async; as imgSrc) {
                    <img [src]="imgSrc" width="100px" alt="" />
                }
            }
            <button
                pButton
                icon="pi pi-upload"
                type="button"
                (click)="file.click()"
            ></button>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypeUpload extends FieldType<FieldTypeConfig> {
    private $cdr = inject(ChangeDetectorRef);
    private $file = inject(FileStorageService);

    handleFileInput(e: any) {
        const file = e.target?.files?.item(0);
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                // this.fileSrc = reader.result as string;
                this.$cdr.markForCheck();
            };

            this.$file
                .upload(this.props['category'], file)
                .subscribe((w: any) => {
                    if (w) {
                        this.formControl.setValue(w.fileKey);
                    }
                    this.$cdr.markForCheck();
                });
        }
    }
}
