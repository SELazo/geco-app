import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthState {
  user: User;
  isAuthenticated: boolean;
  token: string | null;
  terms?: number;
}

const initialState: AuthState = {
  user: { id: -1, name: '', email: '' },
  isAuthenticated: false,
  token: null,
};

export const authSlice = createSlice({
  name: 'auth',
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
    loginSuccess: (state, action: PayloadAction<AuthState>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
    },
  },
});

export const { setUser, setIdTerms, resetTerms, loginSuccess, logout } =
  authSlice.actions;
