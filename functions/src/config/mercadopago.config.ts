import * as functions from 'firebase-functions';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

// Configuración de Mercado Pago
// Las credenciales se obtienen de: https://www.mercadopago.com.ar/developers/panel/credentials

const accessToken = functions.config().mercadopago?.access_token || process.env.MERCADOPAGO_ACCESS_TOKEN;

if (!accessToken) {
  console.warn('⚠️ MERCADOPAGO_ACCESS_TOKEN no configurado');
}

// Inicializar cliente de Mercado Pago
export const mercadoPagoClient = new MercadoPagoConfig({
  accessToken: accessToken || '',
  options: {
    timeout: 5000,
  }
});

export const paymentClient = new Payment(mercadoPagoClient);
export const preferenceClient = new Preference(mercadoPagoClient);

// URLs de tu aplicación (cambiar en producción)
export const APP_URL = functions.config().app?.url || process.env.APP_URL || 'https://geco-bf931.web.app';

export const WEBHOOK_URL = `${APP_URL}/api/mercadopago/webhook`;

// URLs de retorno después del pago
export const SUCCESS_URL = `${APP_URL}/premium/success`;
export const FAILURE_URL = `${APP_URL}/premium/failure`;
export const PENDING_URL = `${APP_URL}/premium/pending`;
