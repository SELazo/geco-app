import { getFirestore, doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { FREE_LIMITS, PREMIUM_LIMITS, IPremiumLimits, IAccount } from '../../interfaces/dtos/external/IPremium';

const db = getFirestore();

export const AccountService = {
  /**
   * Obtiene la cuenta del usuario actual
   */
  getCurrentAccount: async (): Promise<IAccount | null> => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.warn('⚠️ Usuario no autenticado');
        return null;
      }

      const userId = user.uid;
      console.log('🔍 Obteniendo cuenta para usuario:', userId);

      // Buscar cuenta por userId
      const accountsRef = collection(db, 'accounts');
      const q = query(accountsRef, where('userId', '==', userId), limit(1));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.warn('⚠️ Usuario sin cuenta registrada');
        return null;
      }

      const accountDoc = querySnapshot.docs[0];
      const accountData = accountDoc.data();

      return {
        id: accountDoc.id,
        accountPrice: accountData.accountPrice || 0,
        accountType: accountData.accountType || 'free',
        premiumId: accountData.premiumId,
        userId: accountData.userId,
        createdAt: accountData.createdAt?.toDate(),
        updatedAt: accountData.updatedAt?.toDate()
      };

    } catch (error) {
      console.error('❌ Error obteniendo cuenta:', error);
      return null;
    }
  },

  /**
   * Verifica si el usuario tiene cuenta premium activa
   */
  isPremium: async (): Promise<boolean> => {
    try {
      const account = await AccountService.getCurrentAccount();
      return account?.accountType === 'premium';
    } catch (error) {
      console.error('❌ Error verificando premium:', error);
      return false;
    }
  },

  /**
   * Obtiene los límites del plan actual del usuario
   */
  getCurrentLimits: async (): Promise<IPremiumLimits> => {
    try {
      const isPremium = await AccountService.isPremium();
      return isPremium ? PREMIUM_LIMITS : FREE_LIMITS;
    } catch (error) {
      console.error('❌ Error obteniendo límites:', error);
      return FREE_LIMITS; // Por defecto, límites free
    }
  },

  /**
   * Verifica si el usuario puede crear más estrategias
   * @param currentCount Número actual de estrategias
   */
  canCreateStrategy: async (currentCount: number): Promise<boolean> => {
    try {
      const limits = await AccountService.getCurrentLimits();
      
      // -1 significa ilimitado
      if (limits.strategies === -1) {
        return true;
      }

      return currentCount < limits.strategies;
    } catch (error) {
      console.error('❌ Error verificando límite de estrategias:', error);
      return false;
    }
  },

  /**
   * Verifica si el usuario puede crear más imágenes/publicidades
   * @param currentCount Número actual de imágenes
   */
  canCreateImage: async (currentCount: number): Promise<boolean> => {
    try {
      const limits = await AccountService.getCurrentLimits();
      
      if (limits.images === -1) {
        return true;
      }

      return currentCount < limits.images;
    } catch (error) {
      console.error('❌ Error verificando límite de imágenes:', error);
      return false;
    }
  },

  /**
   * Verifica si el usuario puede crear más contactos
   * @param currentCount Número actual de contactos
   */
  canCreateContact: async (currentCount: number): Promise<boolean> => {
    try {
      const limits = await AccountService.getCurrentLimits();
      
      if (limits.contacts === -1) {
        return true;
      }

      return currentCount < limits.contacts;
    } catch (error) {
      console.error('❌ Error verificando límite de contactos:', error);
      return false;
    }
  },

  /**
   * Verifica si el usuario puede crear más grupos
   * @param currentCount Número actual de grupos
   */
  canCreateGroup: async (currentCount: number): Promise<boolean> => {
    try {
      const limits = await AccountService.getCurrentLimits();
      
      if (limits.groups === -1) {
        return true;
      }

      return currentCount < limits.groups;
    } catch (error) {
      console.error('❌ Error verificando límite de grupos:', error);
      return false;
    }
  },

  /**
   * Obtiene el mensaje de error cuando se alcanza un límite
   */
  getLimitMessage: (feature: 'strategies' | 'images' | 'contacts' | 'groups'): string => {
    const messages = {
      strategies: 'Has alcanzado el límite de 5 estrategias en el plan FREE. Actualiza a PREMIUM para crear estrategias ilimitadas.',
      images: 'Has alcanzado el límite de 10 imágenes en el plan FREE. Actualiza a PREMIUM para crear imágenes ilimitadas.',
      contacts: 'Has alcanzado el límite de 50 contactos en el plan FREE. Actualiza a PREMIUM para gestionar contactos ilimitados.',
      groups: 'Has alcanzado el límite de 3 grupos en el plan FREE. Actualiza a PREMIUM para crear grupos ilimitados.'
    };

    return messages[feature];
  }
};
