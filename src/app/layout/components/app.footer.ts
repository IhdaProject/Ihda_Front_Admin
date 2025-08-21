import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutService } from '@/layout/service/layout.service';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: '[app-footer]',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule],
    template: ` <div class="layout-footer">
        <img [src]="'/layout/images/logo/footer-' + (layoutService.isDarkTheme() ? 'avalon-dark' : 'avalon') + '.svg'" alt="avalon-footer-logo" />
        <div class="flex gap-2">
            <button pButton pRipple type="button" icon="pi pi-github" rounded text plain></button>
            <button pButton pRipple type="button" icon="pi pi-facebook" rounded text plain></button>
            <button pButton pRipple type="button" icon="pi pi-twitter" rounded text plain></button>
        </div>
    </div>`
})
export class AppFooter {
    layoutService: LayoutService = inject(LayoutService);
}
