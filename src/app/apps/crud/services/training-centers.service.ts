import { inject, Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { TableColumn } from '../types/table';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ActivatedRoute } from '@angular/router';
import { SettingsService } from 'src/shared/services/settings.service';
import { map, Observable, of, switchMap, tap } from 'rxjs';

@Injectable()
export class TrainingCentersService extends CrudService {
    override urlCreate = 'api-qc/TrainingCenter/CreateTrainingCenter';
    override urlUpdate = 'api-qc/TrainingCenter/UpdateTrainingCenter';
    override urlDelete = 'api-qc/TrainingCenter/TrainingCenter';
    override urlGetAll = 'api-qc/TrainingCenter/GetTrainingCenter';

    private route = inject(ActivatedRoute);
    private $settings = inject(SettingsService);

    override title: string = 'training-centers';

    override columns: TableColumn[] = [
        { field: 'id', header: 'ID' },
        { field: 'name', header: 'Name' },
        { field: 'description', header: 'Description' },
        { field: 'address', header: 'Address' },
        { field: 'landmark', header: 'Landmark' },
        { field: 'phoneNumber', header: 'Phone Number' }
    ];

    override fields: FormlyFieldConfig[] = [
        {
            key: 'name',
            type: 'input',
            props: {
                translate: true,
                label: 'Name',
                placeholder: 'Enter name',
                required: true
            }
        },
        {
            key: 'description',
            type: 'textarea',
            props: {
                label: 'Description',
                placeholder: 'Enter description'
            }
        },
        {
            key: 'address',
            type: 'input',
            props: {
                label: 'Address',
                placeholder: 'Enter address'
            }
        },
        {
            key: 'landmark',
            type: 'input',
            props: {
                label: 'Landmark',
                placeholder: 'Enter landmark'
            }
        },
        {
            key: 'phoneNumber',
            type: 'input',
            props: {
                label: 'Phone Number',
                placeholder: '+998 XX XXX XX XX'
            }
        },
        {
            key: 'photosLink',
            type: 'repeat-file',
            props: { label: 'Photo' },
            fieldArray: {
                fieldGroup: [
                    {
                        key: 'tempUrl',
                        type: 'input',
                        props: { readonly: true }
                    },
                    {
                        key: 'dbUrl',
                        type: 'input',
                        props: { readonly: true }
                    }
                ]
            }
        },
        {
            key: 'workingHours',
            fieldGroupClassName: 'grid grid-cols-2 gap-4',
            templateOptions: { label: 'Ish vaqtlari' },
            fieldGroup: [
                {
                    key: 'monday',
                    type: 'input',
                    templateOptions: { label: 'Dushanba' }
                },
                {
                    key: 'tuesday',
                    type: 'input',
                    templateOptions: { label: 'Seshanba' }
                },
                {
                    key: 'wednesday',
                    type: 'input',
                    templateOptions: { label: 'Chorshanba' }
                },
                {
                    key: 'thursday',
                    type: 'input',
                    templateOptions: { label: 'Payshanba' }
                },
                {
                    key: 'friday',
                    type: 'input',
                    templateOptions: { label: 'Juma' }
                },
                {
                    key: 'saturday',
                    type: 'input',
                    templateOptions: { label: 'Shanba' }
                },
                {
                    key: 'sunday',
                    type: 'input',
                    templateOptions: { label: 'Yakshanba' }
                }
            ]
        },
        {
            key: 'latitude',
            type: 'map',
            props: {
                translate: true,
                label: 'location',
                required: true
            }
        },
        {
            key: 'longitude',
            type: 'input',
            className: 'hidden'
        },
        {
            key: 'countryId',
            type: 'select',
            props: {
                translate: true,
                label: 'country',
                placeholder: 'coutry',
                required: true,
                appendTo: 'body',
                options: this.$settings.getCountries()
            }
        },
        {
            key: 'regionId',
            type: 'select',
            props: {
                translate: true,
                label: 'region',
                placeholder: 'region',
                required: true,
                appendTo: 'body',
                options: []
            },
            hooks: {
                onInit: (field) => {
                    const form = field.formControl?.parent;
                    if (form) {
                        form
                            .get('countryId')
                            ?.valueChanges.subscribe((countryId) => {
                                const filtered = this.$settings
                                    .getRegions(countryId)
                                    .pipe(
                                        tap((regions) => {
                                            if (
                                                !regions.find(
                                                    (t) =>
                                                        t.value ===
                                                        field.formControl?.value
                                                )
                                            ) {
                                                field.formControl?.setValue(
                                                    null
                                                ); // eski tanlovni tozalash
                                            }
                                        })
                                    );
                                field.props!.options = filtered;
                            });
                    }
                }
            }
        },
        {
            key: 'districtId',
            type: 'select',
            props: {
                translate: true,
                label: 'district',
                placeholder: 'district',
                required: true,
                appendTo: 'body',
                options: []
            },
            hooks: {
                onInit: (field) => {
                    const form = field.formControl?.parent;
                    if (form) {
                        form
                            .get('regionId')
                            ?.valueChanges.subscribe((regionId) => {
                                const filtered = this.$settings
                                    .getDistricts(regionId)
                                    .pipe(
                                        tap((regions) => {
                                            if (
                                                !regions.find(
                                                    (t) =>
                                                        t.value ===
                                                        field.formControl?.value
                                                )
                                            ) {
                                                field.formControl?.setValue(
                                                    null
                                                ); // eski tanlovni tozalash
                                            }
                                        })
                                    );
                                field.props!.options = filtered;
                            });
                    }
                }
            }
        },
        {
            key: 'encryptUserIds',
            type: 'formly-modal-field',
            props: {
                translate: true,
                label: 'encryptUserIds',
                placeholder: 'encryptUserIds',
                required: true,
                appendTo: 'body',
                multiple: true,
                options: this.$settings.getUsers()
            }
        }
    ];

    override editModal(id: number) {
        return this.getTrainingCenterById(id);
    }

    getTrainingCenterById = (id: number) => {
        return of(null).pipe(
            switchMap((res) =>
                this.$base
                    .get<any>(
                        'api-qc/TrainingCenter/GetTrainingCenterById/' + id
                    )
                    .pipe(
                        map((res) => {
                            return res.content;
                        })
                    )
            )
        );
    };
}
