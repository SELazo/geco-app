import axios, { AxiosResponse } from 'axios';

interface IAuthService {
  isAuthenticated(): Promise<boolean>;
  login(email: string, password: string): Promise<string>;
  logout(): void;
}
interface LoginResponse {
  token: string;
}

const apiUrl = '';

export const AuthService: IAuthService = {
  isAuthenticated: async (): Promise<boolean> => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  login: async (email: string, password: string): Promise<string> => {
    const response: AxiosResponse<LoginResponse> =
      await axios.post<LoginResponse>('/login', {
        email,
        password,
      });
    const token = response.data.token;
    return Promise.resolve(token);
  },

  logout: (): void => {
    localStorage.removeItem('token');
  },
};
