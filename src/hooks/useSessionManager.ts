import { useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/sessionSlice';
import AuthFirestoreService from '../services/external/authFirestoreService';

interface UseSessionManagerProps {
  token: string | null;
  isAuthenticated: boolean;
  onLogout?: () => void;
}

export const useSessionManager = ({ token, isAuthenticated, onLogout }: UseSessionManagerProps) => {
  const dispatch = useDispatch();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  
  // Tiempo de inactividad: 5 minutos
  const INACTIVITY_TIMEOUT = 5 * 60 * 1000;

  /**
   * Cerrar sesión por inactividad
   */
  const handleInactivityLogout = useCallback(async () => {
    if (token) {
      try {
        await AuthFirestoreService.logout(token);
      } catch (error) {
        console.error('Error al cerrar sesión en Firestore:', error);
      }
    }
    
    dispatch(logout());
    onLogout?.();
  }, [token, dispatch, onLogout]);

  /**
   * Resetear el timer de inactividad
   */
  const resetInactivityTimer = useCallback(() => {
    if (!isAuthenticated) return;

    // Limpiar timer anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Actualizar última actividad
    lastActivityRef.current = Date.now();

    // Configurar nuevo timer
    timeoutRef.current = setTimeout(() => {
      handleInactivityLogout();
    }, INACTIVITY_TIMEOUT);
  }, [isAuthenticated, handleInactivityLogout, INACTIVITY_TIMEOUT]);

  /**
   * Manejar eventos de actividad del usuario
   */
  const handleUserActivity = useCallback(() => {
    if (!isAuthenticated) return;
    
    const now = Date.now();
    const timeSinceLastActivity = now - lastActivityRef.current;
    
    // Solo resetear si han pasado más de 30 segundos desde la última actividad
    // Esto evita resetear el timer constantemente
    if (timeSinceLastActivity > 30000) {
      resetInactivityTimer();
    }
  }, [isAuthenticated, resetInactivityTimer]);

  /**
   * Validar sesión periódicamente
   */
  const validateSessionPeriodically = useCallback(async () => {
    if (!token || !isAuthenticated) return;

    try {
      const sessionData = await AuthFirestoreService.validateSession(token);
      
      if (!sessionData) {
        handleInactivityLogout();
      }
    } catch (error) {
      handleInactivityLogout();
    }
  }, [token, isAuthenticated, handleInactivityLogout]);

  // Configurar listeners de actividad del usuario
  useEffect(() => {
    if (!isAuthenticated) return;

    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    // Agregar listeners
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, true);
    });

    // Inicializar timer
    resetInactivityTimer();

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity, true);
      });
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isAuthenticated, handleUserActivity, resetInactivityTimer]);

  // Validación periódica de sesión (cada 2 minutos)
  useEffect(() => {
    if (!isAuthenticated) return;

    const validationInterval = setInterval(validateSessionPeriodically, 2 * 60 * 1000);

    return () => {
      clearInterval(validationInterval);
    };
  }, [isAuthenticated, validateSessionPeriodically]);

  // Limpiar timer al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    resetInactivityTimer,
    handleUserActivity,
    validateSessionPeriodically
  };
};

export default useSessionManager;
