import { TypesResponse } from '@/apps/crud/types/types';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Types } from 'src/core/enums/types.enum';
import { BaseService } from 'src/core/services/base.service';
import { fullName } from 'src/core/utils/util';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    constructor(private $base: BaseService) {}

    getCountries() {
        const params = new HttpParams()
            .append('skip', '0')
            .append('take', '1000');
        return this.$base
            .get<{ content: TypesResponse[] }>('api-rb/country', { params })
            .pipe(
                map((w) =>
                    w.content.map((item) => ({
                        label: item.name,
                        value: item.id
                    }))
                )
            );
    }

    getRegions(countryId: number) {
        const params = new HttpParams()
            .append(
                'FilteringExpressionsJson',
                JSON.stringify([
                    {
                        PropertyName: 'CountryId',
                        Value: `${countryId}`,
                        Type: '=='
                    }
                ])
            )
            .append('skip', '0')
            .append('take', '1000');
        return this.$base
            .get<{ content: TypesResponse[] }>('api-rb/region', { params })
            .pipe(
                map((w) =>
                    w.content.map((item) => ({
                        label: item.name,
                        value: item.id
                    }))
                )
            );
    }

    getDistricts(regionId: number) {
        const params = new HttpParams()
            .append(
                'FilteringExpressionsJson',
                JSON.stringify([
                    {
                        PropertyName: 'RegionId',
                        Value: `${regionId}`,
                        Type: '=='
                    }
                ])
            )
            .append('skip', '0')
            .append('take', '1000');
        return this.$base
            .get<{ content: TypesResponse[] }>('api-rb/district', { params })
            .pipe(
                map((w) =>
                    w.content.map((item) => ({
                        label: item.name,
                        value: item.id
                    }))
                )
            );
    }

    getPermissions() {
        const params = new HttpParams()
            .append('skip', '0')
            .append('take', '1000');

        return this.$base
            .get<{
                content: TypesResponse[];
            }>('api-auth/Role/GetPermissions', { params })
            .pipe(
                map((w) =>
                    w.content.map((item) => ({
                        label: item.name,
                        value: item.id
                    }))
                )
            );
    }

    timeSlots(full = false) {
        const params = new HttpParams()
            .append('page', '0')
            .append('size', '1000');
        return this.$base
            .get<{
                content: any[];
            }>('schedule/time-slots', { params })
            .pipe(
                map((w) =>
                    full
                        ? w.content
                        : w.content.map((item) => ({
                              label: item.label,
                              value: item.id
                          }))
                )
            );
    }

    curriculums() {
        const params = new HttpParams()
            .append('page', '0')
            .append('size', '1000');
        return this.$base
            .get<{
                content: TypesResponse[];
            }>('academic/curriculums', { params })
            .pipe(
                map((w) =>
                    w.content.map((item) => ({
                        label: item.name,
                        value: item.id
                    }))
                )
            );
    }

    subjects() {
        const params = new HttpParams()
            .append('page', '0')
            .append('size', '1000');
        return this.$base
            .get<{ content: TypesResponse[] }>('academic/subjects', { params })
            .pipe(
                map((w) =>
                    w.content.map((item) => ({
                        label: item.name,
                        value: item.id
                    }))
                )
            );
    }

    programmes() {
        const params = new HttpParams()
            .append('page', '0')
            .append('size', '1000');
        return this.$base
            .get<{
                content: TypesResponse[];
            }>('academic/programmes', { params })
            .pipe(
                map((w) =>
                    w.content.map((item) => ({
                        label: item.name,
                        value: item.id
                    }))
                )
            );
    }

    teachers() {
        const params = new HttpParams()
            .append('page', '0')
            .append('size', '1000');
        return this.$base
            .get<{
                content: any[];
            }>('academic/teachers', { params })
            .pipe(
                map((w) =>
                    w.content.map((item) => ({
                        label: fullName(item.user),
                        value: item.id
                    }))
                )
            );
    }

    getBuildingTypes() {
        const params = new HttpParams()
            .append('page', '0')
            .append('size', '1000')
            .append('active', 'true')
            .append('typeCode', Types.BuildingTypes);
        return this.$base
            .get<{ content: TypesResponse[] }>('core/types', { params })
            .pipe(
                map((w) =>
                    w.content.map((item) => ({
                        label: item.name,
                        value: item.id
                    }))
                )
            );
    }

    types(type: Types) {
        const params = new HttpParams()
            .append('page', '0')
            .append('size', '1000')
            .append('active', 'true')
            .append('sort', 'ordering')
            .append('typeCode', type);
        return this.$base
            .get<{ content: TypesResponse[] }>('core/types', { params })
            .pipe(
                map((w) =>
                    w.content.map((item) => ({
                        label: item.name,
                        value: item.id
                    }))
                )
            );
    }

    typesFull(type: Types) {
        const params = new HttpParams()
            .append('page', '0')
            .append('size', '1000')
            .append('active', 'true')
            .append('sort', 'ordering')
            .append('typeCode', type);
        return this.$base
            .get<{ content: TypesResponse[] }>('core/types', { params })
            .pipe(map((w) => w.content));
    }

    schools() {
        const params = new HttpParams()
            .append('page', '0')
            .append('size', '1000')
            .append('active', 'true');
        return this.$base
            .get<{ content: TypesResponse[] }>('academic/schools', { params })
            .pipe(
                map((w) =>
                    w.content.map((item) => ({
                        label: item.name,
                        value: item.id
                    }))
                )
            );
    }
}
