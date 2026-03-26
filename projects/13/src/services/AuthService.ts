import { User, LoginCredentials } from '../types';

// Interface for the authentication service
export interface AuthServiceInterface {
  login(credentials: LoginCredentials): Promise<User | null>;
  logout(): void;
  getCurrentUser(): User | null;
  clearSession(): void;
}

// Fake users database for demo purposes
interface UserDatabase {
  [key: string]: {
    email: string;
    password: string;
    name: string;
  };
}

const USER_DB: UserDatabase = {
  '1': { email: 'admin@omnicoder.com', password: 'password123', name: 'Admin User' },
  '2': { email: 'user@omnicoder.com', password: 'password123', name: 'Regular User' },
  '3': { email: 'test@example.com', password: 'test123', name: 'Test User' },
};

// Configuration for storage keys
const STORAGE_KEYS = {
  USER: 'omnicoder_user',
  SESSION_ID: 'omnicoder_session',
} as const;

// Simulate network delay (for testing, can be overridden)
const NETWORK_DELAY = 500;

// Auth error types
export enum AuthError {
  INVALID_CREDENTIALS = 'Invalid credentials',
  NETWORK_ERROR = 'Network error',
  SESSION_EXPIRED = 'Session expired',
  UNAUTHORIZED = 'Unauthorized',
}

export class AuthService implements AuthServiceInterface {
  private user: User | null = null;

  /**
   * Authenticate user with provided credentials
   */
  async login(credentials: LoginCredentials): Promise<User | null> {
    // Validate input
    if (!credentials.email || !credentials.password) {
      throw new Error(AuthError.INVALID_CREDENTIALS);
    }

    // Simulate network delay
    await this.delay(NETWORK_DELAY);

    // Find user in database
    const userRecord = this.findUserByEmail(credentials.email);
    
    if (!userRecord || userRecord.password !== credentials.password) {
      throw new Error(AuthError.INVALID_CREDENTIALS);
    }

    // Create user object with ID and avatar
    const userId = this.getNextUserId();
    this.user = {
      id: userId,
      email: credentials.email,
      name: userRecord.name,
      avatar: this.generateAvatar(userRecord.name),
    };

    return this.user;
  }

  /**
   * Logout current user
   */
  logout(): void {
    this.user = null;
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.user;
  }

  /**
   * Clear all session data
   */
  clearSession(): void {
    this.user = null;
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.SESSION_ID);
  }

  /**
   * Load user from storage (for session persistence)
   */
  async loadUserFromStorage(): Promise<User | null> {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (!storedUser) {
        return null;
      }

      const parsedUser = JSON.parse(storedUser);
      
      // Validate user data
      if (!parsedUser.id || !parsedUser.email || !parsedUser.name) {
        this.clearSession();
        return null;
      }

      // Validate against database (password check)
      const userRecord = this.findUserByEmail(parsedUser.email);
      if (!userRecord || userRecord.password !== parsedUser._password) {
        this.clearSession();
        return null;
      }

      // Update user with current avatar
      this.user = {
        ...parsedUser,
        avatar: this.generateAvatar(parsedUser.name),
      };

      // Remove temporary password from storage
      const userData = JSON.parse(storedUser);
      delete userData._password;
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));

      return this.user;
    } catch (error) {
      console.error('Failed to load user from storage:', error);
      this.clearSession();
      return null;
    }
  }

  /**
   * Private: Find user by email in database
   */
  private findUserByEmail(email: string): { email: string; password: string; name: string } | undefined {
    return Object.values(USER_DB).find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
  }

  /**
   * Private: Get next available user ID
   */
  private getNextUserId(): string {
    const existingIds = Object.keys(USER_DB);
    let id = 3;
    
    while (existingIds.includes(String(id))) {
      id++;
    }
    
    return String(id);
  }

  /**
   * Private: Generate avatar URL from name
   */
  private generateAvatar(name: string): string {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0066cc&color=fff`;
  }

  /**
   * Private: Simulate network delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Singleton instance
export const authService = new AuthService();

export default authService;
