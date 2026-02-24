export interface Account {
    id: number;
    marketId: string;
    permissions: number[];
    structuresId: number[];
    structuresName?: string[];
    fullName?: string;
    avatarUrl?: string;
}
