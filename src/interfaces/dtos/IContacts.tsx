import { IBasicSuccessResponse } from "./IBasicResponse";

export interface ILoginResponse {
    token: string;
}

export interface IContactResponse {
    id: number;
    name: string;
    email: string;
    phone: number;
}

export interface IContactsService {
    newContact(name: string, email: string, phone: string): Promise<IBasicSuccessResponse>;
    deleteContact(id: number): Promise<IBasicSuccessResponse>;
    editContact(id: number): Promise<IBasicSuccessResponse>;
    getContact(id: number): Promise<IContactResponse>;
    getContacts(params?: { name?: string; email?: string; phone?: number }): Promise<IContactResponse[]>;
}
