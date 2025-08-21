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
                <!--                <svg width="100" viewBox="0 0 64 21" fill="none" xmlns="http://www.w3.org/2000/svg">-->
                <!--                    <path d="M3.528 0.399995H7.7L10.892 20H7.812L7.252 16.108V16.164H3.752L3.192 20H0.335999L3.528 0.399995ZM6.888 13.504L5.516 3.816H5.46L4.116 13.504H6.888Z" fill="var(&#45;&#45;topbar-item-text-color)" />-->
                <!--                    <path d="M10.7813 0.399995H13.8893L15.9053 15.604H15.9613L17.9773 0.399995H20.8053L17.8373 20H13.7493L10.7813 0.399995Z" fill="var(&#45;&#45;topbar-item-text-color)" />-->
                <!--                    <path d="M23.8717 0.399995H28.0437L31.2358 20H28.1557L27.5957 16.108V16.164H24.0957L23.5357 20H20.6797L23.8717 0.399995ZM27.2317 13.504L25.8597 3.816H25.8037L24.4597 13.504H27.2317Z" fill="var(&#45;&#45;topbar-item-text-color)" />-->
                <!--                    <path d="M32.73 0.399995H35.81V17.2H40.878V20H32.73V0.399995Z" fill="var(&#45;&#45;topbar-item-text-color)" />-->
                <!--                    <path-->
                <!--                        d="M46.6977 20.28C45.1857 20.28 44.0283 19.8507 43.2257 18.992C42.423 18.1333 42.0217 16.92 42.0217 15.352V5.048C42.0217 3.48 42.423 2.26666 43.2257 1.408C44.0283 0.549329 45.1857 0.119995 46.6977 0.119995C48.2097 0.119995 49.367 0.549329 50.1697 1.408C50.9723 2.26666 51.3737 3.48 51.3737 5.048V15.352C51.3737 16.92 50.9723 18.1333 50.1697 18.992C49.367 19.8507 48.2097 20.28 46.6977 20.28ZM46.6977 17.48C47.7617 17.48 48.2937 16.836 48.2937 15.548V4.852C48.2937 3.564 47.7617 2.92 46.6977 2.92C45.6337 2.92 45.1017 3.564 45.1017 4.852V15.548C45.1017 16.836 45.6337 17.48 46.6977 17.48Z"-->
                <!--                        fill="var(&#45;&#45;topbar-item-text-color)"-->
                <!--                    />-->
                <!--                    <path d="M53.4566 0.399995H57.3206L60.3166 12.132H60.3726V0.399995H63.1166V20H59.9526L56.2566 5.692H56.2006V20H53.4566V0.399995Z" fill="var(&#45;&#45;topbar-item-text-color)" />-->
                <!--                </svg>-->
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
                    <li class="layout-topbar-search">
                        <input type="text" placeholder="Search" />
                        <i class="pi-fw pi pi-search"></i>
                    </li>
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
                            <ul class="list-none p-0 m-0">
                                <li>
                                    <a
                                        class="py-2 px-3 flex gap-2 cursor-pointer text-color hover:text-primary"
                                    >
                                        <i
                                            class="pi pi-fw pi-sliders-h text-lg"
                                        ></i>
                                        <span>Pending tasks</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        class="py-2 px-3 flex gap-2 cursor-pointer text-color hover:text-primary "
                                    >
                                        <i
                                            class="pi pi-fw pi-calendar text-lg"
                                        ></i>
                                        <span>Meeting today at 3pm</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        class="py-2 px-3 flex gap-2 cursor-pointer text-color hover:text-primary"
                                    >
                                        <i
                                            class="pi pi-fw pi-download text-lg"
                                        ></i>
                                        <span>Download documents</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        class="py-2 px-3 flex gap-2 cursor-pointer text-color hover:text-primary"
                                    >
                                        <i
                                            class="pi pi-fw pi-bookmark text-lg"
                                        ></i>
                                        <span>Book flight</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <a
                            pStyleClass="@next"
                            enterFromClass="hidden"
                            enterActiveClass="animate-scalein"
                            leaveToClass="hidden"
                            leaveActiveClass="animate-fadeout"
                            [hideOnOutsideClick]="true"
                        >
                            <i class="pi pi-envelope"></i>
                        </a>
                        <div class="hidden">
                            <ul
                                class="list-none p-0 m-0 flex flex-col text-color"
                            >
                                <li>
                                    <a
                                        class="cursor-pointer flex items-center px-4 py-2 gap-4 hover:text-primary"
                                    >
                                        <img
                                            src="/layout/images/avatar/avatar5.png"
                                            class="w-12 h-12"
                                        />
                                        <span>Give me a call</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        class="cursor-pointer flex items-center px-4 py-2 gap-4 hover:text-primary"
                                    >
                                        <img
                                            src="/layout/images/avatar/avatar1.png"
                                            class="w-12 h-12"
                                        />
                                        <span>Sales reports attached</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        class="cursor-pointer flex items-center px-4 py-2 gap-4 hover:text-primary"
                                    >
                                        <img
                                            src="/layout/images/avatar/avatar2.png"
                                            class="w-12 h-12"
                                        />
                                        <span>About your invoice</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        class="cursor-pointer flex items-center px-4 py-2 gap-4 hover:text-primary"
                                    >
                                        <img
                                            src="/layout/images/avatar/avatar3.png"
                                            class="w-12 h-12"
                                        />
                                        <span>Meeting today at 10pm</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        class="cursor-pointer flex items-center px-4 py-2 gap-4 hover:text-primary"
                                    >
                                        <img
                                            src="/layout/images/avatar/avatar4.png"
                                            class="w-12 h-12"
                                        />
                                        <span>Out of office</span>
                                    </a>
                                </li>
                            </ul>
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
