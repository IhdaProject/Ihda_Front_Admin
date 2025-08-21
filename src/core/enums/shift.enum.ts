export enum Shift {
    Morning = 'MORNING',
    Afternoon = 'AFTERNOON',
    Evening = 'EVENING'
}

export function shifts() {
    return Object.values(Shift).map((w) => ({ label: w, value: w }));
}
