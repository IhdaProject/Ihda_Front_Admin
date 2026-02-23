export interface Account {
    id: number;
    permissions: number[];
    structuresId: number[];
    structuresName?: string[];
    fullName?: string;
    avatarUrl?: string;
}
