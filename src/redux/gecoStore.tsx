import { configureStore } from '@reduxjs/toolkit';
import { sessionSlice, SessionState } from './sessionSlice';

// Define el tipo de RootState
export type RootState = SessionState;

// Middleware para sincronizar con localStorage
const localStorageMiddleware = (store: any) => (next: any) => (action: any) => {
  const result = next(action);
  
  // Sincronizar con localStorage cuando cambie el usuario o auth
  if (action.type === 'session/setUser' || action.type === 'session/loginSuccess') {
    const state = store.getState();
    
    // Guardar usuario en localStorage
    if (state.user && state.user.id !== -1) {
      localStorage.setItem('user', JSON.stringify(state.user));
      console.log('💾 Usuario sincronizado con localStorage:', state.user);
    }
    
    // Guardar token y timestamp de expiración (1 hora)
    if (state.auth && state.auth.token) {
      const expirationTime = Date.now() + (60 * 60 * 1000); // 1 hora
      localStorage.setItem('token', state.auth.token);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('sessionExpiration', expirationTime.toString());
      console.log('🔑 Token sincronizado con localStorage (expira en 1 hora)');
    }
  }
  
  // Extender sesión cuando hay actividad
  if (action.type === 'session/extendSession') {
    const state = store.getState();
    if (state.auth && state.auth.token) {
      const expirationTime = Date.now() + (60 * 60 * 1000); // 1 hora desde ahora
      localStorage.setItem('sessionExpiration', expirationTime.toString());
      console.log('⏱️ Sesión extendida por 1 hora más');
    }
  }
  
  // Limpiar localStorage en logout
  if (action.type === 'session/logout') {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('sessionExpiration');
    console.log('🧹 LocalStorage limpiado en logout');
  }
  
  return result;
};

// Función para cargar estado inicial desde localStorage
const loadInitialState = (): Partial<SessionState> => {
  try {
    console.log('🔄 Iniciando carga de estado desde localStorage...');
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const sessionExpiration = localStorage.getItem('sessionExpiration');
    
    console.log('📦 localStorage - user:', storedUser ? 'Disponible' : 'No disponible');
    console.log('📦 localStorage - token:', storedToken ? 'Disponible' : 'No disponible');
    console.log('📦 localStorage - isLoggedIn:', isLoggedIn);
    
    // Verificar si la sesión no ha expirado
    if (sessionExpiration) {
      const expirationTime = parseInt(sessionExpiration, 10);
      const now = Date.now();
      
      if (now > expirationTime) {
        console.log('⏰ Sesión expirada, limpiando localStorage');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('sessionExpiration');
        return {};
      }
    }
    
    if (storedUser && storedToken && isLoggedIn) {
      const user = JSON.parse(storedUser);
      console.log('✅ Usuario cargado desde localStorage:', user);
      const timeRemaining = sessionExpiration ? Math.round((parseInt(sessionExpiration, 10) - Date.now()) / 60000) : 'desconocido';
      console.log(`⏱️ Tiempo restante de sesión: ${timeRemaining} minutos`);
      
      return {
        user: user,
        auth: {
          isAuthenticated: true,
          token: storedToken
        }
      };
    }
    
    console.log('⚠️ No se pudo cargar el estado del usuario desde localStorage');
    return {};
  } catch (error) {
    console.error('❌ Error cargando estado inicial:', error);
  }
  
  return {};
};

// Crea el store con estado inicial
export const gecoStore = configureStore({
  reducer: sessionSlice.reducer,
  preloadedState: {
    ...sessionSlice.getInitialState(),
    ...loadInitialState()
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});

// Hacer el store disponible globalmente para debugging
(window as any).__REDUX_STORE__ = gecoStore;

// Exporta el tipo de dispatch
export type AppDispatch = typeof gecoStore.dispatch;

export default gecoStore;
