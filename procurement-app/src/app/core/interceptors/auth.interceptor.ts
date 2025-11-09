import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { catchError, throwError } from 'rxjs';

// Track refresh attempts to prevent infinite loops
let refreshAttempts = 0;
const MAX_REFRESH_ATTEMPTS = 3;
let lastRefreshTime = 0;
const REFRESH_COOLDOWN = 5000; // 5 seconds cooldown between refresh attempts

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const keycloakService = inject(KeycloakService);

  // Skip for excluded URLs
  if (req.url.includes('/assets') || req.url.includes('silent-check-sso')) {
    return next(req);
  }

  // Get the Keycloak instance
  const keycloakInstance = keycloakService.getKeycloakInstance();
  const token = keycloakInstance.token;
  
  if (token) {
    // Clone the request and add custom headers
    const clonedRequest = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`,
        'X-REALM': 'usis',
        'X-SOURCE': '1'
      }
    });
    
    return next(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('HTTP Error:', error);
        
        // Handle 401 errors - but prevent infinite loops
        if (error.status === 401) {
          const now = Date.now();
          
          // Check if we're in cooldown period
          if (now - lastRefreshTime < REFRESH_COOLDOWN) {
            console.warn('Token refresh in cooldown period, skipping');
            return throwError(() => error);
          }
          
          // Check if we've exceeded max attempts
          if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
            console.error('Max refresh attempts reached - redirecting to login');
            refreshAttempts = 0;
            lastRefreshTime = 0;
            setTimeout(() => keycloakService.login(), 1000);
            return throwError(() => error);
          }
          
          // Try to refresh token
          refreshAttempts++;
          lastRefreshTime = now;
          
          console.log(`Attempting token refresh (attempt ${refreshAttempts}/${MAX_REFRESH_ATTEMPTS})`);
          
          keycloakInstance.updateToken(70)
            .then((refreshed) => {
              if (refreshed) {
                console.log('Token refreshed successfully');
                refreshAttempts = 0; // Reset on success
              }
            })
            .catch((refreshError) => {
              console.error('Token refresh failed:', refreshError);
              if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
                refreshAttempts = 0;
                lastRefreshTime = 0;
                setTimeout(() => keycloakService.login(), 1000);
              }
            });
        }
        
        return throwError(() => error);
      })
    );
  }

  return next(req);
};
