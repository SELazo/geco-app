import axios, { AxiosResponse } from 'axios';

interface LoginResponse {
  token: string;
}

interface IAuthService {
  isAuthenticated(): Promise<boolean>;
  login(email: string, password: string): Promise<LoginResponse>;
  logout(): void;
}

const apiUrl = '';

export const AuthService: IAuthService = {
  isAuthenticated: async (): Promise<boolean> => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  //login: async (email: string, password: string): Promise<string> => {
  //  const response: AxiosResponse<LoginResponse> =
  //    await axios.post<LoginResponse>('/login', {
  //      email,
  //      password,
  //    });
  //  const token = response.data.token;
  //  return Promise.resolve(token);
  //},

  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }), // Modifico `data` por los parámetros email y password
    });
  
    const data: LoginResponse = await response.json();
    return data;
  },

  logout: (): void => {
    localStorage.removeItem('token');
  },
};
