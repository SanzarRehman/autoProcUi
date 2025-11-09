import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';

/**
 * Centralized error handling service
 * Handles different types of errors and displays user-friendly messages
 */
@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private authService = inject(AuthService);

  /**
   * Handles errors and displays appropriate messages
   * @param error The error object to handle
   * @param customMessage Optional custom message to display
   */
  handleError(error: any, customMessage?: string): void {
    let message = customMessage || 'An error occurred. Please try again.';

    // Log error to console for debugging
    console.error('Error occurred:', error);

    if (error instanceof HttpErrorResponse) {
      // Handle HTTP errors
      if (error.status === 401) {
        // Authentication error
        message = 'Authentication failed. Please log in again.';
        this.showError(message);
        this.handleAuthenticationError();
        return;
      } else if (error.status === 403) {
        // Authorization error
        message = 'You do not have permission to perform this action.';
      } else if (error.status === 404) {
        // Not found error
        message = 'The requested resource was not found.';
      } else if (error.status === 0) {
        // Network error
        message = 'Network error. Please check your internet connection.';
      } else if (error.status >= 500) {
        // Server error
        message = 'Server error. Please try again later.';
      } else if (error.error?.message) {
        // Use error message from API if available
        message = error.error.message;
      } else if (error.message) {
        message = error.message;
      }
    } else if (error?.message) {
      // Handle generic errors with message property
      message = error.message;
    }

    this.showError(message);
  }

  /**
   * Displays an error message using Material Snackbar
   * @param message The error message to display
   */
  showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }

  /**
   * Displays a success message using Material Snackbar
   * @param message The success message to display
   */
  showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  /**
   * Displays an info message using Material Snackbar
   * @param message The info message to display
   */
  showInfo(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['info-snackbar']
    });
  }

  /**
   * Handles authentication errors by redirecting to login
   */
  private handleAuthenticationError(): void {
    // Clear any cached data if needed
    // Redirect to login after a short delay
    setTimeout(() => {
      this.authService.login();
    }, 2000);
  }

  /**
   * Handles network errors
   */
  handleNetworkError(): void {
    this.showError('Network error. Please check your internet connection and try again.');
  }
}
