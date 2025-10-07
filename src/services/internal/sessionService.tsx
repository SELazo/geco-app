import { EMPTY_STRING, SESSION_KEY, TOKEN_KEY } from '../../constants/auth';
import { IValidateSessionResponse } from '../../interfaces/dtos/external/IAuth';
import { ApiResponse } from '../../interfaces/dtos/external/IResponse';
import { ISessionService } from '../../interfaces/dtos/internal/ISessionService';
import AuthServiceFirestore from '../external/authServiceFirestore';

export const SessionService: ISessionService = {
  getToken: (): string => {
    const storedToken = null //useSelector((state: any) => state.auth.token);
    if (storedToken) {
      return storedToken;
    }

    const token = localStorage.getItem(TOKEN_KEY) ?? EMPTY_STRING;
    return token;
  },

  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },

  getSession: (): IValidateSessionResponse | null => {
    const session = localStorage.getItem(SESSION_KEY);

    if (!session) {
      return null;
    }
    
    const sessionObject = JSON.parse(session) as IValidateSessionResponse;
    return sessionObject;
  },

  setSession: (session: IValidateSessionResponse): void => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  },

  validateSession: async (token: string): Promise<boolean> => {
    if (!token) return false;

    return await AuthServiceFirestore.validateSession()
      .then(async (response: ApiResponse<IValidateSessionResponse>) => {
          const session = response.data as IValidateSessionResponse;
          SessionService.setSession(session);
          return true;
      })
      .catch((e: any) => {
        SessionService.removeToken();
        return false;
      })
  }
};
