export interface GridResponse {
    content: any[];
    page: {
        number: number;
        size: number;
        totalElements: number;
        totalPages: number;
    };
}
