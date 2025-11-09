import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private keycloakService: KeycloakService) {
    // Set up automatic token refresh
    this.setupTokenRefresh();
  }

  /**
   * Set up automatic token refresh
   * Refreshes token every 60 seconds if it's about to expire
   */
  private setupTokenRefresh(): void {
    setInterval(() => {
      this.refreshToken();
    }, 60000); // Check every 60 seconds
  }

  /**
   * Manually refresh the token if it's about to expire
   * @param minValidity Minimum validity in seconds (default: 70)
   */
  async refreshToken(minValidity: number = 70): Promise<boolean> {
    try {
      const keycloakInstance = this.keycloakService.getKeycloakInstance();
      const refreshed = await keycloakInstance.updateToken(minValidity);
      
      if (refreshed) {
        console.log('Token refreshed successfully');
        // Store the new token in session storage for debugging
        if (keycloakInstance.token) {
          sessionStorage.setItem('kc_token', keycloakInstance.token);
        }
      }
      
      return refreshed;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      // If refresh fails, redirect to login
      await this.login();
      return false;
    }
  }

  /**
   * Get user profile from token claims (no API call needed)
   */
  getUserProfile(): KeycloakProfile | null {
    try {
      const isLoggedIn = this.keycloakService.getKeycloakInstance().authenticated;
      if (!isLoggedIn) {
        return null;
      }

      const tokenParsed = this.keycloakService.getKeycloakInstance().tokenParsed;
      if (!tokenParsed) {
        return null;
      }

      // Extract user info from token claims
      return {
        id: tokenParsed['sub'],
        username: tokenParsed['preferred_username'],
        email: tokenParsed['email'],
        firstName: tokenParsed['given_name'],
        lastName: tokenParsed['family_name'],
        emailVerified: tokenParsed['email_verified'],
        // Add any other custom claims from your token
      } as KeycloakProfile;
    } catch (error) {
      console.error('Error extracting user profile from token:', error);
      return null;
    }
  }

  /**
   * Get user roles from token
   */
  getUserRoles(): string[] {
    return this.keycloakService.getUserRoles();
  }

  /**
   * Get username from token
   */
  getUsername(): string {
    const tokenParsed = this.keycloakService.getKeycloakInstance().tokenParsed;
    return tokenParsed?.['preferred_username'] || '';
  }

  /**
   * Get user email from token
   */
  getUserEmail(): string {
    const tokenParsed = this.keycloakService.getKeycloakInstance().tokenParsed;
    return tokenParsed?.['email'] || '';
  }

  /**
   * Get user's full name from token
   */
  getUserFullName(): string {
    const tokenParsed = this.keycloakService.getKeycloakInstance().tokenParsed;
    const firstName = tokenParsed?.['given_name'] || '';
    const lastName = tokenParsed?.['family_name'] || '';
    return `${firstName} ${lastName}`.trim() || tokenParsed?.['name'] || '';
  }

  /**
   * Get user ID (subject) from token
   */
  getUserId(): string {
    const tokenParsed = this.keycloakService.getKeycloakInstance().tokenParsed;
    return tokenParsed?.['sub'] || '';
  }

  /**
   * Get all token claims
   */
  getTokenClaims(): any {
    return this.keycloakService.getKeycloakInstance().tokenParsed;
  }

  async login(): Promise<void> {
    await this.keycloakService.login();
  }

  async logout(): Promise<void> {
    // Clear stored token
    sessionStorage.removeItem('kc_token');
    await this.keycloakService.logout(window.location.origin);
  }

  async isLoggedIn(): Promise<boolean> {
    return await this.keycloakService.isLoggedIn();
  }

  /**
   * Get the current access token
   */
  getToken(): string | undefined {
    return this.keycloakService.getKeycloakInstance().token;
  }

  /**
   * Get the refresh token
   */
  getRefreshToken(): string | undefined {
    return this.keycloakService.getKeycloakInstance().refreshToken;
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(): boolean {
    return this.keycloakService.getKeycloakInstance().isTokenExpired();
  }

  /**
   * Get token expiration time in seconds
   */
  getTokenExpirationTime(): number | undefined {
    const keycloakInstance = this.keycloakService.getKeycloakInstance();
    return keycloakInstance.tokenParsed?.exp;
  }
}
