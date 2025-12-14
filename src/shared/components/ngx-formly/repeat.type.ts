import { Component, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldArrayType, FormlyModule } from '@ngx-formly/core';

@Component({
    selector: 'formly-repeat-file',
    standalone: true,
    imports: [CommonModule, FormlyModule],
    template: `
        <div class="file-upload-container">
            <input
                type="file"
                [accept]="acceptedTypes"
                (change)="handleMultipleFiles($event)"
                class="hidden-input"
                id="main-file-input"
                multiple
            />

            <div *ngFor="let file of files; let i = index" class="file-item">
                <div class="file-preview">
                    <!-- Image preview -->
                    <img
                        *ngIf="file && isImage(file)"
                        [src]="getLocalPreview(file)"
                        alt="Preview"
                        class="preview-image"
                    />

                    <!-- Video preview -->
                    <video
                        *ngIf="file && isVideo(file)"
                        [src]="getLocalPreview(file)"
                        class="preview-video"
                        muted
                    ></video>

                    <!-- PDF icon -->
                    <div *ngIf="file && isPDF(file)" class="file-icon pdf">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                            ></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                    </div>

                    <!-- Audio icon -->
                    <div *ngIf="file && isAudio(file)" class="file-icon audio">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <polygon
                                points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"
                            ></polygon>
                        </svg>
                    </div>

                    <!-- Document icon -->
                    <div
                        *ngIf="file && isDocument(file)"
                        class="file-icon document"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                            ></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                    </div>

                    <!-- Other files icon -->
                    <div *ngIf="file && isOther(file)" class="file-icon other">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"
                            ></path>
                            <polyline points="13 2 13 9 20 9"></polyline>
                        </svg>
                    </div>
                </div>

                <div class="action-overlay">
                    <button
                        type="button"
                        (click)="viewFile(file, i)"
                        class="action-btn view-btn"
                        title="Ko'rish"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                            ></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    </button>

                    <button
                        type="button"
                        (click)="removeFile(i)"
                        class="action-btn delete-btn"
                        title="O'chirish"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path
                                d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                            ></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                    </button>
                </div>
            </div>

            <button
                type="button"
                (click)="openMainFileSelector()"
                class="add-btn"
                title="Fayl qo'shish"
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
            </button>
        </div>
    `,
    styles: [
        `
            .file-upload-container {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                padding: 8px;
            }

            /* Light mode */
            .file-item {
                position: relative;
                width: 60px;
                height: 60px;
                border-radius: 8px;
                overflow: hidden;
                transition: all 0.2s ease;
                background: #f8f9fa;
                border: 2px solid #e9ecef;
                flex-shrink: 0;
            }

            .file-item:hover {
                border-color: #007bff;
                box-shadow: 0 2px 8px rgba(0, 123, 255, 0.2);
                transform: scale(1.05);
            }

            /* Dark mode */
            :host-context(.dark-mode) .file-item,
            :host-context([data-theme='dark']) .file-item {
                background: #1e1e1e;
                border-color: #3a3a3a;
            }

            :host-context(.dark-mode) .file-item:hover,
            :host-context([data-theme='dark']) .file-item:hover {
                border-color: #4a9eff;
                box-shadow: 0 2px 8px rgba(74, 158, 255, 0.4);
            }

            .hidden-input {
                display: none;
            }

            .file-preview {
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .preview-image,
            .preview-video {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .file-icon {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
            }

            .file-icon svg {
                width: 28px;
                height: 28px;
                opacity: 0.8;
            }

            /* Light mode icon colors */
            .file-icon.pdf svg {
                color: #dc3545;
            }
            .file-icon.audio svg {
                color: #17a2b8;
            }
            .file-icon.document svg {
                color: #007bff;
            }
            .file-icon.other svg {
                color: #6c757d;
            }

            /* Dark mode icon colors */
            :host-context(.dark-mode) .file-icon svg,
            :host-context([data-theme='dark']) .file-icon svg {
                opacity: 0.9;
            }

            :host-context(.dark-mode) .file-icon.pdf svg,
            :host-context([data-theme='dark']) .file-icon.pdf svg {
                color: #ff6b6b;
            }

            :host-context(.dark-mode) .file-icon.audio svg,
            :host-context([data-theme='dark']) .file-icon.audio svg {
                color: #4dabf7;
            }

            :host-context(.dark-mode) .file-icon.document svg,
            :host-context([data-theme='dark']) .file-icon.document svg {
                color: #4a9eff;
            }

            :host-context(.dark-mode) .file-icon.other svg,
            :host-context([data-theme='dark']) .file-icon.other svg {
                color: #adb5bd;
            }

            /* Light mode overlay */
            .action-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.65);
                backdrop-filter: blur(2px);
                display: none;
                align-items: center;
                justify-content: center;
                gap: 8px;
                z-index: 10;
                opacity: 0;
                transition: opacity 0.2s ease;
            }

            /* Dark mode overlay */
            :host-context(.dark-mode) .action-overlay,
            :host-context([data-theme='dark']) .action-overlay {
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(3px);
            }

            .file-item:hover .action-overlay {
                display: flex;
                opacity: 1;
            }

            /* Light mode buttons */
            .action-btn {
                width: 32px;
                height: 32px;
                border-radius: 8px;
                border: none;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                background: rgba(255, 255, 255, 0.2);
                backdrop-filter: blur(10px);
            }

            /* Dark mode buttons */
            :host-context(.dark-mode) .action-btn,
            :host-context([data-theme='dark']) .action-btn {
                background: rgba(255, 255, 255, 0.15);
            }

            /* View button hover */
            .view-btn:hover {
                background: #007bff;
                transform: scale(1.15);
            }

            :host-context(.dark-mode) .view-btn:hover,
            :host-context([data-theme='dark']) .view-btn:hover {
                background: #4a9eff;
            }

            /* Delete button hover */
            .delete-btn:hover {
                background: #dc3545;
                transform: scale(1.15);
            }

            :host-context(.dark-mode) .delete-btn:hover,
            :host-context([data-theme='dark']) .delete-btn:hover {
                background: #ff6b6b;
            }

            .action-btn svg {
                width: 18px;
                height: 18px;
            }

            /* Light mode add button */
            .add-btn {
                width: 60px;
                height: 60px;
                border-radius: 8px;
                background: #ffffff;
                border: 2px dashed #007bff;
                color: #007bff;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                flex-shrink: 0;
            }

            /* Dark mode add button */
            :host-context(.dark-mode) .add-btn,
            :host-context([data-theme='dark']) .add-btn {
                background: #1e1e1e;
                border-color: #4a9eff;
                color: #4a9eff;
            }

            /* Light mode add button hover */
            .add-btn:hover {
                background: #007bff;
                color: white;
                border-color: #007bff;
                box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
                transform: scale(1.05);
            }

            /* Dark mode add button hover */
            :host-context(.dark-mode) .add-btn:hover,
            :host-context([data-theme='dark']) .add-btn:hover {
                background: #4a9eff;
                color: #0a0a0a;
                border-color: #4a9eff;
                box-shadow: 0 2px 8px rgba(74, 158, 255, 0.4);
            }

            .add-btn svg {
                width: 24px;
                height: 24px;
            }
        `
    ]
})
export class RepeatFileTypeComponent extends FieldArrayType {
    @Input() acceptedTypes: string = '*/*'; // Qabul qilinadigan file turlari

    files: File[] = [];

    handleMultipleFiles(event: any) {
        const selectedFiles = Array.from(event.target.files || []) as File[];
        this.files.push(...selectedFiles);
        this.updateFormValue();

        // Reset input
        event.target.value = '';
    }

    removeFile(index: number) {
        this.files.splice(index, 1);
        this.updateFormValue();
    }

    viewFile(file: File, index: number) {
        if (!file) return;

        const url = URL.createObjectURL(file);

        // Rasm yoki video bo'lsa - yangi oynada ochish
        if (this.isImage(file) || this.isVideo(file)) {
            window.open(url, '_blank');
        } else {
            // Boshqa fayllar uchun - yuklab olish
            const link = document.createElement('a');
            link.href = url;
            link.download = file.name;
            link.click();
            URL.revokeObjectURL(url);
        }
    }

    getLocalPreview(file: File): string {
        return file ? URL.createObjectURL(file) : '';
    }

    openMainFileSelector() {
        const fileInput = document.getElementById(
            'main-file-input'
        ) as HTMLInputElement;
        if (fileInput) {
            fileInput.click();
        }
    }

    getFiles(): File[] {
        return this.files.filter((f) => !!f);
    }

    // File turi tekshiruvlari
    isImage(file: File): boolean {
        return file.type.startsWith('image/');
    }

    isVideo(file: File): boolean {
        return file.type.startsWith('video/');
    }

    isPDF(file: File): boolean {
        return file.type === 'application/pdf';
    }

    isAudio(file: File): boolean {
        return file.type.startsWith('audio/');
    }

    isDocument(file: File): boolean {
        const docTypes = [
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'text/plain'
        ];
        return docTypes.includes(file.type);
    }

    isOther(file: File): boolean {
        return (
            !this.isImage(file) &&
            !this.isVideo(file) &&
            !this.isPDF(file) &&
            !this.isAudio(file) &&
            !this.isDocument(file)
        );
    }

    private updateFormValue() {
        // Formly field value ni yangilash
        if (this.field && this.field.formControl) {
            this.field.formControl.setValue(this.getFiles());
        }
    }
}
