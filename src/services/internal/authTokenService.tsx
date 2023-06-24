import { TOKEN_KEY } from '../../constants/auth';
import { IAuthTokenService } from '../../interfaces/dtos/internal/IAuthTokenService';

export const AuthTokenService: IAuthTokenService = {
  getToken: (): string => {
    const token = localStorage.getItem(TOKEN_KEY);
    return token ?? "";
  },

  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },
};
