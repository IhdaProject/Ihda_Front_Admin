export class StorageService {
    public static get accessToken(): string {
        return StorageService.getItem('access_token') || '';
    }
    public static set accessToken(v: string) {
        StorageService.setItem('access_token', v);
    }

    public static get refreshToken(): string {
        return StorageService.getItem('refresh_token') || '';
    }
    public static set refreshToken(v: string) {
        StorageService.setItem('refresh_token', v);
    }

    public static remove(key: 'access_token' | 'refresh_token') {
        this.removeItem(key);
    }

    public static clear() {
        localStorage.clear();
    }

    // PRIVATE METHODS
    private static setItem(key: string, value: any) {
        localStorage.setItem(key, value);
    }

    private static getItem(key: string) {
        return localStorage.getItem(key);
    }

    private static removeItem(key: string) {
        localStorage.removeItem(key);
    }
}
