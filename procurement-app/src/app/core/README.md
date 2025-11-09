# Core Module

This directory contains the core functionality for the procurement application.

## Authentication

### Keycloak Configuration

The application uses Keycloak for authentication and authorization. The configuration is managed through:

1. **Environment Files** (`src/environments/`)
   - `environment.ts` - Development configuration
   - `environment.prod.ts` - Production configuration

2. **Keycloak Initialization** (`core/init/keycloak-init.factory.ts`)
   - Initializes Keycloak before the Angular app bootstraps
   - Configured with `check-sso` to check if user is already logged in
   - Uses PKCE (Proof Key for Code Exchange) for enhanced security
   - Handles token refresh automatically

3. **Auth Guard** (`core/guards/auth.guard.ts`)
   - Protects routes from unauthenticated access
   - Redirects to Keycloak login if user is not authenticated
   - Preserves the original URL for redirect after login

4. **Auth Interceptor** (`core/interceptors/auth.interceptor.ts`)
   - Automatically adds the following headers to all HTTP requests:
     - `Authorization: Bearer <token>`
     - `X-REALM: usis`
     - `X-SOURCE: 1`

5. **Auth Service** (`core/services/auth.service.ts`)
   - Provides methods for:
     - Getting user profile
     - Getting user roles
     - Login/Logout
     - Checking authentication status
     - Getting access token

### Token Management

- Tokens are stored in memory (not localStorage) for security
- Automatic token refresh is handled by Keycloak
- Token expiration redirects user to login page
- Silent SSO check is performed using `silent-check-sso.html`

### Usage

To protect a route, add the `authGuard` to the route configuration:

```typescript
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'tasks',
    canActivate: [authGuard],
    component: TasksComponent
  }
];
```

To use the AuthService in a component:

```typescript
import { AuthService } from './core/services/auth.service';

export class MyComponent {
  constructor(private authService: AuthService) {}

  async ngOnInit() {
    const profile = await this.authService.getUserProfile();
    console.log('User:', profile);
  }

  logout() {
    this.authService.logout();
  }
}
```
