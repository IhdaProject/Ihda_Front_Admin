enum DefaultGroupAssignmentLogic {
    BY_ADMISSION_TERM_AND_PROGRAM,
    MANUAL_ASSIGNMENT,
    HYBRID
}

export function defaultGroupAssignmentLogics() {
    return Object.values(DefaultGroupAssignmentLogic)
        .filter((w) => !isFinite(+w))
        .map((w) => ({
            label: w,
            value: w
        }));
}

export interface GroupSettingRequest {
    defaultGroupSize: number;
    groupNamePattern: string;
    allowManualGroupCreation: boolean;
    defaultGroupAssignmentLogic: DefaultGroupAssignmentLogic;
    autoArchiveGroupsAfterYears: number;
    archiveDataRetentionPeriodDays: number;
    syncGroupsToLMS: boolean;
    defaultLMSGroupPrefix: string;
}

export interface GroupSettingResponse extends GroupSettingRequest {
    id: string;
}
