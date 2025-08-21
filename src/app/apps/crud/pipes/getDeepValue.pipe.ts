import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'getDeepValue',
    standalone: true
})
export class GetDeepValuePipe implements PipeTransform {
    transform(field: string, data?: any) {
        const splitted = field.split('.');
        if (splitted.length === 0) {
            return '';
        }

        let value = data[splitted[0]];
        for (let index = 1; index < splitted.length; index++) {
            if (value == null || value == undefined) {
                break;
            }
            value = value[splitted[index]];
        }
        return value;
    }
}
