export interface ErrorModel {
    timestamp?: Date;
    status: number;
    error: string;
    message: string;
    path: string | null;
    code?: string;
}
