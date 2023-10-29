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

export interface INewAdInfo {
  size: string;
  titleAd: string;
  textAd: string;
  descriptionAd: string;
  img: File | string;
  template: string;
  pallette: string;
  titleHelper: string;
  descriptionHelper: string;
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
  formNewAd: INewAdInfo;
}

const initialState: SessionState = {
  user: { id: -1, name: '', email: '' },
  auth: { isAuthenticated: false, token: null },
  formNewGroup: {} as INewGroupForm,
  formNewAd: {} as INewAdInfo,
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
    setNewAdSize: (state, action: PayloadAction<string>) => {
      state.formNewAd = { ...state.formNewAd, size: action.payload };
    },
    setNewAdContent: (
      state,
      action: PayloadAction<{ title: string; text: string }>
    ) => {
      state.formNewAd = {
        ...state.formNewAd,
        titleAd: action.payload.title,
        textAd: action.payload.text,
      };
    },
    setNewAdImg: (state, action: PayloadAction<File | string>) => {
      state.formNewAd = {
        ...state.formNewAd,
        img: action.payload,
      };
    },
    setNewAdTitleHelper: (state, action: PayloadAction<string>) => {
      state.formNewAd = {
        ...state.formNewAd,
        titleHelper: action.payload,
      };
    },
    setNewAdDescriptionHelper: (state, action: PayloadAction<string>) => {
      state.formNewAd = {
        ...state.formNewAd,
        descriptionHelper: action.payload,
      };
    },
    setNewAdTemplate: (state, action: PayloadAction<string>) => {
      state.formNewAd = {
        ...state.formNewAd,
        template: action.payload,
      };
    },
    setNewAdPallette: (state, action: PayloadAction<string>) => {
      state.formNewAd = {
        ...state.formNewAd,
        pallette: action.payload,
      };
    },
    clearNewAdForm: (state) => {
      state.formNewAd = {} as INewAdInfo;
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
  setNewAdSize,
  setNewAdContent,
  setNewAdImg,
  setNewAdPallette,
  setNewAdTemplate,
  setNewAdTitleHelper,
  setNewAdDescriptionHelper,
} = sessionSlice.actions;
