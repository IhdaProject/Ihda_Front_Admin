import { inject, Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { obj2FormData } from '../utils/util';

export enum StorageCategory {
    STUDENT_DOCUMENT = 'STUDENT_DOCUMENT',
    TEACHER_DOCUMENT = 'TEACHER_DOCUMENT',
    COURSE_MATERIAL = 'COURSE_MATERIAL',
    ASSIGNMENT = 'ASSIGNMENT',
    PROFILE_PICTURE = 'PROFILE_PICTURE',
    SYSTEM_DOCUMENT = 'SYSTEM_DOCUMENT',
    SCHOOL_DOCUMENT = 'SCHOOL_DOCUMENT',
    ADMISSION_DOCUMENT = 'ADMISSION_DOCUMENT',
    CERTIFICATE = 'CERTIFICATE',
    EXAM_DOCUMENT = 'EXAM_DOCUMENT',
    ADMINISTRATIVE_DOCUMENT = 'ADMINISTRATIVE_DOCUMENT',
    FINANCIAL_DOCUMENT = 'FINANCIAL_DOCUMENT',
    REPORT = 'REPORT',
    OTHER = 'OTHER'
}

@Injectable({
    providedIn: 'root'
})
export class FileStorageService {
    private $base = inject(BaseService);

    upload(category: StorageCategory, file: File) {
        const formData = obj2FormData({ file, category });
        return this.$base.post('storage/upload', formData);
    }

    download(fileKey: string) {
        return this.$base.get('storage/download/' + fileKey, {
            responseType: 'blob'
        });
    }

    url(fileKey: string) {
        return this.$base.get('storage/url/' + fileKey);
    }
}
