import { getFunctions, httpsCallable } from 'firebase/functions';
import { initializeApp, getApps } from 'firebase/app';

// Configuración de Firebase (si no está ya inicializado)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Inicializar Firebase solo si no está inicializado
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const functions = getFunctions();

export interface IPremiumPreferenceResponse {
  preferenceId: string;
  initPoint: string;
  sandboxInitPoint: string;
}

export const PremiumService = {
  /**
   * Crea una preferencia de pago en Mercado Pago
   * @returns URL para redirigir al usuario al pago
   */
  createPaymentPreference: async (): Promise<IPremiumPreferenceResponse> => {
    try {
      console.log('🎯 Creando preferencia de pago premium...');
      
      const createPreference = httpsCallable<any, IPremiumPreferenceResponse>(
        functions,
        'createPremiumPreference'
      );
      
      const result = await createPreference();
      
      console.log('✅ Preferencia creada:', result.data);
      return result.data;
      
    } catch (error: any) {
      console.error('❌ Error creando preferencia de pago:', error);
      throw new Error(error.message || 'Error al crear preferencia de pago');
    }
  },

  /**
   * Abre el checkout de Mercado Pago en una nueva ventana
   * @param initPoint URL del checkout
   */
  openCheckout: (initPoint: string): void => {
    // Abrir en la misma ventana (más confiable)
    window.location.href = initPoint;
    
    // O abrir en nueva pestaña:
    // window.open(initPoint, '_blank');
  },

  /**
   * Inicia el flujo completo de pago premium
   */
  startPremiumCheckout: async (): Promise<void> => {
    try {
      const preference = await PremiumService.createPaymentPreference();
      
      // En desarrollo, usar sandbox, en producción usar init_point
      const checkoutUrl = import.meta.env.DEV 
        ? preference.sandboxInitPoint 
        : preference.initPoint;
      
      PremiumService.openCheckout(checkoutUrl);
      
    } catch (error) {
      console.error('❌ Error iniciando checkout premium:', error);
      throw error;
    }
  }
};
