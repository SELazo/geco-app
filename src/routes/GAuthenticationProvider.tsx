import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { PacmanLoader } from 'react-spinners';
import { GRouter } from './GRouter';
import { SessionService } from '../services/internal/sessionService';
import { Auth, User, loginSuccess, logout } from '../redux/sessionSlice';
import { useDispatch, useSelector } from 'react-redux';
import { GYellow } from '../constants/palette';
import useSessionManager from '../hooks/useSessionManager';
import { RootState } from '../redux/gecoStore';

const getAuthenticationStatus = async (): Promise<boolean> => {
  const storedToken = SessionService.getToken();
  const isAuthenticated = await SessionService.validateSession(storedToken);
  return isAuthenticated;
};

export const GAuthenticationProvider = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  
  // Obtener estado de autenticación desde Redux
  const authState = useSelector((state: RootState) => state.auth);
  const token = authState?.token;

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
    dispatch(logout());
    setIsAuthenticated(false);
  };

  // Hook para manejo de inactividad y control de sesiones
  useSessionManager({
    token: token || null,
    isAuthenticated,
    onLogout: handleLogout
  });

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
