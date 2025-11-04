export const environment = {
  // Servicios existentes
  authServiceURI: import.meta.env.VITE_AUTH_SERVICE_URI || 'https://us-central1-geco-bf931.cloudfunctions.net/api/auth-api',
  contactsApiURI: import.meta.env.VITE_CONTACTS_API_URI || 'https://us-central1-geco-bf931.cloudfunctions.net/api/contacts-api',
  adsServiceURI: import.meta.env.VITE_ADS_SERVICE_URI || 'https://us-central1-geco-bf931.cloudfunctions.net/api/ads-api',
  strategiesServiceURI: import.meta.env.VITE_STRATEGIES_SERVICE_URI || 'https://us-central1-geco-bf931.cloudfunctions.net/api/communication-strategies-api',
  
  // Configuración de WhatsApp Business API
  whatsapp: {
    // Obtener estos valores del panel de desarrolladores de Meta
    phoneNumberId: import.meta.env.VITE_WHATSAPP_PHONE_NUMBER_ID || '',
    accessToken: import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN || '',
    apiVersion: import.meta.env.VITE_WHATSAPP_API_VERSION || 'v17.0',
    
    // Configuración de reintentos
    retryConfig: {
      maxRetries: 3,
      initialDelay: 1000, // 1 segundo
      maxDelay: 10000,    // 10 segundos
    },
    
    // Plantillas predefinidas (opcional)
    templates: {
      WELCOME: 'welcome_message',
      APPOINTMENT_REMINDER: 'appointment_reminder',
      PROMOTION: 'special_offer',
    },
  },
};
