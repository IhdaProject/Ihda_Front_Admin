export enum TermType {
    SEMESTER = 'SEMESTER',
    TRIMESTER = 'TRIMESTER',
    QUARTER = 'QUARTER',
    YEAR = 'YEAR'
}

export function termTypes() {
    return Object.values(TermType).map((w) => ({ label: w, value: w }));
}
