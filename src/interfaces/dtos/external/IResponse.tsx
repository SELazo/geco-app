import { IError } from "./IError";

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: IError;
}