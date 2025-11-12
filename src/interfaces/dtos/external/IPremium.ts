// Interfaces para el sistema de suscripción Premium

export interface IPremiumSubscription {
  id?: string; // ID de Firestore
  userId: string; // ID del usuario
  startDate: Date; // Fecha de inicio de la suscripción
  endDate: Date; // Fecha de fin de la suscripción
  paidDate: Date; // Fecha del último pago
  price: number; // Precio pagado
  status: 'active' | 'expired' | 'cancelled'; // Estado de la suscripción
  mercadoPagoSubscriptionId?: string; // ID de suscripción de Mercado Pago
  mercadoPagoPaymentId?: string; // ID del pago en Mercado Pago
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAccount {
  id?: string; // ID de Firestore (account_id)
  accountPrice: number; // account_price
  accountType: 'free' | 'premium'; // account_type
  premiumId?: string; // premium_premium_id (referencia a premium)
  userId: string; // users_user_id
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IMercadoPagoPreference {
  id: string;
  init_point: string; // URL para redirigir al usuario
  sandbox_init_point: string; // URL para testing
}

export interface IMercadoPagoNotification {
  action: string;
  api_version: string;
  data: {
    id: string; // ID del pago
  };
  date_created: string;
  id: number;
  live_mode: boolean;
  type: string; // 'payment', 'subscription', etc.
  user_id: string;
}

export interface IPremiumLimits {
  strategies: number; // -1 = ilimitado
  images: number; // -1 = ilimitado
  contacts: number; // -1 = ilimitado
  groups: number; // -1 = ilimitado
}

export const FREE_LIMITS: IPremiumLimits = {
  strategies: 5,
  images: 10,
  contacts: 50,
  groups: 3
};

export const PREMIUM_LIMITS: IPremiumLimits = {
  strategies: -1, // ilimitado
  images: -1,
  contacts: -1,
  groups: -1
};

export const PREMIUM_PRICE = 1500; // Precio mensual en pesos
