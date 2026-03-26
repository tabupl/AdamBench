/**
 * Storage service for managing user authentication state
 * This separates storage logic from business logic for better testability
 */

export const StorageService = {
  /**
   * Get user from storage
   */
  getUser: (): any | null => {
    try {
      const user = localStorage.getItem('auth_user');
      if (!user) return null;
      return JSON.parse(user);
    } catch {
      return null;
    }
  },

  /**
   * Set user in storage
   */
  setUser: (user: any): void => {
    try {
      localStorage.setItem('auth_user', JSON.stringify(user));
    } catch {
      console.error('Failed to store user in localStorage');
      throw new Error('Failed to store user');
    }
  },

  /**
   * Remove user from storage
   */
  removeUser: (): void => {
    try {
      localStorage.removeItem('auth_user');
    } catch {
      console.error('Failed to remove user from localStorage');
      throw new Error('Failed to remove user');
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return StorageService.getUser() !== null;
  },

  /**
   * Clear all storage
   */
  clearStorage: (): void => {
    try {
      localStorage.clear();
    } catch {
      console.error('Failed to clear localStorage');
    }
  },

  /**
   * Simulate checking storage with a small delay
   */
  checkAuth: (): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(StorageService.isAuthenticated());
      }, 100);
    });
  },
};
