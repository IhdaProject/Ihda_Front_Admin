import { inject, Pipe, type PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { map } from 'rxjs';
import { FileStorageService } from 'src/core/services/file-storage.service';

@Pipe({
    name: 'appFileDownload'
})
export class FileDownloadPipe implements PipeTransform {
    private $file = inject(FileStorageService);
    private sanitizer = inject(DomSanitizer);
    transform(fileKey: string) {
        return this.$file.download(fileKey).pipe(
            map((blob: any) => {
                const url = URL.createObjectURL(blob);
                return this.sanitizer.bypassSecurityTrustUrl(url);
            })
        );
    }
}
