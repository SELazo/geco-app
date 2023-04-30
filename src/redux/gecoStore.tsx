import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './authSlice';

// Define el tipo de RootState
export type RootState = {
  auth: ReturnType<typeof authSlice.reducer>;
};

// Crea el store
export const gecoStore = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});

// Exporta el tipo de dispatch
export type AppDispatch = typeof gecoStore.dispatch;

export default gecoStore;
