export interface ISessionService {
    getToken(): string;
    setToken(token: string): void;
    removeToken(): void;
    validateSession(): Promise<boolean>;
}