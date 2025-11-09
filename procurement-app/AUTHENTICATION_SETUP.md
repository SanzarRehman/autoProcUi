# Keycloak Authentication Setup

## Overview
The application uses Keycloak for authentication with automatic token management and refresh.

## Configuration

### Keycloak Server
- **URL**: https://bracusso.bracits.net
- **Realm**: usis
- **Client ID**: frontend

### How It Works

1. **Initial Login**
   - When the app starts, Keycloak checks if the user is authenticated
   - If not, redirects to Keycloak login page
   - Uses PKCE (Proof Key for Code Exchange) for enhanced security

2. **Token Storage**
   - Access token is stored in memory by Keycloak
   - Refresh token is used to get new access tokens
   - Tokens are NOT stored in localStorage for security
   - User info is extracted from token claims (no account API calls needed)

3. **Token Refresh**
   - Tokens are automatically refreshed every 60 seconds if needed
   - Before each API call, token is checked and refreshed if expiring within 70 seconds
   - If refresh fails, user is redirected to login

4. **API Calls**
   - Every API request includes:
     - `Authorization: Bearer <token>` header
     - `X-REALM: usis` header
     - `X-SOURCE: 1` header
   - Token is automatically added by the auth interceptor

## Files

- `auth.service.ts` - Main authentication service with token management
- `auth.interceptor.ts` - HTTP interceptor that adds tokens to requests
- `auth.guard.ts` - Route guard to protect authenticated routes
- `keycloak-init.factory.ts` - Keycloak initialization configuration
- `silent-check-sso.html` - Silent SSO check page

## Usage

### Check if user is logged in
```typescript
const isLoggedIn = await this.authService.isLoggedIn();
```

### Get user profile (from token - no API call)
```typescript
const profile = this.authService.getUserProfile();
// Returns: { id, username, email, firstName, lastName, emailVerified }
```

### Get specific user info from token
```typescript
const username = this.authService.getUsername();
const email = this.authService.getUserEmail();
const fullName = this.authService.getUserFullName();
const userId = this.authService.getUserId();
const roles = this.authService.getUserRoles();
```

### Get current token
```typescript
const token = this.authService.getToken();
```

### Get all token claims
```typescript
const claims = this.authService.getTokenClaims();
// Access any custom claim: claims['custom_claim_name']
```

### Manually refresh token
```typescript
const refreshed = await this.authService.refreshToken();
```

### Logout
```typescript
await this.authService.logout();
```

## Security Features

- PKCE flow for OAuth 2.0
- Automatic token refresh
- Secure token storage (memory only)
- 401 error handling with automatic re-login
- Silent SSO checks
