export const environment = {
  authServiceURI: import.meta.env.VITE_AUTH_SERVICE_URI || 'https://us-central1-geco-bf931.cloudfunctions.net/api/auth-api',
  contactsApiURI: import.meta.env.VITE_CONTACTS_API_URI || 'https://us-central1-geco-bf931.cloudfunctions.net/api/contacts-api',
  adsServiceURI: import.meta.env.VITE_ADS_SERVICE_URI || 'https://us-central1-geco-bf931.cloudfunctions.net/api/ads-api',
  strategiesServiceURI: import.meta.env.VITE_STRATEGIES_SERVICE_URI || 'https://us-central1-geco-bf931.cloudfunctions.net/api/communication-strategies-api',
};
