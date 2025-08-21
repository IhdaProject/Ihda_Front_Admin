import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    ActivatedRouteSnapshot,
    NavigationEnd,
    Router,
    RouterModule
} from '@angular/router';

import { BehaviorSubject, filter } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TranslocoModule } from '@jsverse/transloco';

interface Breadcrumb {
    label: string;
    url?: string;
}

@Component({
    selector: '[app-breadcrumb]',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule, TranslocoModule],
    template: ` <div class="layout-breadcrumb-container">
        <nav class="layout-breadcrumb">
            <ol>
                <li><i class="pi pi-home"></i></li>
                <ng-template
                    ngFor
                    let-item
                    let-last="last"
                    [ngForOf]="breadcrumbs$ | async"
                >
                    <li><i class="pi pi-angle-right"></i></li>
                    <li>
                        <span>{{ item.label | transloco }}</span>
                    </li>
                </ng-template>
            </ol>
        </nav>
        <div class="layout-breadcrumb-buttons">
            <!--<button
                pButton
                pRipple
                type="button"
                icon="pi pi-cloud-upload"
                class="p-button-rounded p-button-text p-button-plain"
            ></button>
            <button
                pButton
                pRipple
                type="button"
                icon="pi pi-bookmark"
                class="p-button-rounded p-button-text p-button-plain"
            ></button>
            <button
                pButton
                pRipple
                type="button"
                icon="pi pi-power-off"
                class="p-button-rounded p-button-text p-button-plain"
            ></button>-->
        </div>
    </div>`,
    host: {
        class: 'content-breadcrumb'
    }
})
export class AppBreadcrumb {
    private readonly _breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>([]);

    readonly breadcrumbs$ = this._breadcrumbs$.asObservable();

    constructor(private router: Router) {
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe((event) => {
                const root = this.router.routerState.snapshot.root;
                const breadcrumbs: Breadcrumb[] = [];
                this.addBreadcrumb(root, [], breadcrumbs);

                this._breadcrumbs$.next(breadcrumbs);
            });
    }

    private addBreadcrumb(
        route: ActivatedRouteSnapshot,
        parentUrl: string[],
        breadcrumbs: Breadcrumb[]
    ) {
        const routeUrl = parentUrl.concat(route.url.map((url) => url.path));
        const breadcrumb = route.data['breadcrumb'];
        const parentBreadcrumb =
            route.parent && route.parent.data
                ? route.parent.data['breadcrumb']
                : null;

        if (breadcrumb && breadcrumb !== parentBreadcrumb) {
            breadcrumbs.push({
                label: route.data['breadcrumb'],
                url: '/' + routeUrl.join('/')
            });
        }

        if (route.firstChild) {
            this.addBreadcrumb(route.firstChild, routeUrl, breadcrumbs);
        }
    }
}
