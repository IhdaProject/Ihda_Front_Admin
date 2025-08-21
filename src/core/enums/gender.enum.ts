export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE'
}

export function genders() {
    return Object.values(Gender).map((w) => ({ label: w, value: w }));
}
