import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject
} from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LayoutService } from '@/layout/service/layout.service';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';
import { AppConfigurator } from '@/layout/components/app.configurator';
import { AuthService } from 'src/core/services/auth.service';
import { markAllAsDirty } from 'src/core/utils/util';
import { TranslocoModule } from '@jsverse/transloco';
import { StorageService } from 'src/core/services/storage.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        TranslocoModule,
        InputTextModule,
        RouterModule,
        ButtonModule,
        FluidModule,
        AppConfigurator,
        ReactiveFormsModule
    ],
    template: `
        <div
            class="overflow-hidden margin-0 relative h-screen flex items-center justify-center"
        >
            <form [formGroup]="form" (ngSubmit)="login()">
                <p-fluid
                    class="w-full text-center bg-surface-absolute0 dark:bg-surface-900 rounded"
                >
                    <div
                        class="px-12 md:p-0 w-[29rem] relative text-white"
                        style="margin-left: -200px; top: 30px; left: 50%;"
                    >
                        <div class="grid grid-cols-12 gap-4">
                            <div class="col-span-12 text-left">
                                <label
                                    class="text-surface-600 dark:text-surface-400 mb-1"
                                    >{{ 'login' | transloco }}</label
                                >
                                <div class="mt-1">
                                    <input
                                        type="text"
                                        [placeholder]="'login' | transloco"
                                        pInputText
                                        formControlName="username"
                                    />
                                </div>
                            </div>
                            <div class="col-span-12 text-left">
                                <label
                                    class="text-surface-600 dark:text-surface-400 mb-1"
                                    >{{ 'password' | transloco }}</label
                                >
                                <div class="mt-1">
                                    <input
                                        type="password"
                                        [placeholder]="'password' | transloco"
                                        pInputText
                                        formControlName="password"
                                    />
                                </div>
                            </div>
                            <div class="col-span-12">
                                <button
                                    pButton
                                    pRipple
                                    type="submit"
                                    [label]="'login' | transloco"
                                    [loading]="form.disabled"
                                ></button>
                            </div>
                            <!-- TODO: REMOVE -->
                            <!-- <div class="col-span-12 md:col-span-6">
                                <button
                                    pButton
                                    pRipple
                                    class="!text-gray-300 hover:!text-gray-600 dark:!text-gray-900 flex justify-center"
                                    text
                                >
                                    Forgot Password?
                                </button>
                            </div> -->
                        </div>
                    </div>
                </p-fluid>
            </form>
        </div>
        <app-configurator simple />
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Login {
    LayoutService = inject(LayoutService);
    private $auth = inject(AuthService);
    private fb = inject(FormBuilder);
    private router = inject(Router);

    rememberMe: boolean = false;
    isDarkTheme = computed(() => this.LayoutService.isDarkTheme());

    form = this.fb.nonNullable.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
    });

    login() {
        if (this.form.invalid) {
            markAllAsDirty(this.form);
            return;
        }

        this.form.disable();
        const formValue = this.form.getRawValue();
        this.$auth.login(formValue.username, formValue.password).subscribe({
            next: (w) => {
                if (w) {
                    this.router.navigate(['/']);
                }
            },
            error: (e) => {
                this.form.enable();
            },
            complete: () => {
                this.form.enable();
            }
        });
    }
}
