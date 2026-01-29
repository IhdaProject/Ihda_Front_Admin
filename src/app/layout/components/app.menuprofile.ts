import {
    Component,
    computed,
    effect,
    ElementRef,
    inject,
    OnDestroy,
    Renderer2
} from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { LayoutService } from '@/layout/service/layout.service';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { map, Subscription, takeUntil } from 'rxjs';
import { AuthService } from 'src/core/services/auth.service';
import { AccountService } from 'src/shared/services/account.service';
import { Account } from 'src/shared/types/account';
import { Confirmable } from 'src/shared/decorators/confirmable.decorator';

@Component({
    selector: '[app-menu-profile]',
    standalone: true,
    imports: [CommonModule, TooltipModule, ButtonModule, RouterModule],
    template: `<button
            (click)="toggleMenu()"
            pTooltip="Profile"
            [tooltipDisabled]="isTooltipDisabled()"
        >
            @if (account?.avatar) {
                <img
                    [src]="account?.avatar"
                    alt="avatar"
                    style="width: 32px; height: 32px;"
                />
            } @else {
                <i class="pi pi-user text-start"></i>
            }
            <span class="text-start">
                <strong>{{ account?.fullName }}</strong>
                <small>{{ account?.StructuresNames?.join(', ') }}</small>
            </span>
            <i
                class="layout-menu-profile-toggler pi pi-fw"
                [ngClass]="{
                    'pi-angle-down':
                        menuProfilePosition() === 'start' || isHorizontal(),
                    'pi-angle-up':
                        menuProfilePosition() === 'end' && !isHorizontal()
                }"
            ></i>
        </button>

        <ul
            *ngIf="menuProfileActive()"
            [@menu]="isHorizontal() ? 'overlay' : 'inline'"
        >
            <li pTooltip="Profile">
                <button [routerLink]="['/profile']">
                    <i class="pi pi-user pi-fw"></i>
                    <span>Profile</span>
                </button>
            </li>
            <li pTooltip="Logout">
                <button class="p-link gap-2" (click)="logout()">
                    <span class="text-red-400">
                        <i class="pi pi-sign-out pi-fw"></i>
                    </span>
                    <span class="text-red-400">Logout</span>
                </button>
            </li>
        </ul>`,
    animations: [
        trigger('menu', [
            transition('void => inline', [
                style({ height: 0 }),
                animate(
                    '400ms cubic-bezier(0.86, 0, 0.07, 1)',
                    style({ opacity: 1, height: '*' })
                )
            ]),
            transition('inline => void', [
                animate(
                    '400ms cubic-bezier(0.86, 0, 0.07, 1)',
                    style({ opacity: 0, height: '0' })
                )
            ]),
            transition('void => overlay', [
                style({ opacity: 0, transform: 'scaleY(0.8)' }),
                animate('.12s cubic-bezier(0, 0, 0.2, 1)')
            ]),
            transition('overlay => void', [
                animate('.1s linear', style({ opacity: 0 }))
            ])
        ])
    ],
    host: {
        class: 'layout-menu-profile'
    }
})
export class AppMenuProfile implements OnDestroy {
    layoutService = inject(LayoutService);
    authService = inject(AuthService);
    accountService = inject(AccountService);

    renderer = inject(Renderer2);

    el = inject(ElementRef);

    isHorizontal = computed(
        () =>
            this.layoutService.isHorizontal() && this.layoutService.isDesktop()
    );

    menuProfileActive = computed(
        () => this.layoutService.layoutState().menuProfileActive
    );

    menuProfilePosition = computed(
        () => this.layoutService.layoutConfig().menuProfilePosition
    );

    isTooltipDisabled = computed(() => !this.layoutService.isSlim());

    subscription!: Subscription;

    outsideClickListener: any;

    account: Account | null = null;

    constructor() {
        this.subscription = this.layoutService.overlayOpen$.subscribe(() => {
            if (this.isHorizontal() && this.menuProfileActive()) {
                this.layoutService.layoutState.update((value) => ({
                    ...value,
                    menuProfileActive: false
                }));
            }
        });

        effect(() => {
            if (
                this.isHorizontal() &&
                this.menuProfileActive() &&
                !this.outsideClickListener
            ) {
                this.bindOutsideClickListener();
            }

            if (!this.menuProfileActive() && this.isHorizontal()) {
                this.unbindOutsideClickListener();
            }
        });

        this.subscription = this.accountService.currentUser
            .pipe(
                map((account) => {
                    this.account = account;
                })
            )
            .subscribe();
    }

    @Confirmable()
    logout() {
        this.authService.logout().subscribe();
    }

    bindOutsideClickListener() {
        if (this.isHorizontal()) {
            this.outsideClickListener = this.renderer.listen(
                document,
                'click',
                (event: MouseEvent) => {
                    if (this.menuProfileActive()) {
                        const isOutsideClicked = !(
                            this.el.nativeElement.isSameNode(event.target) ||
                            this.el.nativeElement.contains(event.target)
                        );
                        if (isOutsideClicked) {
                            this.layoutService.layoutState.update((value) => ({
                                ...value,
                                menuProfileActive: false
                            }));
                        }
                    }
                }
            );
        }
    }

    unbindOutsideClickListener() {
        if (this.outsideClickListener) {
            this.outsideClickListener();
            this.outsideClickListener = null;
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.unbindOutsideClickListener();
    }

    toggleMenu() {
        this.layoutService.onMenuProfileToggle();
    }
}
