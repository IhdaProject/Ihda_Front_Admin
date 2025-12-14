import { Injectable, effect, signal, computed } from '@angular/core';
import { Subject } from 'rxjs';

export type MenuMode =
    | 'static'
    | 'overlay'
    | 'horizontal'
    | 'slim'
    | 'slim-plus'
    | 'reveal'
    | 'drawer';

export type ColorScheme = 'light' | 'dark';

export interface layoutConfig {
    inputStyle: string;
    preset?: string;
    primary?: string;
    surface?: string | undefined | null;
    ripple: boolean;
    darkTheme?: boolean;
    menuMode?: string;
    menuTheme?: string;
    colorScheme?: ColorScheme;
    topbarTheme?: string;
    menuProfilePosition: string;
}

interface LayoutState {
    staticMenuDesktopInactive?: boolean;
    overlayMenuActive?: boolean;
    configSidebarVisible: boolean;
    staticMenuMobileActive?: boolean;
    menuHoverActive?: boolean;
    sidebarActive: boolean;
    anchored: boolean;
    overlaySubmenuActive: boolean;
    activeMenuItem: any;
    rightMenuActive: boolean;
    topbarMenuActive: boolean;
    menuProfileActive: boolean;
}

interface MenuChangeEvent {
    key: string;
    routeEvent?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class LayoutService {
    _config: layoutConfig = {
        ripple: false,
        preset: 'Aura',
        primary: 'noir',
        inputStyle: 'outlined',
        surface: null,
        darkTheme: localStorage.getItem('darkMode') === 'true',
        menuMode: 'static',
        menuTheme:
            localStorage.getItem('darkMode') === 'true' ? 'dark' : 'light',
        topbarTheme:
            localStorage.getItem('darkMode') === 'true' ? 'dark' : 'light',
        menuProfilePosition: 'end'
    };

    _state: LayoutState = {
        staticMenuDesktopInactive: false,
        overlayMenuActive: false,
        sidebarActive: false,
        anchored: false,
        overlaySubmenuActive: false,
        configSidebarVisible: false,
        staticMenuMobileActive: false,
        menuHoverActive: false,
        activeMenuItem: null,
        rightMenuActive: false,
        topbarMenuActive: false,
        menuProfileActive: false
    };

    layoutConfig = signal<layoutConfig>(this._config);

    layoutState = signal<LayoutState>(this._state);

    private configUpdate = new Subject<layoutConfig>();

    private overlayOpen = new Subject<any>();

    private topbarMenuOpen = new Subject<any>();

    private menuProfileOpen = new Subject<any>();

    private menuSource = new Subject<MenuChangeEvent>();

    private resetSource = new Subject();

    menuSource$ = this.menuSource.asObservable();

    resetSource$ = this.resetSource.asObservable();

    configUpdate$ = this.configUpdate.asObservable();

    overlayOpen$ = this.overlayOpen.asObservable();

    topbarMenuOpen$ = this.topbarMenuOpen.asObservable();

    isDarkTheme = computed(() => this.layoutConfig().darkTheme);

    isSlim = computed(() => this.layoutConfig().menuMode === 'slim');

    isSlimPlus = computed(() => this.layoutConfig().menuMode === 'slim-plus');

    isHorizontal = computed(
        () => this.layoutConfig().menuMode === 'horizontal'
    );

    isOverlay = computed(() => this.layoutConfig().menuMode === 'overlay');

    transitionComplete = signal<boolean>(false);

    isSidebarStateChanged = computed(() => {
        const layoutConfig = this.layoutConfig();
        return (
            layoutConfig.menuMode === 'horizontal' ||
            layoutConfig.menuMode === 'slim' ||
            layoutConfig.menuMode === 'slim-plus'
        );
    });

    private initialized = false;

    constructor() {
        effect(() => {
            const config = this.layoutConfig();
            if (config) {
                this.onConfigUpdate();
            }
        });

        effect(() => {
            const config = this.layoutConfig();

            if (!this.initialized || !config) {
                this.initialized = true;
                return;
            }

            this.handleDarkModeTransition(config);
        });

        effect(() => {
            this.isSidebarStateChanged() && this.reset();
        });
    }

    private handleDarkModeTransition(config: layoutConfig): void {
        const supportsViewTransition = 'startViewTransition' in document;

        if (supportsViewTransition) {
            this.startViewTransition(config);
        } else {
            this.toggleDarkMode(config);
            this.onTransitionEnd();
        }
    }

    private startViewTransition(config: layoutConfig): void {
        const transition = (document as any).startViewTransition(() => {
            this.toggleDarkMode(config);
        });

        transition.ready
            .then(() => {
                this.onTransitionEnd();
            })
            .catch(() => {});
    }

    toggleDarkMode(config?: layoutConfig): void {
        const _config = config || this.layoutConfig();
        if (_config.darkTheme) {
            document.documentElement.classList.add('app-dark');
            localStorage.setItem('darkMode', 'true');
        } else {
            document.documentElement.classList.remove('app-dark');
            localStorage.setItem('darkMode', 'false');
        }
    }

    private onTransitionEnd() {
        this.transitionComplete.set(true);
        setTimeout(() => {
            this.transitionComplete.set(false);
        });
    }

    onTopbarMenuToggle() {
        this.layoutState.update((prev) => ({
            ...prev,
            topbarMenuActive: !this.layoutState().topbarMenuActive
        }));

        if (this.layoutState().topbarMenuActive) {
            this.topbarMenuOpen.next(null);
        }
    }

    onMenuToggle() {
        if (this.isOverlay()) {
            this.layoutState.update((prev) => ({
                ...prev,
                overlayMenuActive: !this.layoutState().overlayMenuActive
            }));

            if (this.layoutState().overlayMenuActive) {
                this.overlayOpen.next(null);
            }
        }

        if (this.isDesktop()) {
            this.layoutState.update((prev) => ({
                ...prev,
                staticMenuDesktopInactive: !prev.staticMenuDesktopInactive
            }));
        } else {
            this.layoutState.update((prev) => ({
                ...prev,
                staticMenuMobileActive: !prev.staticMenuMobileActive
            }));

            if (this.layoutState().staticMenuMobileActive) {
                this.overlayOpen.next(null);
            }
        }
    }

    onConfigUpdate() {
        this._config = { ...this.layoutConfig() };
        this.configUpdate.next(this.layoutConfig());
    }

    onMenuStateChange(event: MenuChangeEvent) {
        this.menuSource.next(event);
    }

    reset() {
        this.resetSource.next(true);
    }

    onOverlaySubmenuOpen() {
        this.overlayOpen.next(null);
    }

    showProfileSidebar() {
        this.layoutState.update((state) => ({
            ...state,
            profileSidebarVisible: true
        }));
    }

    showConfigSidebar() {
        this.layoutState.update((state) => ({
            ...state,
            configSidebarVisible: true
        }));
    }

    isDesktop() {
        return window.innerWidth > 991;
    }

    isMobile() {
        return !this.isDesktop();
    }

    setTopbarTheme = (value: string) => {
        this.layoutConfig.update((state) => ({
            ...state,
            topbarTheme: value
        }));
    };

    setProfilePosition = (value: string) => {
        this.layoutConfig.update((state) => ({
            ...state,
            menuProfilePosition: value
        }));
    };

    setMenuMode = (mode: string) => {
        this.layoutConfig.update((state) => ({
            ...state,
            menuMode: mode
        }));

        if (mode === 'static') {
            this.layoutState.update((state) => ({
                ...state,
                staticMenuDesktopInactive: false
            }));
        }
    };

    onMenuProfileToggle = () => {
        this.layoutState.update((state) => ({
            ...state,
            menuProfileActive: !state.menuProfileActive
        }));
    };
}
