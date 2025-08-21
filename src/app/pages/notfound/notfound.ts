import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
@Component({
    selector: 'app-notfound',
    standalone: true,
    imports: [RouterModule, ButtonModule],
    template: `
        <div class="overflow-hidden m-0 relative h-screen !bg-cover !bg-center" style="background-image: url('/layout/images/pages/exception/bg-404.png');">
            <div class="text-center text-5xl pt-8 font-bold text-white">
                <div class="inline-block py-1 px-2 bg-surface-950 dark:bg-surface-950">
                    <span class="text-surface-50">Page</span>
                </div>
                <span class="text-surface-950">Not Found</span>
            </div>
            <div class="w-full absolute bottom-0 text-center bg-surface-900 dark:bg-surface-0 h-56">
                <div class="w-full absolute flex justify-center z-10" style="top: -36px">
                    <img src="/layout/images/pages/exception/icon-error.png" alt="avalon-ng" />
                </div>
                <div class="w-[29rem] relative text-white" style="margin-left: -200px; left: 50%; top: 30px">
                    <div class="p-4">
                        <h3 class="m-0 mb-2 text-surface-0 dark:text-surface-900">Page Not Found.</h3>
                        <p class="m-0 text-surface-0 dark:text-surface-900">Please contact system administrator.</p>
                    </div>
                    <button pButton pRipple type="button" [routerLink]="['/']" label="Go To Dashboard"></button>
                </div>
            </div>
        </div>
    `
})
export class Notfound {}
