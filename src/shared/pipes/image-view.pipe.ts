import { inject, Pipe, type PipeTransform } from '@angular/core';
import { FileStorageService } from 'src/core/services/file-storage.service';
import { environment } from 'src/environments/environment';

@Pipe({
    name: 'appImageWiev'
})
export class ImageViewPipe implements PipeTransform {
    private $file = inject(FileStorageService);
    transform(fileKey: string) {
        return environment.API_BASE_URL + fileKey;
    }
}
