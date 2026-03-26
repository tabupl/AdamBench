/**
 * Authentication Service Module
 * Handles business logic for authentication operations
 * Can be easily mocked for testing
 */

import { User, LoginCredentials, LoginResponse, UserMock } from '../types/auth';
import { getUserStore, authStorage, AuthStorage, initMockUsersIfNeeded } from './authStorage';

// Error types
export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor() {
    super('Invalid email or password');
  }
}

// API simulation for testing
export type MockApi = {
  login: (email: string, password: string) => Promise<LoginResponse>;
  getUser: (email: string) => Promise<User>;
};

// Mutable default API - can be replaced for testing
let defaultApi: MockApi;

// Create mock API function (must be defined before defaultApi assignment)
export const createMockApi = (): MockApi => ({
  async login(email: string, password: string): Promise<LoginResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('[createMockApi.login] Email:', email, 'Password:', password);
    
    // Validate credentials (password = email for demo)
    if (password !== email) {
      throw new InvalidCredentialsError();
    }
    
    const users = getUserStore();
    const user = users.get(email.toLowerCase());
    
    console.log('[createMockApi.login] User found:', user);
    
    if (!user) {
      throw new InvalidCredentialsError();
    }
    
    return { user };
  },
  
  async getUser(email: string): Promise<User> {
    const users = getUserStore();
    const user = users.get(email.toLowerCase());
    
    if (!user) {
      throw new InvalidCredentialsError();
    }
    
    return user;
  },
});

// Initialize default API
defaultApi = createMockApi();

// Auth service instance
export const authService = {
  async login(credentials: LoginCredentials): Promise<void> {
    const api = defaultApi;
    
    console.log('[authService.login] Starting login');
    
    try {
      const response: LoginResponse = await api.login(
        credentials.email.toLowerCase(),
        credentials.password
      );
      
      console.log('[authService.login] Response received:', response);
      
      const user: User = {
        ...response.user,
        id: String(response.user.id),
      };
      
      console.log('[authService.login] Setting stored user:', user);
      authStorage.setStoredUser(response.user);
    } catch (error) {
      console.error('[authService.login] Error:', error);
      throw error;
    }
  },
  
  logout(): void {
    console.log('[authService.logout] Calling logout');
    authStorage.removeStoredUser();
  },
  
  isAuthenticated(): boolean {
    const stored = authStorage.getStoredUser();
    console.log('[authService.isAuthenticated] Stored user:', stored);
    return !!stored;
  },
  
  getCurrentUser(): User | null {
    const stored = authStorage.getStoredUser();
    console.log('[authService.getCurrentUser] Stored user:', stored);
    if (!stored) {
      console.log('[authService.getCurrentUser] No user found');
      return null;
    }
    
    const user = {
      ...stored,
      id: String(stored.id),
    };
    console.log('[authService.getCurrentUser] Returning user:', user);
    return user;
  },
  
  // Utility for testing - replace the API implementation
  setMockApi(api: MockApi): void {
    defaultApi = api;
  },
};

// Initialize mock users when module loads
console.log('[authService] Module loaded');
initMockUsersIfNeeded();
