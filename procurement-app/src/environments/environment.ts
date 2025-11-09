export const environment = {
  production: false,
  apiUrl: '/api', // Use proxy in development to avoid CORS
  keycloak: {
    url: 'https://bracusso.bracits.net',
    realm: 'usis',
    clientId: 'slm' // Use different client for development
  }
};
