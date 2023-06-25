import {
  IGroup,
  IGroupResponse,
  IGroupService,
} from '../../interfaces/dtos/external/IGroups';
import { IBasicSuccessResponse } from '../../interfaces/dtos/external/IBasicResponse';
import { environment } from '../../environment/environment';

const { contactsApiURI } = environment;

export const GroupsService: IGroupService = {
  newGroup: async (
    name: string,
    description: string,
    directories: number[]
  ): Promise<IBasicSuccessResponse> => {
    const token = localStorage.getItem('token');

    const response = await fetch(`${contactsApiURI}/directories/groups`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
      body: JSON.stringify({ name, description, directories }),
    });

    const data: IBasicSuccessResponse = await response.json();
    return data;
  },

  addContactToGroup: async (
    groupId: number,
    contactId: number
  ): Promise<IBasicSuccessResponse> => {
    const token = localStorage.getItem('token');

    const response = await fetch(
      `${contactsApiURI}/groups/${groupId}/contacts/${contactId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
      }
    );

    const data: IBasicSuccessResponse = await response.json();
    return data;
  },

  deleteContactFromGroup: async (
    groupId: number,
    contactId: number
  ): Promise<IBasicSuccessResponse> => {
    const token = localStorage.getItem('token');

    const response = await fetch(
      `${contactsApiURI}/groups/${groupId}/contacts/${contactId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
      }
    );

    const data: IBasicSuccessResponse = await response.json();
    return data;
  },

  editGroup: async (groupId: number): Promise<IBasicSuccessResponse> => {
    const token = localStorage.getItem('token');

    const response = await fetch(`${contactsApiURI}/groups/${groupId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
    });

    const data: IBasicSuccessResponse = await response.json();
    return data;
  },

  deleteGroup: async (groupId: number): Promise<IBasicSuccessResponse> => {
    const token = localStorage.getItem('token');

    const response = await fetch(`${contactsApiURI}/groups/${groupId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
    });

    const data: IBasicSuccessResponse = await response.json();
    return data;
  },

  getGroup: async (groupId: number): Promise<IGroupResponse> => {
    const token = localStorage.getItem('token');

    const response = await fetch(`${contactsApiURI}/groups/${groupId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
    });

    const data: IGroupResponse = await response.json();
    return data;
  },

  getGroups: async (name?: string): Promise<IGroup[]> => {
    let url = `${contactsApiURI}/groups`;

    if (name) {
      url += `?name=${name}`;
    }

    const token = localStorage.getItem('token');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
    });

    const data: IGroup[] = await response.json();
    return data;
  },
};
