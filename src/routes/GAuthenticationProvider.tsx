import { useEffect, useState } from 'react';
import { GRouter } from './GRouter';
import { SessionService } from '../services/internal/sessionService';
import { Auth, User, loginSuccess } from '../redux/sessionSlice';
import { useDispatch } from 'react-redux';

const getAuthenticationStatus = async (): Promise<boolean> => {
    const storedToken = SessionService.getToken();
    const isAuthenticated = await SessionService.validateSession(storedToken);
    return isAuthenticated;
  };

export const GAuthenticationProvider = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {    
    const fetchAuthenticationStatus = async () => {
        let isAuthenticatedStatus = await getAuthenticationStatus();
        const storedToken = SessionService.getToken();

        if (isAuthenticatedStatus) {
            const session = await SessionService.getSession();
            if (session) {
                const user: User = session.user; 
                const auth: Auth = {
                    token: storedToken,
                    isAuthenticated: true,
                };


                dispatch(loginSuccess({ user, auth }));
            } else {
                isAuthenticatedStatus = false;
            }
        }

        setIsAuthenticated(isAuthenticatedStatus);
    };

    fetchAuthenticationStatus();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (isAuthenticated === null) {
    // return <div>Loading...</div>;
  }

  return <GRouter isAuthenticated={isAuthenticated} handleLogin={handleLogin} handleLogout={handleLogout}/>;
};
