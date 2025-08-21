import { CommonModule, isPlatformBrowser } from '@angular/common';
import { booleanAttribute, Component, computed, inject, Input, PLATFORM_ID, Signal, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { $t, updatePreset, updateSurfacePalette } from '@primeng/themes';
import Aura from '@primeng/themes/aura';
import Lara from '@primeng/themes/lara';
import Nora from '@primeng/themes/nora';
import { PrimeNG } from 'primeng/config';
import { SelectButtonModule } from 'primeng/selectbutton';
import { LayoutService } from '@/layout/service/layout.service';
import { Router } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';

const presets = {
    Aura,
    Lara,
    Nora
} as const;

declare type KeyOfType<T> = keyof T extends infer U ? U : never;

declare type SurfacesType = {
    name?: string;
    palette?: {
        0?: string;
        50?: string;
        100?: string;
        200?: string;
        300?: string;
        400?: string;
        500?: string;
        600?: string;
        700?: string;
        800?: string;
        900?: string;
        950?: string;
    };
};

@Component({
    selector: 'app-configurator',
    standalone: true,
    imports: [CommonModule, FormsModule, SelectButtonModule, DrawerModule, ToggleSwitchModule, RadioButtonModule, TooltipModule, ButtonModule],
    template: `
        <button *ngIf="simple" class="layout-config-button config-link" type="button" (click)="toggleConfigSidebar()">
            <i class="pi pi-cog"></i>
        </button>
        <p-drawer [visible]="visible()" (onHide)="onDrawerHide()" position="right" [transitionOptions]="'.3s cubic-bezier(0, 0, 0.2, 1)'" styleClass="layout-config-sidebar w-80" header="Settings">
            <div class="flex flex-col gap-4">
                <div>
                    <span class="text-lg font-semibold">Primary</span>
                    <div class="pt-2 flex gap-2 flex-wrap">
                        @for (primaryColor of primaryColors; track primaryColor.name) {
                            <button
                                type="button"
                                [title]="primaryColor.name"
                                (click)="updateColors($event, 'primary', primaryColor)"
                                [ngClass]="{
                                    'outline-primary': primaryColor.name === selectedPrimaryColor()
                                }"
                                class="cursor-pointer w-6 h-6 rounded-full flex flex-shrink-0 items-center justify-center p-0 outline-none outline-offset-1"
                                [style]="{
                                    'background-color': primaryColor?.name === 'noir' ? 'var(--text-color)' : primaryColor?.palette?.['500']
                                }"
                            ></button>
                        }
                    </div>
                </div>

                <div>
                    <span class="text-lg font-semibold">Surface</span>
                    <div class="pt-2 flex gap-2 flex-wrap">
                        @for (surface of surfaces; track surface.name) {
                            <button
                                type="button"
                                [title]="surface.name"
                                (click)="updateColors($event, 'surface', surface)"
                                class="cursor-pointer w-6 h-6 rounded-full flex flex-shrink-0 items-center justify-center p-0 outline-none outline-offset-1"
                                [ngClass]="{
                                    'outline-primary': selectedSurface() ? selectedSurface() === surface.name : darkTheme() ? surface.name === 'zinc' : surface.name === 'slate'
                                }"
                                [style]="{
                                    'background-color': surface?.palette?.['500']
                                }"
                            ></button>
                        }
                    </div>
                </div>

                <div *ngIf="!simple">
                    <div class="flex flex-col gap-4">
                        <span class="text-lg text-muted-color font-semibold">Topbar Themes</span>
                        <div class="pt-2 flex gap-2 flex-wrap">
                            @for (theme of topbarThemes; track theme.name) {
                                <button
                                    type="button"
                                    (click)="layoutService.setTopbarTheme(theme.name)"
                                    class="cursor-pointer w-6 h-6 rounded-full flex flex-shrink-0 items-center justify-center p-0 outline-none outline-offset-1 shadow"
                                    [style]="{ backgroundColor: theme.color }"
                                >
                                    <i
                                        *ngIf="theme.name === layoutService.layoutConfig().topbarTheme"
                                        [ngClass]="{
                                            pi: true,
                                            'pi-check': true,
                                            'text-white': theme.name === layoutService.layoutConfig().topbarTheme && layoutService.layoutConfig().topbarTheme !== 'light',
                                            'text-dark': theme.name !== layoutService.layoutConfig().topbarTheme || layoutService.layoutConfig().topbarTheme === 'light'
                                        }"
                                    ></i>
                                </button>
                            }
                        </div>
                    </div>
                </div>

                <div class="flex flex-col gap-2">
                    <span class="text-lg font-semibold">Presets</span>
                    <p-selectbutton [options]="presets" [ngModel]="selectedPreset()" (ngModelChange)="onPresetChange($event)" [allowEmpty]="false" />
                </div>
                <div class="flex flex-col gap-2">
                    <span class="text-lg font-semibold">Color Scheme</span>
                    <p-selectbutton [ngModel]="darkTheme()" (ngModelChange)="toggleDarkMode()" [options]="themeOptions" optionLabel="name" optionValue="value" [allowEmpty]="false" />
                </div>

                <ng-container *ngIf="!simple">
                    <div>
                        <div class="flex flex-col gap-2">
                            <span class="text-lg font-semibold">Menu Type</span>
                            <div class="flex flex-wrap flex-col gap-3">
                                <div class="flex">
                                    <div class="flex items-center gap-2 w-1/2">
                                        <p-radioButton name="menuMode" value="static" [ngModel]="menuMode()" (ngModelChange)="setMenuMode('static')" inputId="mode1"></p-radioButton>
                                        <label for="static">Static</label>
                                    </div>

                                    <div class="flex items-center gap-2 w-1/2">
                                        <p-radioButton name="menuMode" value="overlay" [ngModel]="menuMode()" (ngModelChange)="setMenuMode('overlay')" inputId="mode2"></p-radioButton>
                                        <label for="overlay">Overlay</label>
                                    </div>
                                </div>
                                <div class="flex">
                                    <div class="flex items-center gap-2 w-1/2">
                                        <p-radioButton name="menuMode" value="slim" [ngModel]="menuMode()" (ngModelChange)="setMenuMode('slim')" inputId="mode3"></p-radioButton>
                                        <label for="slim">Slim</label>
                                    </div>
                                    <div class="flex items-center gap-2 w-1/2">
                                        <p-radioButton name="menuMode" value="slim-plus" [ngModel]="menuMode()" (ngModelChange)="setMenuMode('slim-plus')" inputId="mode3"></p-radioButton>
                                        <label for="slimplus">Slim+</label>
                                    </div>
                                </div>
                                <div class="flex">
                                    <div class="flex items-center gap-2 w-1/2">
                                        <p-radioButton name="menuMode" value="reveal" [ngModel]="menuMode()" (ngModelChange)="setMenuMode('reveal')" inputId="mode6"></p-radioButton>
                                        <label for="reveal">Reveal</label>
                                    </div>
                                    <div class="flex items-center gap-2 w-1/2">
                                        <p-radioButton name="menuMode" value="drawer" [ngModel]="menuMode()" (ngModelChange)="setMenuMode('drawer')" inputId="mode7"></p-radioButton>
                                        <label for="drawer">Drawer</label>
                                    </div>
                                </div>
                                <div class="flex">
                                    <div class="flex items-center gap-2 w-1/2">
                                        <p-radioButton name="menuMode" value="horizontal" [ngModel]="menuMode()" (ngModelChange)="setMenuMode('horizontal')" inputId="mode5"></p-radioButton>
                                        <label for="horizontal">Horizontal</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ng-container>
                <div *ngIf="!simple">
                    <div class="flex flex-col gap-4">
                        <span class="text-lg text-muted-color font-semibold">Menu Profile Position</span>
                        <div class="flex">
                            <div class="flex items-center gap-2 w-1/2">
                                <p-radiobutton name="menuProfilePosition" value="start" [ngModel]="layoutConfig.menuProfilePosition" (ngModelChange)="layoutService.setProfilePosition($event)" inputId="profile1"></p-radiobutton>
                                <label for="profile1">Start</label>
                            </div>

                            <div class="flex items-center gap-2 w-1/2">
                                <p-radiobutton name="menuProfilePosition" value="end" [ngModel]="layoutConfig.menuProfilePosition" (ngModelChange)="layoutService.setProfilePosition($event)" inputId="profile2"></p-radiobutton>
                                <label for="profile2">End</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div *ngIf="!simple">
                    <div class="flex flex-col gap-4">
                        <span class="text-lg text-muted-color font-semibold">Menu Theme</span>
                        @if (!layoutService.isDarkTheme()) {
                            <p-selectbutton [ngModel]="layoutConfig.menuTheme" (ngModelChange)="setMenuTheme($event)" [options]="menuThemeOptions" optionLabel="name" optionValue="value" [allowEmpty]="false" optionDisabled="disabled" />
                        } @else {
                            <p>Menu themes are only available in light mode by design as large surfaces can emit too much brightness in dark mode.</p>
                        }
                    </div>
                </div>

                <div *ngIf="!simple">
                    <div class="flex flex-col gap-4">
                        <span class="text-lg text-muted-color font-semibold">Scenes</span>
                        <div class="flex flex-wrap p-2 bg-surface-100 dark:bg-surface-700 gap-2 rounded-lg">
                            <button pButton (click)="changeScene(item)" class="!bg-transparent !border-0 !p-0" *ngFor="let item of scenes" style="flex: 0 0 48%;" [pTooltip]="item.sceneName" tooltipPosition="top">
                                <div *ngIf="selectedScene() === item.sceneName" class="absolute w-full h-full flex justify-center items-center" style="background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(3.56688px)">
                                    <svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="0.520691" y="0.770691" width="24.4586" height="24.4586" rx="12.2293" [attr.fill]="item.componentThemeColor" />
                                        <g clip-path="url(#clip0_1_16289)">
                                            <path
                                                d="M11.1158 16.5119C11.0587 16.51 11.0025 16.4964 10.9507 16.472C10.899 16.4476 10.8528 16.4129 10.8149 16.37L7.97597 13.531C7.92185 13.4959 7.8764 13.449 7.84306 13.3938C7.80973 13.3385 7.78938 13.2765 7.78354 13.2122C7.77771 13.148 7.78655 13.0832 7.8094 13.0229C7.83224 12.9626 7.8685 12.9082 7.91542 12.864C7.96234 12.8197 8.01871 12.7867 8.08027 12.7674C8.14183 12.7481 8.20696 12.743 8.27076 12.7526C8.33456 12.7621 8.39535 12.7861 8.44854 12.8226C8.50174 12.8591 8.54595 12.9072 8.57783 12.9632L11.1158 15.4842L17.0606 9.55651C17.1406 9.50462 17.2358 9.4811 17.3308 9.48972C17.4258 9.49834 17.5151 9.53861 17.5845 9.60406C17.6539 9.66952 17.6993 9.75637 17.7134 9.8507C17.7275 9.94503 17.7096 10.0414 17.6625 10.1243L11.4168 16.37C11.3789 16.4129 11.3327 16.4476 11.281 16.472C11.2292 16.4964 11.173 16.51 11.1158 16.5119Z"
                                                fill="white"
                                            />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_1_16289">
                                                <rect width="10.7006" height="10.7006" fill="white" transform="translate(7.39966 7.64966)" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </div>
                                <svg width="110" height="44.5" viewBox="0 0 110 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_1_23714)">
                                        <rect x="0.5" width="109.5" height="56" rx="6" [attr.fill]="item.colorSchemeColor" />
                                        <rect width="109.5" height="10.5" transform="translate(0.5)" [attr.fill]="item.topbarThemeColor" />
                                        <rect width="42" height="45.5" transform="translate(0.5 10.5)" [attr.fill]="item.menuThemeColor" />
                                        <rect x="11" y="24.5" width="21" height="3.5" rx="1.75" [attr.fill]="item.componentThemeColor" />
                                        <rect x="11" y="31.5" width="21" height="3.5" rx="1.75" [attr.fill]="item.componentThemeColor" />
                                        <rect x="11" y="38.5" width="21" height="3.5" rx="1.75" [attr.fill]="item.componentThemeColor" />
                                        <rect x="53" y="21" width="46.5" height="24.5" rx="3" [attr.fill]="item.cardColor" />
                                        <rect x="60" y="28" width="32.5" height="10.5" rx="3" [attr.fill]="item.componentThemeColor" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_1_23714">
                                            <rect x="0.5" width="109.5" height="56" rx="6" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </p-drawer>
    `
})
export class AppConfigurator {
    @Input({ transform: booleanAttribute }) simple: boolean = false;

    router = inject(Router);

    config: PrimeNG = inject(PrimeNG);

    layoutService: LayoutService = inject(LayoutService);

    platformId = inject(PLATFORM_ID);

    primeng = inject(PrimeNG);

    presets = Object.keys(presets);

    scales: number[] = [12, 13, 14, 15, 16];

    showMenuModeButton = signal(!this.router.url.includes('auth'));

    selectedScene = signal<string>('');

    themeOptions = [
        { name: 'Light', value: false },
        { name: 'Dark', value: true }
    ];

    menuThemeOptions = [
        {
            name: 'Light',
            value: 'light',
            disabled: this.layoutService.isDarkTheme()
        },
        { name: 'Dark', value: 'dark', disabled: false }
    ];

    menuModeOptions = [
        { label: 'Static', value: 'static' },
        { label: 'Overlay', value: 'overlay' }
    ];

    get layoutConfig() {
        return this.layoutService.layoutConfig();
    }
    get layoutState() {
        return this.layoutService.layoutState();
    }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.onPresetChange(this.layoutService.layoutConfig().preset);
        }
    }

    primaryColors = [
        { name: 'noir', palette: {} },
        {
            name: 'asu',
            palette: {
                50: "#C2FFFB",
                100: "#1DFFF7",
                200: "#00E6DF",
                300: "#00CBC4",
                400: "#00B3AD",
                500: "#009994",
                600: "#00827E",
                700: "#006A66",
                800: "#005552",
                900: "#003E3C",
                950: "#003432"
            }
        },
        {
            name: 'emerald',
            palette: {
                50: '#ecfdf5',
                100: '#d1fae5',
                200: '#a7f3d0',
                300: '#6ee7b7',
                400: '#34d399',
                500: '#10b981',
                600: '#059669',
                700: '#047857',
                800: '#065f46',
                900: '#064e3b',
                950: '#022c22'
            }
        },
        {
            name: 'green',
            palette: {
                50: '#f0fdf4',
                100: '#dcfce7',
                200: '#bbf7d0',
                300: '#86efac',
                400: '#4ade80',
                500: '#22c55e',
                600: '#16a34a',
                700: '#15803d',
                800: '#166534',
                900: '#14532d',
                950: '#052e16'
            }
        },
        {
            name: 'lime',
            palette: {
                50: '#f7fee7',
                100: '#ecfccb',
                200: '#d9f99d',
                300: '#bef264',
                400: '#a3e635',
                500: '#84cc16',
                600: '#65a30d',
                700: '#4d7c0f',
                800: '#3f6212',
                900: '#365314',
                950: '#1a2e05'
            }
        },
        {
            name: 'orange',
            palette: {
                50: '#fff7ed',
                100: '#ffedd5',
                200: '#fed7aa',
                300: '#fdba74',
                400: '#fb923c',
                500: '#f97316',
                600: '#ea580c',
                700: '#c2410c',
                800: '#9a3412',
                900: '#7c2d12',
                950: '#431407'
            }
        },
        {
            name: 'amber',
            palette: {
                50: '#fffbeb',
                100: '#fef3c7',
                200: '#fde68a',
                300: '#fcd34d',
                400: '#fbbf24',
                500: '#f59e0b',
                600: '#d97706',
                700: '#b45309',
                800: '#92400e',
                900: '#78350f',
                950: '#451a03'
            }
        },
        {
            name: 'yellow',
            palette: {
                50: '#fefce8',
                100: '#fef9c3',
                200: '#fef08a',
                300: '#fde047',
                400: '#facc15',
                500: '#eab308',
                600: '#ca8a04',
                700: '#a16207',
                800: '#854d0e',
                900: '#713f12',
                950: '#422006'
            }
        },
        {
            name: 'teal',
            palette: {
                50: '#f0fdfa',
                100: '#ccfbf1',
                200: '#99f6e4',
                300: '#5eead4',
                400: '#2dd4bf',
                500: '#14b8a6',
                600: '#0d9488',
                700: '#0f766e',
                800: '#115e59',
                900: '#134e4a',
                950: '#042f2e'
            }
        },
        {
            name: 'cyan',
            palette: {
                50: '#ecfeff',
                100: '#cffafe',
                200: '#a5f3fc',
                300: '#67e8f9',
                400: '#22d3ee',
                500: '#06b6d4',
                600: '#0891b2',
                700: '#0e7490',
                800: '#155e75',
                900: '#164e63',
                950: '#083344'
            }
        },
        {
            name: 'sky',
            palette: {
                50: '#f0f9ff',
                100: '#e0f2fe',
                200: '#bae6fd',
                300: '#7dd3fc',
                400: '#38bdf8',
                500: '#0ea5e9',
                600: '#0284c7',
                700: '#0369a1',
                800: '#075985',
                900: '#0c4a6e',
                950: '#082f49'
            }
        },
        {
            name: 'blue',
            palette: {
                50: '#eff6ff',
                100: '#dbeafe',
                200: '#bfdbfe',
                300: '#93c5fd',
                400: '#60a5fa',
                500: '#3b82f6',
                600: '#2563eb',
                700: '#1d4ed8',
                800: '#1e40af',
                900: '#1e3a8a',
                950: '#172554'
            }
        },
        {
            name: 'indigo',
            palette: {
                50: '#eef2ff',
                100: '#e0e7ff',
                200: '#c7d2fe',
                300: '#a5b4fc',
                400: '#818cf8',
                500: '#6366f1',
                600: '#4f46e5',
                700: '#4338ca',
                800: '#3730a3',
                900: '#312e81',
                950: '#1e1b4b'
            }
        },
        {
            name: 'violet',
            palette: {
                50: '#f5f3ff',
                100: '#ede9fe',
                200: '#ddd6fe',
                300: '#c4b5fd',
                400: '#a78bfa',
                500: '#8b5cf6',
                600: '#7c3aed',
                700: '#6d28d9',
                800: '#5b21b6',
                900: '#4c1d95',
                950: '#2e1065'
            }
        },
        {
            name: 'purple',
            palette: {
                50: '#faf5ff',
                100: '#f3e8ff',
                200: '#e9d5ff',
                300: '#d8b4fe',
                400: '#c084fc',
                500: '#a855f7',
                600: '#9333ea',
                700: '#7e22ce',
                800: '#6b21a8',
                900: '#581c87',
                950: '#3b0764'
            }
        },
        {
            name: 'fuchsia',
            palette: {
                50: '#fdf4ff',
                100: '#fae8ff',
                200: '#f5d0fe',
                300: '#f0abfc',
                400: '#e879f9',
                500: '#d946ef',
                600: '#c026d3',
                700: '#a21caf',
                800: '#86198f',
                900: '#701a75',
                950: '#4a044e'
            }
        },
        {
            name: 'pink',
            palette: {
                50: '#fdf2f8',
                100: '#fce7f3',
                200: '#fbcfe8',
                300: '#f9a8d4',
                400: '#f472b6',
                500: '#ec4899',
                600: '#db2777',
                700: '#be185d',
                800: '#9d174d',
                900: '#831843',
                950: '#500724'
            }
        },
        {
            name: 'rose',
            palette: {
                50: '#fff1f2',
                100: '#ffe4e6',
                200: '#fecdd3',
                300: '#fda4af',
                400: '#fb7185',
                500: '#f43f5e',
                600: '#e11d48',
                700: '#be123c',
                800: '#9f1239',
                900: '#881337',
                950: '#4c0519'
            }
        }
    ];

    scenes = [
        {
            sceneName: 'Green Light',
            isDarkTheme: false,
            colorSchemeColor: '#EFEFEF',
            menuTheme: 'light',
            menuThemeColor: '#ffffff',
            componentTheme: 'green',
            componentThemeColor: '#198754',
            topbarTheme: 'green',
            topbarThemeColor: '#43A047',
            menuMode: 'static',
            cardColor: '#ffffff'
        },
        {
            sceneName: 'Dark Sea',
            isDarkTheme: true,
            colorSchemeColor: '#20262e',
            menuTheme: 'dark',
            menuThemeColor: '#2a323d',
            componentTheme: 'cyan',
            componentThemeColor: '#0dcaf0',
            topbarTheme: 'cyan',
            topbarThemeColor: '#0097A7',
            menuMode: 'static',
            cardColor: '#2a323d'
        },
        {
            sceneName: 'Blue Marble',
            isDarkTheme: false,
            colorSchemeColor: '#EFEFEF',
            menuTheme: 'light',
            menuThemeColor: '#ffffff',
            componentTheme: 'blue',
            componentThemeColor: '#0d6efd',
            topbarTheme: 'blue',
            topbarThemeColor: '#1565C0',
            menuMode: 'static',
            cardColor: '#ffffff'
        },
        {
            sceneName: 'Emerald',
            isDarkTheme: true,
            colorSchemeColor: '#20262e',
            menuTheme: 'dark',
            menuThemeColor: '#2a323d',
            componentTheme: 'teal',
            componentThemeColor: '#20c997',
            topbarTheme: 'teal',
            topbarThemeColor: '#00796B',
            menuMode: 'static',
            cardColor: '#2a323d'
        },
        {
            sceneName: 'Piano Black',
            isDarkTheme: false,
            colorSchemeColor: '#EFEFEF',
            menuTheme: 'light',
            menuThemeColor: '#ffffff',
            componentTheme: 'black',
            componentThemeColor: '#000000',
            topbarTheme: 'light',
            topbarThemeColor: '#FFFFFF',
            menuMode: 'static',
            cardColor: '#ffffff'
        },
        {
            sceneName: 'Bolt',
            isDarkTheme: true,
            colorSchemeColor: '#20262e',
            menuTheme: 'dark',
            menuThemeColor: '#2a323d',
            componentTheme: 'yellow',
            componentThemeColor: '#ffc107',
            topbarTheme: 'yellow',
            topbarThemeColor: '#FBC02D',
            menuMode: 'static',
            cardColor: '#2a323d'
        },
        {
            sceneName: 'Amber',
            isDarkTheme: false,
            colorSchemeColor: '#EFEFEF',
            menuTheme: 'dark',
            menuThemeColor: '#212529',
            componentTheme: 'yellow',
            componentThemeColor: '#ffc107',
            topbarTheme: 'yellow',
            topbarThemeColor: '#FBC02D',
            menuMode: 'horizontal',
            cardColor: '#ffffff'
        },
        {
            sceneName: 'Kingdom',
            isDarkTheme: true,
            colorSchemeColor: '#20262e',
            menuTheme: 'dark',
            menuThemeColor: '#2a323d',
            componentTheme: 'indigo',
            componentThemeColor: '#6610f2',
            topbarTheme: 'purple',
            topbarThemeColor: '#6A1B9A',
            menuMode: 'reveal',
            cardColor: '#2a323d'
        }
    ];

    topbarThemes = [
        { name: 'light', color: '#FFFFFF' },
        { name: 'dark', color: '#212529' },
        { name: 'blue', color: '#1565C0' },
        { name: 'purple', color: '#6A1B9A' },
        { name: 'pink', color: '#AD1457' },
        { name: 'cyan', color: '#0097A7' },
        { name: 'teal', color: '#00796B' },
        { name: 'green', color: '#43A047' },
        { name: 'yellow', color: '#FBC02D' },
        { name: 'orange', color: '#FB8C00' },
        { name: 'indigo', color: '#3F51B5' }
    ];

    surfaces: SurfacesType[] = [
        {
            name: 'slate',
            palette: {
                0: '#ffffff',
                50: '#f8fafc',
                100: '#f1f5f9',
                200: '#e2e8f0',
                300: '#cbd5e1',
                400: '#94a3b8',
                500: '#64748b',
                600: '#475569',
                700: '#334155',
                800: '#1e293b',
                900: '#0f172a',
                950: '#020617'
            }
        },
        {
            name: 'gray',
            palette: {
                0: '#ffffff',
                50: '#f9fafb',
                100: '#f3f4f6',
                200: '#e5e7eb',
                300: '#d1d5db',
                400: '#9ca3af',
                500: '#6b7280',
                600: '#4b5563',
                700: '#374151',
                800: '#1f2937',
                900: '#111827',
                950: '#030712'
            }
        },
        {
            name: 'zinc',
            palette: {
                0: '#ffffff',
                50: '#fafafa',
                100: '#f4f4f5',
                200: '#e4e4e7',
                300: '#d4d4d8',
                400: '#a1a1aa',
                500: '#71717a',
                600: '#52525b',
                700: '#3f3f46',
                800: '#27272a',
                900: '#18181b',
                950: '#09090b'
            }
        },
        {
            name: 'neutral',
            palette: {
                0: '#ffffff',
                50: '#fafafa',
                100: '#f5f5f5',
                200: '#e5e5e5',
                300: '#d4d4d4',
                400: '#a3a3a3',
                500: '#737373',
                600: '#525252',
                700: '#404040',
                800: '#262626',
                900: '#171717',
                950: '#0a0a0a'
            }
        },
        {
            name: 'stone',
            palette: {
                0: '#ffffff',
                50: '#fafaf9',
                100: '#f5f5f4',
                200: '#e7e5e4',
                300: '#d6d3d1',
                400: '#a8a29e',
                500: '#78716c',
                600: '#57534e',
                700: '#44403c',
                800: '#292524',
                900: '#1c1917',
                950: '#0c0a09'
            }
        },
        {
            name: 'soho',
            palette: {
                0: '#ffffff',
                50: '#ececec',
                100: '#dedfdf',
                200: '#c4c4c6',
                300: '#adaeb0',
                400: '#97979b',
                500: '#7f8084',
                600: '#6a6b70',
                700: '#55565b',
                800: '#3f4046',
                900: '#2c2c34',
                950: '#16161d'
            }
        },
        {
            name: 'viva',
            palette: {
                0: '#ffffff',
                50: '#f3f3f3',
                100: '#e7e7e8',
                200: '#cfd0d0',
                300: '#b7b8b9',
                400: '#9fa1a1',
                500: '#87898a',
                600: '#6e7173',
                700: '#565a5b',
                800: '#3e4244',
                900: '#262b2c',
                950: '#0e1315'
            }
        },
        {
            name: 'ocean',
            palette: {
                0: '#ffffff',
                50: '#fbfcfc',
                100: '#F7F9F8',
                200: '#EFF3F2',
                300: '#DADEDD',
                400: '#B1B7B6',
                500: '#828787',
                600: '#5F7274',
                700: '#415B61',
                800: '#29444E',
                900: '#183240',
                950: '#0c1920'
            }
        }
    ];

    selectedPrimaryColor = computed(() => {
        return this.layoutService.layoutConfig().primary;
    });

    selectedSurfaceColor = computed(() => this.layoutService.layoutConfig().surface);

    selectedPreset = computed(() => this.layoutService.layoutConfig().preset);

    menuMode = computed(() => this.layoutService.layoutConfig().menuMode);

    visible = computed(() => this.layoutService.layoutState().configSidebarVisible);

    ripple = computed(() => this.layoutService.layoutConfig().ripple);

    inputStyle = computed(() => this.layoutService.layoutConfig().inputStyle);

    colorScheme = computed(() => this.layoutService.layoutConfig().colorScheme);

    menuTheme = computed(() => this.layoutService.layoutConfig().menuTheme);

    darkTheme = computed(() => this.layoutService.layoutConfig().darkTheme);

    selectedSurface = computed(() => this.layoutService.layoutConfig().surface);

    getPresetExt() {
        const color: SurfacesType = this.primaryColors.find((c) => c.name === this.selectedPrimaryColor()) || {};

        if (color.name === 'noir') {
            return {
                semantic: {
                    primary: {
                        50: '{surface.50}',
                        100: '{surface.100}',
                        200: '{surface.200}',
                        300: '{surface.300}',
                        400: '{surface.400}',
                        500: '{surface.500}',
                        600: '{surface.600}',
                        700: '{surface.700}',
                        800: '{surface.800}',
                        900: '{surface.900}',
                        950: '{surface.950}'
                    },
                    colorScheme: {
                        light: {
                            primary: {
                                color: '{primary.950}',
                                contrastColor: '#ffffff',
                                hoverColor: '{primary.800}',
                                activeColor: '{primary.700}'
                            },
                            highlight: {
                                background: '{primary.950}',
                                focusBackground: '{primary.700}',
                                color: '#ffffff',
                                focusColor: '#ffffff'
                            }
                        },
                        dark: {
                            primary: {
                                color: '{primary.50}',
                                contrastColor: '{primary.950}',
                                hoverColor: '{primary.200}',
                                activeColor: '{primary.300}'
                            },
                            highlight: {
                                background: '{primary.50}',
                                focusBackground: '{primary.300}',
                                color: '{primary.950}',
                                focusColor: '{primary.950}'
                            }
                        }
                    }
                }
            };
        } else {
            return {
                semantic: {
                    primary: color.palette,
                    colorScheme: {
                        light: {
                            primary: {
                                color: '{primary.500}',
                                contrastColor: '#ffffff',
                                hoverColor: '{primary.600}',
                                activeColor: '{primary.700}'
                            },
                            highlight: {
                                background: '{primary.50}',
                                focusBackground: '{primary.100}',
                                color: '{primary.700}',
                                focusColor: '{primary.800}'
                            }
                        },
                        dark: {
                            primary: {
                                color: '{primary.400}',
                                contrastColor: '{surface.900}',
                                hoverColor: '{primary.300}',
                                activeColor: '{primary.200}'
                            },
                            highlight: {
                                background: 'color-mix(in srgb, {primary.400}, transparent 84%)',
                                focusBackground: 'color-mix(in srgb, {primary.400}, transparent 76%)',
                                color: 'rgba(255,255,255,.87)',
                                focusColor: 'rgba(255,255,255,.87)'
                            }
                        }
                    }
                }
            };
        }
    }

    updateColors(event: any, type: string, color: any) {
        if (type === 'primary') {
            this.layoutService.layoutConfig.update((state) => ({
                ...state,
                primary: color.name
            }));
        } else if (type === 'surface') {
            this.layoutService.layoutConfig.update((state) => ({
                ...state,
                surface: color.name
            }));
        }
        this.applyTheme(type, color);

        event.stopPropagation();
    }

    applyTheme(type: string, color: any) {
        if (type === 'primary') {
            updatePreset(this.getPresetExt());
        } else if (type === 'surface') {
            updateSurfacePalette(color.palette);
        }
    }

    onPresetChange(event: any) {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            preset: event
        }));
        const preset = presets[event as KeyOfType<typeof presets>];
        const surfacePalette = this.surfaces.find((s) => s.name === this.selectedSurfaceColor())?.palette;
        $t().preset(preset).preset(this.getPresetExt()).surfacePalette(surfacePalette).use({ useDefaultOptions: true });
    }

    onDrawerHide() {
        this.layoutService.layoutState.update((state) => ({
            ...state,
            configSidebarVisible: false
        }));
    }

    onMenuModeChange(event: string) {
        this.layoutService.layoutConfig.update((prev) => ({
            ...prev,
            menuMode: event
        }));
    }

    onConfigButtonClick() {
        this.layoutService.showConfigSidebar();
    }

    toggleDarkMode() {
        const supportsViewTransition = 'startViewTransition' in document;

        if (!supportsViewTransition) {
            this.executeDarkModeToggle();
            return;
        }

        (document as any).startViewTransition(() => this.executeDarkModeToggle());
    }

    executeDarkModeToggle() {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            darkTheme: !state.darkTheme,
            menuTheme: !state.darkTheme ? 'dark' : 'light',
            topbarTheme: !state.darkTheme ? 'dark' : 'light',
        }));
    }

    setMenuMode(mode: string) {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            menuMode: mode
        }));

        if (this.layoutService.layoutConfig().menuMode === 'static') {
            this.layoutService.layoutState.update((state) => ({
                ...state,
                staticMenuDesktopInactive: false
            }));
        }
    }

    setMenuTheme(theme: string) {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            menuTheme: theme
        }));
    }

    changeScene(item: any) {
        if (this.layoutService.isDarkTheme() !== item.isDarkTheme) this.toggleDarkMode();
        this.layoutService.setTopbarTheme(item.topbarTheme);
        this.layoutService.setMenuMode(item.menuMode);

        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            menuTheme: item.menuTheme
        }));
        this.selectedScene.set(item.sceneName);
    }

    toggleConfigSidebar() {
        this.layoutService.layoutState.update((val) => ({ ...val, configSidebarVisible: !val.configSidebarVisible }));
    }
}
