import { IBasicSuccessResponse } from "./IBasicResponse";
import { IContactResponse } from "./IContacts";

export interface IGroup {
    id: number;
    name: string;
    description: string;
    account_id: number;
}

export interface IGroupResponse {
    group: IGroup;
    contacts: IContactResponse[];
}

export interface IGroupService {
    newGroup(name: string, description: string, contacts: number[]): Promise<IBasicSuccessResponse>;
    addContactToGroup(groupId: number, contactId: number): Promise<IBasicSuccessResponse>;
    deleteContactFromGroup(groupId: number, contactId: number): Promise<IBasicSuccessResponse>;
    editGroup(groupId: number): Promise<IBasicSuccessResponse>;
    deleteGroup(groupId: number): Promise<IBasicSuccessResponse>;
    getGroup(groupId: number): Promise<IGroupResponse>;
    getGroups(name?: string): Promise<IGroup[]>;
}
