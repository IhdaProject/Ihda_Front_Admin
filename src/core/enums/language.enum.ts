export enum Language {
    ENGLISH = 'ENGLISH',
    RUSSIAN = 'RUSSIAN',
    UZBEK_LATIN = 'UZBEK_LATIN'
}

export function languages() {
    return Object.values(Language).map((w) => ({ label: w, value: w }));
}
