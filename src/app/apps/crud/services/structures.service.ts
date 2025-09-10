import { inject, Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { TableColumn } from '../types/table';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class StructuresService extends CrudService {
    private route = inject(ActivatedRoute);

    override url = 'api-auth/role/getallstructures';
    override title: string = 'structures';
    override columns: TableColumn[] = [
        {
            field: 'id'
        },
        {
            field: 'name',
            sortable: true,
            primary: true
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
      required: true,
    },
  },
  {
    key: 'permissionIds',
    type: 'select',
    props: {
  label: 'permissionIds',
  placeholder: 'Select permissions',
  multiple: true,
  options: []
}
  },
];


    override update(id: string, model: any): Observable<any> {
        model.typeCode = this.route.snapshot.queryParams['typeCode'];
        return super.update(id, model);
    }
}
