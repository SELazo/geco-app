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

export interface newGoupInfo {
  name: string;
  description: string;
}

export interface NewGroupForm {
  groupInfo: newGoupInfo;
  contacts: number[];
}

export interface SessionState {
  user: User;
  auth: Auth;
  terms?: number;
  formNewGroup: NewGroupForm;
}

const initialState: SessionState = {
  user: { id: -1, name: '', email: '' },
  auth: { isAuthenticated: false, token: null },
  formNewGroup: {} as NewGroupForm,
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
    setNewFormGroupInfo: (state, action: PayloadAction<newGoupInfo>) => {
      state.formNewGroup.groupInfo = action.payload;
    },
    setNewGroupContacts: (state, action: PayloadAction<number[]>) => {
      state.formNewGroup.contacts = action.payload;
    },
    clearNewGroupForm: (state) => {
      state.formNewGroup = {} as NewGroupForm;
    },
  },
});

export const { setUser, setIdTerms, resetTerms, loginSuccess, logout } =
  sessionSlice.actions;
