import { inject, Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { TableColumn } from '../types/table';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class TrainingCentersService extends CrudService {
  override urlCreate = 'api-qc/TrainingCenter/CreateTrainingCenter';
  override urlUpdate = 'api-qc/TrainingCenter/UpdateTrainingCenter';
  override urlDelete = 'api-qc/TrainingCenter/TrainingCenter';
  override urlGetAll = 'api-qc/TrainingCenter/GetTrainingCenter';

  private route = inject(ActivatedRoute);

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
        required: true,
      },
    },
    {
      key: 'description',
      type: 'textarea',
      props: {
        label: 'Description',
        placeholder: 'Enter description',
      },
    },
    {
      key: 'address',
      type: 'input',
      props: {
        label: 'Address',
        placeholder: 'Enter address',
      },
    },
    {
      key: 'landmark',
      type: 'input',
      props: {
        label: 'Landmark',
        placeholder: 'Enter landmark',
      },
    },
    {
      key: 'phoneNumber',
      type: 'input',
      props: {
        label: 'Phone Number',
        placeholder: '+998 XX XXX XX XX',
      },
    },
    {
      key: 'photosLink',
      type: 'repeat', // agar formly-repeat qo‘shilgan bo‘lsa, massiv kiritish uchun
      props: {
        label: 'Photos',
      },
      fieldArray: {
        type: 'input',
        props: {
          placeholder: 'Photo URL',
        },
      },
    },
    {
      key: 'workingHours',
      type: 'input', // yoki custom select bo‘lishi mumkin
      props: {
        label: 'Working Hours',
        placeholder: 'Enter working hours',
      },
    },
    {
      key: 'latitude',
      type: 'input',
      props: {
        type: 'number',
        label: 'Latitude',
        placeholder: 'Enter latitude',
      },
    },
    {
      key: 'longitude',
      type: 'input',
      props: {
        type: 'number',
        label: 'Longitude',
        placeholder: 'Enter longitude',
      },
    },
    {
      key: 'districtId',
      type: 'input', // kelajakda select qilsa bo‘ladi
      props: {
        type: 'number',
        label: 'District',
        placeholder: 'Enter district ID',
      },
    },
  ];
}
