// actions.ts
export const SET_FORM_NAME_DESCRIPTION = 'SET_FORM_NAME_DESCRIPTION';
export const SET_FORM_CONTACTS = 'SET_FORM_CONTACTS';
export const CLEAR_FORM_DATA = 'CLEAR_FORM_DATA';

export const setFormNameDescription = (name: string, description: string) => ({
  type: SET_FORM_NAME_DESCRIPTION,
  payload: { name, description },
});

export const setFormContacts = (contacts: number[]) => ({
  type: SET_FORM_CONTACTS,
  payload: contacts,
});

export const clearFormData = () => ({
  type: CLEAR_FORM_DATA,
});
