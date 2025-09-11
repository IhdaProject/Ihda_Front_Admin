import { PermissionsService } from './permissions.service';
import { inject, Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { TableColumn } from '../types/table';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class StructuresService extends CrudService {
    private route = inject(ActivatedRoute);
    private permissionsService = inject(PermissionsService);

    override urlGetAll = 'api-auth/role/getallstructures';
    override urlCreate = 'api-auth/role/CreateStructure';
    override urlUpdate = 'api-auth/role/EditStructure';
    override urlDelete = 'api-auth/role/DeleteStructure';
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
                required: true
            }
        },
        {
            key: 'permissionIds',
            type: 'select', // 🔑 Formly ng-select type
            props: {
                label: 'Permissions',
                placeholder: 'Select permissions',
                multiple: true,
                virtualScroll: true,
                options: this.permissionsService.all$(), // async observable
                bindLabel: 'name',
                bindValue: 'id'
            },
            hooks: {
                onInit: () => {
                    this.permissionsService.loadMore().subscribe();
                }
            },
            templateOptions: {
                // 🔑 ng-select specific event
                onScrollToEnd: () => {
                    this.permissionsService.loadMore().subscribe();
                }
            }
        }
    ];

    override update(id: string, model: any): Observable<any> {
        model.typeCode = this.route.snapshot.queryParams['typeCode'];
        return super.update(id, model);
    }
}
