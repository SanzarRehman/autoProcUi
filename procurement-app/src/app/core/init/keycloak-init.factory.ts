import { KeycloakService } from 'keycloak-angular';
import { environment } from '../../../environments/environment';

export function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: environment.keycloak.url,
        realm: environment.keycloak.realm,
        clientId: environment.keycloak.clientId
      },
      initOptions: {
        onLoad: 'login-required', // Force login if not authenticated
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silent-check-sso.html',
        checkLoginIframe: false,
        pkceMethod: 'S256',
        enableLogging: true
      },
      // Use custom interceptor instead of built-in one
      enableBearerInterceptor: false,
      bearerExcludedUrls: ['/assets', '/silent-check-sso.html']
    });
}
