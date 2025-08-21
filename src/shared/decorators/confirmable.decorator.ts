import { TranslocoService } from '@jsverse/transloco';
import { ConfirmationService } from 'primeng/api';
import { InjectorHelper } from 'src/core/utils/injector.helper';

export function Confirmable(
    confirmText = 'Are you sure that you want to proceed?'
): MethodDecorator {
    return (
        target: object,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor
    ) => {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            // Injector ni runtime da chaqirish — har safar yangi instance olish uchun
            const environmentInjector = InjectorHelper.injector;

            if (!environmentInjector) {
                console.error('Injector is not initialized.');
                return;
            }

            const confirmation = environmentInjector.get(ConfirmationService);
            const transloco = environmentInjector.get(TranslocoService);

            confirmation.confirm({
                target: args[0] as EventTarget,
                message: transloco.translate(confirmText),
                header: transloco.translate('Confirmation'),
                rejectLabel: transloco.translate('no'),
                acceptLabel: transloco.translate('yes'),
                icon: 'pi pi-exclamation-triangle',
                acceptIcon: 'none',
                rejectIcon: 'none',
                rejectButtonStyleClass: 'p-button-text',
                accept: () => {
                    const result = originalMethod.apply(this, args);
                    console.log(
                        `-- ${String(propertyKey)}() returned: `,
                        result
                    );
                    return result;
                },
                reject: () => {
                    return;
                }
            });
        };
        return descriptor;
    };
}
