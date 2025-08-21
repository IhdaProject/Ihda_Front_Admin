export interface TypesResponse extends TypesRequest {
    id: string;
}

export interface TypesRequest {
    name: string; // 'Lesson type';
    value: string; // 'lesson-type';
    description: string; // 'Types of lessons';
    ordering: number; // 1;
    active: boolean; // true;
    typeCode?: string | null;
}
