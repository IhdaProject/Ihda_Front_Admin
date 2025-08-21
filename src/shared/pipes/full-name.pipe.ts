import { Pipe, type PipeTransform } from '@angular/core';
import { IPerson } from 'src/core/types/person';
import { fullName } from 'src/core/utils/util';

@Pipe({
    name: 'appFullName',
    standalone: true
})
export class FullNamePipe implements PipeTransform {
    transform(value: IPerson | null | undefined, short = false) {
        return fullName(value, short);
    }
}
