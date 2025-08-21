export enum Types {
    LessonTypes = 'lesson-types',
    BuildingTypes = 'building-types',
    RoomTypes = 'room-types',
    DegreeTypes = 'degree-types',
    StageTypes = 'stage-types',
    AcademicTitleTypes = 'academic-title-types',
    StudyFormTypes = 'study-form-types',
    WeekDayTypes = 'weekday-types'
}

export function types() {
    return Object.values(Types);
}
