export interface TeacherSetings {
    id: string;
    workingSlots: {
        dayOfWeek: {
            id: string;
            name: string;
            value: string;
        };
        slots: {
            id: string;
            start: string;
            end: string;
        }[];
    }[];
    lessonTypes: {
        id: string;
        name: string;
        value: string;
    }[];
}
