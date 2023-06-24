export interface IAuthTokenService {
    getToken(): string;
    setToken(token: string): void;
    removeToken(): void;
}