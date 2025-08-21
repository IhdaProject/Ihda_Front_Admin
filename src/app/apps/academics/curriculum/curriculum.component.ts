import Crud from '@/apps/crud/crud';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-curriculum',
    imports: [Crud],
    template: `<app-crud
        [widthActions]="'150px'"
        [enableRowClick]="true"
        (clickedRow)="clickedRow($event)"
    >
    </app-crud>`,
    styleUrl: './curriculum.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export default class CurriculumComponent {
    private $router = inject(Router);
    private $route = inject(ActivatedRoute);
    clickedRow(e: any) {
        this.$router.navigate([e.id], { relativeTo: this.$route });
    }
}
