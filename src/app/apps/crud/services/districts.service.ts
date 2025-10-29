import { inject, Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { TableColumn } from '../types/table';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ActivatedRoute } from '@angular/router';
import { SettingsService } from 'src/shared/services/settings.service';
import { tap } from 'rxjs';

@Injectable()
export class DistrictsService extends CrudService {
    override urlCreate = 'api-rb/district';
    override urlUpdate = 'api-rb/district';
    override urlDelete = 'api-rb/district';
    private route = inject(ActivatedRoute);
    private $settings = inject(SettingsService);

    override urlGetAll = 'api-rb/district';
    override title: string = 'districts';
    override columns: TableColumn[] = [
        {
            field: 'id'
        },
        {
            field: 'name'
        },
        {
            field: 'code'
        },
        {
            field: 'regionName'
        }
    ];

    override fields: FormlyFieldConfig[] = [
        {
            key: 'name',
            type: 'input',
            props: {
                translate: true,
                label: 'name',
                placeholder: 'name',
                required: true
            }
        },
        {
            key: 'code',
            type: 'input',
            props: {
                label: 'code',
                placeholder: 'code',
                required: true
            }
        },
        {
            key: 'country',
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
                            .get('country')
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
        }
    ];
}
