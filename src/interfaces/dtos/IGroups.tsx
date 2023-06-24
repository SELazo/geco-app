import { IBasicSuccessResponse } from "./IBasicResponse";

export interface IContactResponse {
    id: number;
    name: string;
    email: string;
    phone: number;
}

export interface IGroupService {
    newGroup(name: string, description: string, directories: number[]): Promise<IBasicSuccessResponse>;
    addContactToGroup(groupId: number, contactId: number): Promise<IBasicSuccessResponse>;
}
