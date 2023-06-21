import { IBasicSuccessResponse } from "../commonInterfaces";

export interface ILoginResponse {
    token: string;
}

export interface IValidateSessionResponse {
    success: boolean;
    user: {
        id: number;
        name: string;
        email: string;
    };
}

export interface IAuthService {
    isAuthenticated(): Promise<boolean>;
    login(email: string, password: string): Promise<ILoginResponse>;
    logout(): Promise<IBasicSuccessResponse>;
    validateSession(): Promise<IValidateSessionResponse>;
    signUp(name: string, email: string, password: string): Promise<IBasicSuccessResponse>
    resetPasswordRequest(email: string): Promise<IBasicSuccessResponse>
    resetPassword(newPassword: string, passwordToken: string): Promise<IBasicSuccessResponse>
}
