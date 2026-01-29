import {
    Component,
    computed,
    ElementRef,
    inject,
    ViewChild
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '@/layout/service/layout.service';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { RippleModule } from 'primeng/ripple';

@Component({
    selector: '[app-topbar]',
    standalone: true,
    imports: [
        RouterModule,
        CommonModule,
        StyleClassModule,
        InputTextModule,
        ButtonModule,
        IconFieldModule,
        InputIconModule,
        RippleModule
    ],
    template: `<div
        class="layout-topbar"
        [ngClass]="{
            'border-bottom-none':
                layoutService.layoutConfig().topbarTheme !== 'light'
        }"
    >
        <div class="layout-topbar-start">
            <a class="layout-topbar-logo" routerLink="/">
                <img
                    [src]="
                        '/layout/images/logo/logo-' +
                        (layoutService.isDarkTheme() ? 'white' : 'main') +
                        '.svg'
                    "
                    alt="avalon-footer-logo"
                />
            </a>
            <a
                #menuButton
                class="layout-menu-button"
                (click)="onMenuButtonClick()"
                pRipple
            >
                <i class="pi pi-bars"></i>
            </a>
        </div>

        <div class="layout-topbar-end">
            <div class="layout-topbar-actions-end">
                <ul class="layout-topbar-items">
                    <li>
                        <a
                            pStyleClass="@next"
                            enterFromClass="hidden"
                            enterActiveClass="animate-scalein"
                            leaveToClass="hidden"
                            leaveActiveClass="animate-fadeout"
                            [hideOnOutsideClick]="true"
                        >
                            <i class="pi pi-bell"></i>
                        </a>
                        <div class="hidden">
                            <div class="p-2">Notificationslar</div>
                        </div>
                    </li>
                    <li>
                        <button
                            class="app-config-button"
                            (click)="toggleDarkMode()"
                        >
                            <i
                                class="pi {{
                                    darkTheme() ? 'pi-sun' : 'pi-moon'
                                }}"
                            ></i>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </div>`
})
export class AppTopbar {
    @ViewChild('menuButton') menuButton!: ElementRef;

    @ViewChild('mobileMenuButton') mobileMenuButton!: ElementRef;

    constructor(public el: ElementRef) {}

    activeItem!: number;

    layoutService: LayoutService = inject(LayoutService);

    darkTheme = computed(() => this.layoutService.layoutConfig().darkTheme);

    get mobileTopbarActive(): boolean {
        return this.layoutService.layoutState().topbarMenuActive;
    }

    onMenuButtonClick() {
        this.layoutService.onMenuToggle();
    }

    onMobileTopbarMenuButtonClick() {
        this.layoutService.onTopbarMenuToggle();
    }

    onConfigSidebarToggle() {
        this.layoutService.showConfigSidebar();
    }

    toggleDarkMode() {
        const supportsViewTransition = 'startViewTransition' in document;

        if (!supportsViewTransition) {
            this.executeDarkModeToggle();
            return;
        }

        (document as any).startViewTransition(() =>
            this.executeDarkModeToggle()
        );
    }

    executeDarkModeToggle() {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            darkTheme: !state.darkTheme,
            menuTheme: !state.darkTheme ? 'dark' : 'light',
            topbarTheme: !state.darkTheme ? 'dark' : 'light'
        }));
    }
}
