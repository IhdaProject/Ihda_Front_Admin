import { FormArray, FormGroup, UntypedFormGroup } from '@angular/forms';
import { IPerson } from '../types/person';

/**
 *
 * Checks for validation to the reactive form
 * @param form Forom needs validation
 */
export function markAllAsDirty(
    form: UntypedFormGroup,
    skippedControls?: string[]
) {
    Object.keys(form.controls).forEach((controlName) => {
        if (skippedControls && skippedControls?.indexOf(controlName) >= 0) {
            return;
        }

        const control = form.controls[controlName];
        if (control.invalid) {
            if (control instanceof UntypedFormGroup) {
                Object.values(control.controls).forEach((subControl) => {
                    if (subControl.invalid) {
                        subControl.markAsDirty();
                        subControl.updateValueAndValidity({ onlySelf: true });
                    }
                });
            } else if (control instanceof FormArray) {
                control.controls.forEach((fb) => {
                    Object.values((fb as FormGroup).controls).forEach(
                        (subControl) => {
                            if (subControl.invalid) {
                                subControl.markAsDirty();
                                subControl.updateValueAndValidity({
                                    onlySelf: true
                                });
                            }
                        }
                    );
                });
            } else {
                control.markAsDirty();
                control.updateValueAndValidity({ onlySelf: true });
            }
        }
    });
}

export function fullName(value: IPerson | null | undefined, short = false) {
    if (!value) {
        return '';
    }
    let fullName = '';
    if (value.lastName) {
        fullName = `${value.lastName} `;
    }
    if (value.firstName) {
        fullName += short ? `${value.firstName[0]}. ` : `${value.firstName} `;
    }
    if (value.middleName) {
        fullName += short ? `${value.middleName[0]}.` : value.middleName;
    }
    return fullName;
}

/**
 *
 * @param obj
 * @returns
 */
export function obj2FormData(obj: any): FormData {
    const formData: FormData = new FormData();
    createFormData(obj, '', formData);

    return formData;
}

function createFormData(obj: any, subKeyStr = '', formData: FormData) {
    for (const i in obj) {
        const value = obj[i];
        const subKeyStrTrans = subKeyStr ? subKeyStr + '[' + i + ']' : i;
        if (value instanceof File) {
            formData.append(subKeyStrTrans, value, value?.name);
            continue;
        }

        if (
            typeof value === 'string' ||
            typeof value === 'number' ||
            value instanceof Date ||
            typeof value === 'boolean'
        ) {
            formData.append(subKeyStrTrans, value.toString());
        } else if (typeof value === 'object') {
            createFormData(value, subKeyStrTrans, formData);
        }
    }
}
