import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAdPattern } from '../interfaces/dtos/external/IAds';

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
  titleAd: string | undefined;
  textAd: string | undefined;
  descriptionAd: string;
  img: File | string;
  template: IAdPattern;
  pallette: string;
  titleHelper: string;
  descriptionHelper: string;
}

export interface INewGroupForm {
  groupInfo: INewGoupInfo;
  contacts: number[];
}

export interface INewStrategyForm {
  title: string;
  ads: number[];
  groups: number[];
  startDate: string;
  endDate: string;
  periodicity: string;
  schedule: string; //5 caracteres
}

export interface SessionState {
  user: User;
  auth: Auth;
  terms?: number;
  formNewGroup: INewGroupForm;
  formNewAd: INewAdInfo;
  formNewStrategy: INewStrategyForm;
}

const initialState: SessionState = {
  user: { id: -1, name: '', email: '' },
  auth: { isAuthenticated: false, token: null },
  formNewGroup: {} as INewGroupForm,
  formNewAd: {} as INewAdInfo,
  formNewStrategy: {} as INewStrategyForm,
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
      action: PayloadAction<{ title?: string; text?: string }>
    ) => {
      state.formNewAd = {
        ...state.formNewAd,
        titleAd: action.payload.title ? action.payload.title : undefined,
        textAd: action.payload.text ? action.payload.title : undefined,
      };
    },
    setNewAdImg: (state, action: PayloadAction<File | string>) => {
      state.formNewAd = {
        ...state.formNewAd,
        img: action.payload,
      };
    },
    setNewAdIdentification: (
      state,
      action: PayloadAction<{ titleHelper: string; descriptionHelper: string }>
    ) => {
      state.formNewAd = {
        ...state.formNewAd,
        titleHelper: action.payload.titleHelper,
        descriptionHelper: action.payload.descriptionHelper,
      };
    },
    setNewAdTemplate: (state, action: PayloadAction<IAdPattern>) => {
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
    setNewStrategyTitle: (state, action: PayloadAction<string>) => {
      state.formNewStrategy = {
        ...state.formNewStrategy,
        title: action.payload,
      };
    },
    setNewStrategyAds: (state, action: PayloadAction<number[]>) => {
      state.formNewStrategy = {
        ...state.formNewStrategy,
        ads: action.payload,
      };
    },
    setNewStrategyGroups: (state, action: PayloadAction<number[]>) => {
      state.formNewStrategy = {
        ...state.formNewStrategy,
        groups: action.payload,
      };
    },
    setNewStrategyDates: (
      state,
      action: PayloadAction<{ start: string; end: string }>
    ) => {
      state.formNewStrategy = {
        ...state.formNewStrategy,
        startDate: action.payload.start,
        endDate: action.payload.end,
      };
    },
    setNewStrategyPeriodicity: (state, action: PayloadAction<string>) => {
      state.formNewStrategy = {
        ...state.formNewStrategy,
        periodicity: action.payload,
      };
    },
    setNewStrategySchedule: (state, action: PayloadAction<string>) => {
      state.formNewStrategy = {
        ...state.formNewStrategy,
        schedule: action.payload,
      };
    },
    clearNewStrategyForm: (state) => {
      state.formNewStrategy = {} as INewStrategyForm;
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
  clearNewAdForm,
  setNewAdSize,
  setNewAdContent,
  setNewAdImg,
  setNewAdPallette,
  setNewAdTemplate,
  setNewAdIdentification,
} = sessionSlice.actions;
