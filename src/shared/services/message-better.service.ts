import { inject, Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { MessageService, ToastMessageOptions } from 'primeng/api';

@Injectable()
export class MessageBetterService extends MessageService {
    private $transloco = inject(TranslocoService);

    override add(message: ToastMessageOptions): void {
        if (message.summary)
            message.summary = this.$transloco.translate(message.summary);

        if (message.detail)
            message.detail = this.$transloco.translate(message.detail);

        message.life = message.life || 3000;

        super.add(message);
    }
}
