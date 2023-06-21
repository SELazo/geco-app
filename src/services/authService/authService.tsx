import { IAuthService, ILoginResponse, IValidateSessionResponse } from './authInterfaces';
import { IBasicSuccessResponse } from '../commonInterfaces';
import { environment } from '../../environment/environment';

const { authServiceURI } = environment;

export const AuthService: IAuthService = {
  isAuthenticated: async (): Promise<boolean> => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  login: async (email: string, password: string): Promise<ILoginResponse> => {
    const response = await fetch(`${authServiceURI}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
  
    const data: ILoginResponse = await response.json();
    return data;
  },

  logout: async (): Promise<IBasicSuccessResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${authServiceURI}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      },
    });

    localStorage.removeItem('token');

    const data: IBasicSuccessResponse = await response.json();
    return data;
  },

  validateSession: async (): Promise<IValidateSessionResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${authServiceURI}/validate-session`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      },
    });

    const data: IValidateSessionResponse = await response.json();
    return data;
  },

  signUp: async (name: string, email: string, password: string): Promise<IBasicSuccessResponse> => {
    const response = await fetch(`${authServiceURI}/sign-up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data: IBasicSuccessResponse = await response.json();
    return data;
  },
  
  resetPasswordRequest: async (email: string): Promise<IBasicSuccessResponse> => {
    const response = await fetch(`${authServiceURI}/reset-password-request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data: IBasicSuccessResponse = await response.json();
    return data;
  },

  resetPassword: async (newPassword: string, passwordToken: string): Promise<IBasicSuccessResponse> => {
    const response = await fetch(`${authServiceURI}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-reset-password-token': `${passwordToken}`
      },
      body: JSON.stringify({ newPassword }),
    });

    const data: IBasicSuccessResponse = await response.json();
    return data;
  }
};
