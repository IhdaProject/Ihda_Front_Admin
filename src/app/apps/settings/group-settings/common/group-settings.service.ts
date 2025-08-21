import { inject, Injectable } from '@angular/core';
import { BaseService } from 'src/core/services/base.service';
import {
    GroupSettingRequest,
    GroupSettingResponse
} from './group-settings.model';

@Injectable({ providedIn: 'root' })
export class GroupSettingsService {
    readonly url = 'api-auth/Role/GetAllStructures';
    private $base = inject(BaseService);

    create(model: GroupSettingRequest) {
        return this.$base.post(this.url, model);
    }

    put(model: GroupSettingRequest, id: string) {
        return this.$base.put(this.url, id, model);
    }

    get() {
        return this.$base.get<GroupSettingResponse>(this.url);
    }
}
