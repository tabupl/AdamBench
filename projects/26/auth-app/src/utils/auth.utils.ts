import { User } from '../types';

/**
 * Check if a string is a valid email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate login credentials
 */
export function validateLoginCredentials(
  email: string,
  password: string
): { valid: boolean; error?: string } {
  if (!email || !isValidEmail(email)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }

  if (!password || password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters' };
  }

  return { valid: true };
}

/**
 * Format user object for display
 */
export function formatUser(user: User | null): string {
  if (!user) {
    return 'Not logged in';
  }
  return `${user.name} (${user.email})`;
}

/**
 * Get user display name
 */
export function getUserDisplayName(user: User | null): string {
  if (!user) {
    return '';
  }
  return user.name;
}

/**
 * Check if user is logged in
 */
export function isLoggedIn(user: User | null): boolean {
  return !!user;
}

/**
 * Extract domain from email for display
 */
export function getEmailDomain(email: string): string {
  const parts = email.split('@');
  return parts.length > 1 ? parts[1] : email;
}

/**
 * Generate a user-friendly error message
 */
export function getUserError(message: string | null): string {
  if (!message) {
    return 'An unknown error occurred';
  }
  return message;
}

/**
 * Get authentication status from user object
 */
export function getAuthStatus(user: User | null): 'authenticated' | 'not-authenticated' | 'loading' {
  if (!user) {
    return 'not-authenticated';
  }
  return 'authenticated';
}