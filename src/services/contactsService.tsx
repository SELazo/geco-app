import { IContactsService, IContactResponse } from '../../interfaces/dtos/IContacts';
import { IBasicSuccessResponse } from '../../interfaces/dtos/IBasicResponse';
import { environment } from '../../environment/environment';

const { contactsApiURI } = environment;

export const contactsService: IContactsService = {
    newContact: async (name: string, email: string, phone: string): Promise<IBasicSuccessResponse> => {
        const token = localStorage.getItem('token');

        const response = await fetch(`${contactsApiURI}/directories/contacts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            },
            body: JSON.stringify({ name, email, phone }),
        });
    
        const data: IBasicSuccessResponse = await response.json();
        return data;
    },

    deleteContact: async (id: number): Promise<IBasicSuccessResponse> => {
        const token = localStorage.getItem('token');

        const response = await fetch(`${contactsApiURI}/contacts/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            },
        });

        const data: IBasicSuccessResponse = await response.json();
        return data;
    },

    editContact: async (id: number): Promise<IBasicSuccessResponse> => {
        const token = localStorage.getItem('token');

        const response = await fetch(`${contactsApiURI}/contacts/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            },
        });

        const data: IBasicSuccessResponse = await response.json();
        return data;
    },

    getContact: async (id: number): Promise<IContactResponse> => {
        const token = localStorage.getItem('token');

        const response = await fetch(`${contactsApiURI}/contacts/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            },
        });

        const data: IContactResponse = await response.json();
        return data;
    },

    getContacts: async (params?: { name?: string; email?: string; phone?: number }): Promise<IContactResponse[]> => {
        let url = `${contactsApiURI}/contacts`;

        if (params) {
            const { name, email, phone } = params;

            if (name) {
                url += `?name=${name}`;
            } else if (email) {
                url += `?email=${email}`;
            } else if (phone) {
                url += `?phone=${phone}`;
            }
        }

        const token = localStorage.getItem('token');

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            },
        });

        const data: IContactResponse[] = await response.json();
        return data;
    }
};
