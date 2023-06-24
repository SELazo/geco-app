import { useDispatch, useSelector } from 'react-redux';
import { EMPTY_STRING, TOKEN_KEY } from '../../constants/auth';
import { IValidateSessionResponse } from '../../interfaces/dtos/external/IAuth';
import { ApiResponse } from '../../interfaces/dtos/external/IResponse';
import { ISessionService } from '../../interfaces/dtos/internal/ISessionService';
import { AuthService } from '../external/authService';
import { Auth, User, loginSuccess } from '../../redux/sessionSlice';

export const SessionService: ISessionService = {
  getToken: (): string => {
    const storedToken = null;// TODO: useSelector((state: any) => state.auth.token); buscar en store antes del local storage
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

  validateSession: async (): Promise<boolean> => {
    const token = SessionService.getToken();
    if (!token) return false;

    return await AuthService.validateSession()
      .then(async (response: ApiResponse<IValidateSessionResponse>) => {
          const dispatch = useDispatch();
          const session = response.data as IValidateSessionResponse;
          const user: User = session.user;  
          const auth: Auth = {
            token,
            isAuthenticated: true,
          };
          dispatch(loginSuccess({ user, auth }));
          return true;
      })
      .catch(e => {
        SessionService.removeToken();
        return false;
      })
  }
};
