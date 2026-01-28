import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { AngularYandexMapsModule, YaReadyEvent } from 'angular8-yandex-maps';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'type-map',
    standalone: true,
    imports: [FormsModule, FormlyModule, AngularYandexMapsModule],
    template: `
        <div
            class="h-[300px] mt-2 rounded-lg overflow-hidden border border-gray-200"
        >
            @let latitude = formControl.parent?.value?.latitude;
            @let longitude = formControl.parent?.value?.longitude;
            <ya-map
                [center]="[latitude, longitude]"
                [zoom]="12"
                [state]="{
                    controls: ['zoomControl', 'fullscreenControl']
                }"
                (yaclick)="yaclick($event)"
            >
                <ya-placemark
                    [options]="{ draggable: true }"
                    [geometry]="[latitude, longitude]"
                    (yadragend)="yadragend($event)"
                ></ya-placemark>

                <ya-control
                    type="SearchControl"
                    (ready)="yandexMapControlReady($event)"
                ></ya-control>
            </ya-map>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypeMap extends FieldType<FieldTypeConfig> implements OnInit {
    ngOnInit(): void {
        const locationFormGroup = this.formControl.parent;
        if (!locationFormGroup?.value?.latitude) {
            this.setLocation([41.287625, 69.2281415]);
        }
    }

    yadragend(e: any) {
        const coordinates = e.target.geometry.getCoordinates();
        console.log(coordinates);
        this.setLocation(coordinates);
    }

    yaclick(e: any) {
        const coordinates = e.event.get('coords');
        console.log(coordinates);
        this.setLocation(coordinates);
    }

    yandexMapControlReady(yaReadyEvent: YaReadyEvent) {
        yaReadyEvent.target.events.add(
            'resultselect',
            (resultSelected: any) => {
                const index = resultSelected.get('index');
                yaReadyEvent.target.getResult(index).then((res: any) => {
                    console.log(res);
                    console.log('getLocalities', res.getLocalities());
                    console.log(
                        'getAdministrativeAreas',
                        res.getAdministrativeAreas()
                    );
                    console.log('getCountry', res.getCountry());
                    console.log('getCountryCode', res.getCountryCode());
                    console.log('getThoroughfare', res.getThoroughfare());
                    console.log('getPremise', res.getPremise());
                    console.log('getPremiseNumber', res.getPremiseNumber());
                    console.log('getAddressLine', res.getAddressLine());

                    const coordinates = res.geometry.getCoordinates();
                    const addressLine = res.getAddressLine();
                    this.setLocation(coordinates);
                });
            }
        );
    }

    setLocation([latitude, longitude]: [number, number]) {
        const locationFormGroup = this.formControl.parent as FormGroup;
        if (locationFormGroup) {
            locationFormGroup.patchValue({ latitude, longitude });
        }
    }
}
