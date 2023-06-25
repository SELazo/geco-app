import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Auth {
  isAuthenticated: boolean;
  token: string | null;
}

export interface INewGoupInfo {
  name: string;
  description: string;
}

export interface INewGroupForm {
  groupInfo: INewGoupInfo;
  contacts: number[];
}

export interface SessionState {
  user: User;
  auth: Auth;
  terms?: number;
  formNewGroup: INewGroupForm;
}

const initialState: SessionState = {
  user: { id: -1, name: '', email: '' },
  auth: { isAuthenticated: false, token: null },
  formNewGroup: {} as INewGroupForm,
};

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setIdTerms: (state, action: PayloadAction<number>) => {
      state.terms = action.payload;
    },
    resetTerms: (state) => {
      const newState = { ...state };
      delete newState.terms;
      state = newState;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; auth: Auth }>
    ) => {
      state.user = action.payload.user;
      state.auth.isAuthenticated = true;
      state.auth.token = action.payload.auth.token;
    },
    logout: (state) => {
      state.auth.isAuthenticated = false;
      state.auth.token = null;
    },
    setNewFormGroupInfo: (state, action: PayloadAction<INewGoupInfo>) => {
      state.formNewGroup.groupInfo = action.payload;
    },
    setNewGroupContacts: (state, action: PayloadAction<number[]>) => {
      state.formNewGroup.contacts = action.payload;
    },
    clearNewGroupForm: (state) => {
      state.formNewGroup = {} as INewGroupForm;
    },
  },
});

export const {
  setUser,
  setIdTerms,
  resetTerms,
  loginSuccess,
  logout,
  setNewFormGroupInfo,
  setNewGroupContacts,
  clearNewGroupForm,
} = sessionSlice.actions;
