import { GeneralModel } from './../../../shared/types/general-model';
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    Input,
    input,
    output,
    signal,
    TemplateRef,
    viewChild
} from '@angular/core';
import { FilterMetadata, MessageService } from 'primeng/api';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import {
    AsyncPipe,
    CommonModule,
    DatePipe,
    Location,
    NgTemplateOutlet
} from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ProductService } from '@/pages/service/product.service';
import { CrudService } from './services/crud.service';
import { TranslocoModule } from '@jsverse/transloco';
import { FormlyForm } from '@ngx-formly/core';
import { markAllAsDirty } from 'src/core/utils/util';
import { SkeletonModule } from 'primeng/skeleton';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { Confirmable } from 'src/shared/decorators/confirmable.decorator';
import { GridResponse } from './types/base.model';
import { GetDeepValuePipe } from './pipes/getDeepValue.pipe';
import { catchError, finalize, map, take, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FileDownloadPipe } from 'src/shared/pipes/file-download.pipe';
import { HasPermissionDirective } from 'src/shared/directives/has-permission.directive';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'app-crud',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        DatePipe,
        TranslocoModule,
        SkeletonModule,
        ToggleSwitchModule,

        FormlyForm,
        ReactiveFormsModule,
        NgTemplateOutlet,
        GetDeepValuePipe,
        FileDownloadPipe,
        AsyncPipe,
        HasPermissionDirective
    ],
    templateUrl: './crud.html',
    providers: [ProductService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Crud<T> {
    widthActions = input('120px');
    extraBtnsTemplate = input<TemplateRef<any>>();
    enableRowClick = input<boolean>(false);
    clickedRow = output<any>();

    filters = input<{
        [s: string]: FilterMetadata | FilterMetadata[];
    }>({});

    @Input() viewPermission: number[] = [];
    @Input() addPermission: number[] = [];
    @Input() editPermission: number[] = [];
    @Input() deletePermission: number[] = [];

    dt = viewChild.required<Table>('dt');

    private $data = inject(CrudService);
    private $message = inject(MessageService);
    private $route = inject(ActivatedRoute);
    private $location = inject(Location);

    get columns() {
        return this.$data.columns;
    }

    get title() {
        return this.$data.title;
    }

    get fields() {
        return this.$data.fields;
    }

    get isEditing() {
        return !!this.model.id;
    }

    get enableBack() {
        return this.$route.snapshot.data['enableBack'];
    }

    model = { ...this.$data.model };

    visibleDialog = false;
    form = new FormGroup({});
    loadingData = false;

    data = signal<GeneralModel<T[]> | null>(null);

    loadData(e: TableLazyLoadEvent) {
        this.loadingData = true;
        this.$data.getAll<GeneralModel<T[]>>(e)
        .pipe(
            map((w) => {this.data.set(w)}),
            finalize(() => this.loadingData = false),
            take(1)
        ).subscribe();
    }

    submit(model = this.model) {
        // CHECK FOR VALIDATION
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            markAllAsDirty(this.form);
            return;
        }

        this.form.disable();
        const id = model.id;
        if (id) {
            // UPDATE
            this.$data
                .update<T>(id, model)
                .pipe(
                    catchError((w) => {
                        this.$message.add({
                            severity: 'error',
                            summary: w.error.error,
                            detail: w.error.path,
                            closable: true,
                            life: 10000
                        });
                        this.form.enable();
                        return throwError(() => w);
                    })
                )
                .subscribe(() => {
                    this.afterSuccesfullySubmit(model);
                });
            return;
        }

        // CREATE
        this.$data
            .create<T>(model)
            .pipe(
                catchError((w) => {
                    this.$message.add({
                        severity: 'error',
                        summary: w.error.error,
                        detail: w.error.path,
                        closable: true,
                        life: 10000
                    });
                    this.form.enable();
                    return throwError(() => w);
                })
            )
            .subscribe((newItem) => {
                this.afterSuccesfullySubmit(newItem);
            });
    }

    private afterSuccesfullySubmit(model: any, updated = false) {
        if (updated) {
            this.data.update(() => {
                const data = this.data();
                // const updatedItemIndex = data.content.findIndex(
                //     (w) => w.id === model.id
                // );
                // data.content[updatedItemIndex] = model;
                return data;
            });
        } else {
            // ! HOZIR QANDAY SORT QILYOTGANINI BILMAYMAN. NAME BOYICHA SORT QILYAPTIMI BILMADIM
            // ! SHUNING UCHUN QAYERGA QOSHISHNI BILMADIM YANGI ITEMNI
            // ! AGAR BOSHIGA YOKI OXIRIGA QOSHILSA DOIM BU MUAMMO BOLMAYDI.
            // ! BOLMASA loadData qilib turiladi
            // this.data.update(() => {
            //     const data = this.data();
            //     data.content.unshift(model);
            //     if (data.content.length > data.page.size) {
            //         data.content.pop();
            //     }
            //     data.page.totalElements++;
            //     return data;
            // });

            this.reload();
        }

        this.$message.add({
            severity: 'success',
            summary: 'Successful',
            detail: updated ? 'Updated' : 'Created',
            life: 3000
        });

        this.form.enable();
        this.hideDialog();
    }

    update(model: any) {
        this.submit(model);
    }

    @Confirmable()
    delete(model: any) {
        this.$data.delete(model.id).subscribe(() => {
            this.$message.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Deleted',
                life: 3000
            });
            this.reload();
        });
    }

    hideDialog() {
        this.visibleDialog = false;
    }

    edit(model: any) {
        this.model = { ...model };
        this.visibleDialog = true;
    }

    openNew() {
        this.form.reset();
        this.model = { ...this.$data.model };
        this.visibleDialog = true;
    }

    reload() {
        // This will trigger the table to reload with current filters, sort, and pagination
        this.dt().onLazyLoad.emit(this.dt().createLazyLoadMetadata());
    }

    back() {
        this.$location.back();
    }
}
