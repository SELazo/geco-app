import { configureStore } from '@reduxjs/toolkit';
import { sessionSlice } from './sessionSlice';

// Define el tipo de RootState
export type RootState = {
  auth: ReturnType<typeof sessionSlice.reducer>;
};

// Crea el store
export const gecoStore = configureStore({
  reducer: {
    auth: sessionSlice.reducer,
  },
});

// Exporta el tipo de dispatch
export type AppDispatch = typeof gecoStore.dispatch;

export default gecoStore;
