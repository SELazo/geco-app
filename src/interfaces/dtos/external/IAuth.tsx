import { IBasicSuccessResponse } from "./IBasicResponse";
import { ApiResponse } from "./IResponse";

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
    login(email: string, password: string): Promise<ApiResponse<ILoginResponse>>;
    logout(): Promise<ApiResponse<IBasicSuccessResponse>>;
    validateSession(): Promise<ApiResponse<IValidateSessionResponse>>
    signUp(name: string, email: string, password: string): Promise<ApiResponse<IBasicSuccessResponse>>
    resetPasswordRequest(email: string): Promise<ApiResponse<IBasicSuccessResponse>>
    resetPassword(newPassword: string, passwordToken: string): Promise<ApiResponse<IBasicSuccessResponse>>
}
