import axios, { AxiosResponse } from 'axios';

interface LoginResponse {
  token: string;
}

class AuthService {
  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  public async login(email: string, password: string): Promise<string> {
    const response: AxiosResponse<LoginResponse> =
      await axios.post<LoginResponse>('/login', {
        email,
        password,
      });
    const token = response.data.token;
    return Promise.resolve(token);
  }

  public logout(): void {
    localStorage.removeItem('token');
  }
}

export default new AuthService();
