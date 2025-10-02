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
    
    // Guardar token si existe
    if (state.auth && state.auth.token) {
      localStorage.setItem('token', state.auth.token);
      localStorage.setItem('isLoggedIn', 'true');
      console.log('🔑 Token sincronizado con localStorage');
    }
  }
  
  // Limpiar localStorage en logout
  if (action.type === 'session/logout') {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    console.log('🧹 LocalStorage limpiado en logout');
  }
  
  return result;
};

// Función para cargar estado inicial desde localStorage
const loadInitialState = (): Partial<SessionState> => {
  try {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (storedUser && storedToken && isLoggedIn) {
      const user = JSON.parse(storedUser);
      console.log('🔄 Cargando estado inicial desde localStorage:', user);
      
      return {
        user: user,
        auth: {
          isAuthenticated: true,
          token: storedToken
        }
      };
    }
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
