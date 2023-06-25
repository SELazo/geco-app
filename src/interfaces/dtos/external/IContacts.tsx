import { IBasicSuccessResponse } from "./IBasicResponse";
import { ApiResponse } from "./IResponse";

export interface IContactResponse {
    id: number;
    name: string;
    email: string;
    phone: number;
}

export interface IContactsService {
    newContact(name: string, email: string, phone: string): Promise<ApiResponse<IBasicSuccessResponse>>;
    deleteContact(id: number): Promise<ApiResponse<IBasicSuccessResponse>>;
    editContact(id: number): Promise<IBasicSuccessResponse>;
    getContact(id: number): Promise<IContactResponse>;
    getContacts(params?: { name?: string; email?: string; phone?: number }): Promise<ApiResponse<IContactResponse[]>>;
}
