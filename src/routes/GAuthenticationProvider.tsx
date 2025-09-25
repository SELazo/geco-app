import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { PacmanLoader } from 'react-spinners';
import { GRouter } from './GRouter';
import { SessionService } from '../services/internal/sessionService';
import { Auth, User, loginSuccess } from '../redux/sessionSlice';
import { useDispatch } from 'react-redux';
import { GYellow } from '../constants/palette';

const getAuthenticationStatus = async (): Promise<boolean> => {
  const storedToken = SessionService.getToken();
  const isAuthenticated = await SessionService.validateSession(storedToken);
  return isAuthenticated;
};

export const GAuthenticationProvider = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
      setIsLoading(false);
    };

    fetchAuthenticationStatus();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: '#D9D9D9',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <PacmanLoader color={GYellow} size={30} loading={true} />
      </Box>
    );
  }

  return (
    <GRouter
      isAuthenticated={isAuthenticated}
      handleLogin={handleLogin}
      handleLogout={handleLogout}
    />
  );
};
