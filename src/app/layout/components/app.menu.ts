import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppMenuitem } from './app.menuitem';
import { HasPermissionDirective } from 'src/shared/directives/has-permission.directive';

@Component({
    selector: '[app-menu]',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule, HasPermissionDirective],
    template: `<ul class="layout-menu" #menuContainer>
        <ng-container *ngFor="let item of model; let i = index">
            <li
                *hasPermission="item.permession"
                app-menuitem
                [item]="item"
                [index]="i"
                [root]="true"
            ></li>
            <li *hasPermission="item.permession" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    el = inject(ElementRef);

    @ViewChild('menuContainer') menuContainer!: ElementRef;

    model: any[] = [
        {
            label: 'Administration',
            permession: [10110001],
            items: [
                {
                    permession: [10110001],
                    label: 'users',
                    icon: 'pi pi-fw pi-users',
                    routerLink: ['/administration/user']
                }
            ]
        },
        {
            label: 'Settings',
            permession: [10110001, 10110003],
            icon: 'pi pi-fw pi-briefcase',
            items: [
                {
                    permession: [10110001],
                    label: 'permissions',
                    icon: 'pi pi-key',
                    routerLink: ['/settings/types']
                },
                {
                    permession: [10110003],
                    label: 'structures',
                    icon: 'pi pi-lock',
                    routerLink: ['/settings/structures']
                }
            ]
        },
        {
            label: 'Academics',
            items: [
                {
                    label: 'programmes',
                    icon: 'pi pi-fw pi-th-large',
                    routerLink: ['/academics/programme']
                },
                {
                    label: 'subjects',
                    icon: 'pi pi-fw pi-clipboard',
                    routerLink: ['/academics/subject']
                },
                {
                    label: 'years',
                    icon: 'pi pi-fw pi-stopwatch',
                    routerLink: ['/academics/year']
                },
                {
                    label: 'timeSlots',
                    icon: 'pi pi-fw pi-calendar-clock',
                    routerLink: ['/academics/time-slot']
                },
                {
                    label: 'terms',
                    icon: 'pi pi-fw pi-hourglass',
                    routerLink: ['/academics/term']
                },
                {
                    label: 'rooms',
                    icon: 'pi pi-fw pi-key',
                    routerLink: ['/academics/room']
                },
                {
                    label: 'schools',
                    icon: 'pi pi-fw pi-building-columns',
                    routerLink: ['/academics/school']
                },
                {
                    label: 'teachers',
                    icon: 'pi pi-fw pi-shield',
                    routerLink: ['/academics/teacher']
                },
                {
                    label: 'curriculums',
                    icon: 'pi pi-fw pi-calculator',
                    routerLink: ['/academics/curriculum']
                }
            ]
        },
        {
            label: 'Informations',
            permession: [30100001,30120001,30110001],
            items: [
                {
                    label: 'countries',
                    permession: [30100001],
                    icon: 'pi pi-flag',
                    routerLink: ['/informations/countries']
                },
                {
                    label: 'region',
                    permession: [30120001],
                    icon: 'pi pi-map-marker',
                    routerLink: ['/informations/region']
                },
                {
                    label: 'district',
                    permession: [30110001],
                    icon: 'pi pi-map-marker',
                    routerLink: ['/informations/district']
                }
            ]
        }
    ];
}
