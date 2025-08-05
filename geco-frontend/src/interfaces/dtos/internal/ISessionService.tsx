import { IValidateSessionResponse } from "../external/IAuth";

export interface ISessionService {
    getToken(): string;
    setToken(token: string): void;
    removeToken(): void;
    getSession(): IValidateSessionResponse | null;
    setSession(session: IValidateSessionResponse): void;
    validateSession(token: string): Promise<boolean>;
}