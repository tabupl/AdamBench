/**
 * Storage Service
 * Handles all localStorage operations
 */

export interface User {
  id: string;
  username: string;
  email: string;
}

export const STORAGE_KEY = 'user';

export const storageService = {
  get() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  set(user: User) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  },

  clear() {
    localStorage.removeItem(STORAGE_KEY);
  },
};