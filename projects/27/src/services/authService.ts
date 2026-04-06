/**
 * Authentication Service
 * Handles authentication logic
 */

import { storageService, type User } from './storageService';

export const authService = {
  /**
   * Login a user
   */
  async login(username: string) {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 1000));

    if (!username || username.trim().length === 0) {
      throw new Error('Username is required');
    }

    if (!/^[a-zA-Z][a-zA-Z0-9_]{0,20}$/.test(username.trim())) {
      throw new Error('Invalid username format');
    }

    const user: User = {
      id: '1',
      username: username.trim(),
      email: `${username.trim().toLowerCase()}@example.com`,
    };

    storageService.set(user);
    return user;
  },

  /**
   * Logout the current user
   */
  logout() {
    storageService.clear();
  },

  /**
   * Get current user
   */
  getUser(): User | null {
    return storageService.get();
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getUser();
  },
};