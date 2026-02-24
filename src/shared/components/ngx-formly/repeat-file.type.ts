import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldArrayType, FormlyModule } from '@ngx-formly/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GeneralModel } from 'src/shared/types/general-model';
import { ImageViewPipe } from 'src/shared/pipes/image-view.pipe';

interface FileItemDto {
    dbUrl: string;
    tempUrl: string;
}

@Component({
    selector: 'formly-repeat-file',
    standalone: true,
    imports: [CommonModule, FormlyModule, ImageViewPipe],
    template: `
        <div class="file-upload-container">
            <input
                type="file"
                [accept]="to['acceptedTypes'] || '*/*'"
                (change)="handleMultipleFiles($event)"
                class="hidden-input"
                #fileInput
                multiple
            />

            <div *ngFor="let file of model; let i = index" class="file-item">
                <div class="file-preview">
                    <img
                        *ngIf="isImage(file.tempUrl)"
                        [src]="file.tempUrl | appImageWiev"
                        alt="Preview"
                        class="preview-image"
                    />

                    <video
                        *ngIf="isVideo(file.tempUrl)"
                        [src]="file.tempUrl | appImageWiev"
                        class="preview-video"
                        muted
                    ></video>

                    <div *ngIf="isPDF(file.tempUrl)" class="file-icon pdf">
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

                    <div *ngIf="isAudio(file.tempUrl)" class="file-icon audio">
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

                    <div
                        *ngIf="isDocument(file.tempUrl)"
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

                    <div *ngIf="isOther(file.tempUrl)" class="file-icon other">
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
                        (click)="viewFile(file)"
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
                        (click)="remove(i)"
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
                        </svg>
                    </button>
                </div>
            </div>

            <button
                type="button"
                (click)="fileInput.click()"
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
            .file-item {
                position: relative;
                width: 60px;
                height: 60px;
                border-radius: 8px;
                overflow: hidden;
                background: #f8f9fa;
                border: 2px solid #e9ecef;
                flex-shrink: 0;
                transition: all 0.2s;
            }
            .file-item:hover {
                border-color: #007bff;
                transform: scale(1.05);
            }
            .hidden-input {
                display: none;
            }
            .file-preview {
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
            .file-icon svg {
                width: 28px;
                height: 28px;
            }
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
            .action-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.6);
                display: none;
                align-items: center;
                justify-content: center;
                gap: 4px;
            }
            .file-item:hover .action-overlay {
                display: flex;
            }
            .action-btn {
                width: 24px;
                height: 24px;
                border-radius: 4px;
                border: none;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(255, 255, 255, 0.2);
            }
            .view-btn:hover {
                background: #007bff;
            }
            .delete-btn:hover {
                background: #dc3545;
            }
            .add-btn {
                width: 60px;
                height: 60px;
                border-radius: 8px;
                background: transparent;
                border: 2px dashed #007bff;
                color: #007bff;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }
            .add-btn:hover {
                background: #007bff;
                color: white;
            }

            :host-context([data-theme='dark']) .file-item {
                background: #1e1e1e;
                border-color: #333;
            }
            :host-context([data-theme='dark']) .add-btn {
                border-color: #4a9eff;
                color: #4a9eff;
            }
        `
    ]
})
export class RepeatFileTypeComponent extends FieldArrayType {
    constructor(private http: HttpClient) {
        super();
    }

    handleMultipleFiles(event: any) {
        const selectedFiles = Array.from(event.target.files || []) as File[];

        selectedFiles.forEach((file) => {
            const formData = new FormData();
            formData.append('File', file);
            const endpoint = environment.API_BASE_URL + '/api-fm/file/upload';

            this.http
                .post<GeneralModel<FileItemDto>>(endpoint, formData)
                .subscribe({
                    next: (res) => {
                        if (res.code === 200 && res.content) {
                            this.add(this.model?.length ?? 0, res.content);
                        }
                    },
                    error: (err) => console.error('Upload error:', err)
                });
        });

        event.target.value = '';
    }

    viewFile(file: FileItemDto) {
        if (file?.tempUrl) {
            window.open(environment.API_BASE_URL + file.tempUrl, '_blank');
        }
    }

    private getExt(url: string): string {
        if (!url) return '';
        return url.split(/[#?]/)[0].split('.').pop()?.toLowerCase() || '';
    }

    isImage(url: string): boolean {
        return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(
            this.getExt(url)
        );
    }

    isVideo(url: string): boolean {
        return ['mp4', 'webm', 'ogg'].includes(this.getExt(url));
    }

    isPDF(url: string): boolean {
        return this.getExt(url) === 'pdf';
    }

    isAudio(url: string): boolean {
        return ['mp3', 'wav', 'aac'].includes(this.getExt(url));
    }

    isDocument(url: string): boolean {
        return ['doc', 'docx', 'xls', 'xlsx', 'txt'].includes(this.getExt(url));
    }

    isOther(url: string): boolean {
        return (
            !this.isImage(url) &&
            !this.isVideo(url) &&
            !this.isPDF(url) &&
            !this.isAudio(url) &&
            !this.isDocument(url)
        );
    }
}
