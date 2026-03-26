import { User } from '../types/auth';

export const USER_STORAGE_KEY = 'user';

export class AuthService {
  login(user: User): void {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }

  logout(): void {
    localStorage.removeItem(USER_STORAGE_KEY);
  }

  getCurrentUser(): User | null {
    const userJson = localStorage.getItem(USER_STORAGE_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }
}

// Export a singleton instance
export const authService = new AuthService();
