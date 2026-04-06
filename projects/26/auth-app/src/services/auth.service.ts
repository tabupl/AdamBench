import { LoginCredentials, User } from '../types/index';

// Type for authentication errors
export type AuthError =
  | { type: 'invalid_credentials'; message: string }
  | { type: 'network_error'; message: string }
  | { type: 'unknown_error'; message: string };

// Mock user database - in a real app, this would come from an API
const mockUsers: Record<string, User> = {
  'john@example.com': {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
  },
  'jane@example.com': {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
  },
};

const STORAGE_KEY = 'copaw_auth';

/**
 * Validate credentials against mock user database
 */
function validateCredentials(credentials: LoginCredentials): User | null {
  if (!mockUsers[credentials.email]) {
    return null;
  }
  return mockUsers[credentials.email];
}

/**
 * Create authentication state from user
 */
function createAuthState(user: User): { user: User; isAuthenticated: boolean; isLoading: boolean; error: string | null } {
  return {
    user,
    isAuthenticated: true,
    isLoading: false,
    error: null,
  };
}

/**
 * Clear authentication state and storage
 */
function clearAuthState(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Save authentication state to localStorage
 */
function saveAuthState(authState: { user: User; isAuthenticated: boolean; isLoading: boolean; error: string | null }): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authState));
  } catch (error: any) {
    console.error('Failed to save auth state', error.message);
  }
}

/**
 * Load authentication state from localStorage
 */
function loadAuthState(): { user: User | null; isAuthenticated: boolean; isLoading: boolean; error: string | null } | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }
    return JSON.parse(stored);
  } catch (error: any) {
    console.error('Failed to load auth state', error.message);
    return null;
  }
}

/**
 * Authenticate user with credentials
 */
async function authenticate(credentials: LoginCredentials): Promise<User> {
  // Simulate network request
  // await delay(1500);

  const user = validateCredentials(credentials);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // const token = generateToken(); // Not used anymore

  saveAuthState(createAuthState(user));

  return user;
}

// Singleton instance
let authService: AuthService | null = null;

export function getAuthService(): AuthService {
  if (!authService) {
    authService = new AuthService();
  }
  return authService;
}

export class AuthService {
  private static STORAGE_KEY = STORAGE_KEY;
  private currentUser: User | null = null;
  private static mockUsers: Record<string, User> = mockUsers;

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Login user with credentials
   */
  async login(credentials: LoginCredentials): Promise<User> {
    const user = await authenticate(credentials);
    this.currentUser = user;
    console.log('AuthService.login - User logged in:', user.email);
    return user;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    this.currentUser = null;
    this.clearStorage();
  }

  /**
   * Check if user is authenticated
   */
  async checkAuth(): Promise<boolean> {
    return this.isAuthenticated;
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Get authentication state
   */
  getAuthState(): { user: User | null; isAuthenticated: boolean; isLoading: boolean; error: string | null } {
    return {
      user: this.currentUser,
      isAuthenticated: !!this.currentUser,
      isLoading: false,
      error: null,
    };
  }

  /**
   * Validate credentials
   */
  validateCredentials(credentials: LoginCredentials): User | null {
    return validateCredentials(credentials);
  }

  /**
   * Get mock users (for testing)
   */
  static getMockUsers(): Record<string, User> {
    return AuthService.mockUsers;
  }

  /**
   * Set mock users (for testing)
   */
  static setMockUsers(users: Record<string, User>): void {
    AuthService.mockUsers = users;
  }

  /**
   * Reset authentication (useful for testing)
   */
  reset(): void {
    this.currentUser = null;
    this.clearStorage();
  }

  // Private methods
  private saveToStorage(): void {
    saveAuthState({
      user: this.currentUser,
      isAuthenticated: !!this.currentUser,
      isLoading: false,
      error: null,
    });
  }

  private loadFromStorage(): void {
    const stored = loadAuthState();
    if (stored && stored.user) {
      this.currentUser = stored.user;
    }
  }

  private clearStorage(): void {
    clearAuthState();
  }

  private get isAuthenticated(): boolean {
    return !!this.currentUser;
  }
}

export default AuthService;