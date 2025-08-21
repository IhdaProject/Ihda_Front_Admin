export enum UserTypes {
    STUDENT = 'STUDENT',
    TEACHER = 'TEACHER',
    COORDINATOR = 'COORDINATOR',
    COURSE_LEADER = 'COURSE_LEADER',
    ADMIN = 'ADMIN',
    GUEST = 'GUEST'
}

export function userTypes() {
    return Object.values(UserTypes).map((w) => ({ label: w, value: w }));
}
