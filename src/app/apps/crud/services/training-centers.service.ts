import { inject, Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { TableColumn } from '../types/table';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ActivatedRoute } from '@angular/router';
import { SettingsService } from 'src/shared/services/settings.service';
import { tap } from 'rxjs';

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
        { field: 'phoneNumber', header: 'Phone Number' },
        { field: 'photosLink', header: 'Photos' },
        { field: 'workingHours', header: 'Working Hours' },
        { field: 'latitude', header: 'Latitude' },
        { field: 'longitude', header: 'Longitude' },
        { field: 'districtId', header: 'District' }
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
            type: 'repeat', // agar formly-repeat qo‘shilgan bo‘lsa, massiv kiritish uchun
            props: {
                label: 'Photos'
            },
            fieldArray: {
                type: 'input',
                props: {
                    placeholder: 'Photo URL'
                }
            }
        },
        {
            key: 'workingHours',
            type: 'input', // yoki custom select bo‘lishi mumkin
            props: {
                label: 'Working Hours',
                placeholder: 'Enter working hours'
            }
        },
        {
            key: 'latitude',
            type: 'input',
            props: {
                type: 'number',
                label: 'Latitude',
                placeholder: 'Enter latitude'
            }
        },
        {
            key: 'longitude',
            type: 'input',
            props: {
                type: 'number',
                label: 'Longitude',
                placeholder: 'Enter longitude'
            }
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
        }
    ];
}
