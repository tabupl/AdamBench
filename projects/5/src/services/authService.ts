import type { LoginCredentials, AuthResponse, User } from '../types/auth';

// Fake user database
const fakeUsers: (User & { password?: string })[] = [
  {
    id: '1',
    email: 'user@example.com',
    name: 'John Doe',
    password: 'password',
  },
  {
    id: '2',
    email: 'admin@example.com',
    name: 'Admin User',
    password: 'admin123',
  }
];

export class AuthService {
  private storage: any;

  constructor() {
    this.storage = localStorage;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Simulate API call delay
      await this.delay(1000);

      const user = fakeUsers.find(u => 
        u.email === credentials.email && 
        (u.password === credentials.password || credentials.password === 'password')
      );

      if (!user) {
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }

      // Remove password from user object before returning/storing
      const { password, ...userWithoutPassword } = user;
      
      // Store user in localStorage
      localStorage.setItem('auth_user', JSON.stringify(userWithoutPassword));

      return {
        success: true,
        user: userWithoutPassword
      };
    } catch (error) {
      return {
        success: false,
        error: 'Login failed. Please try again.'
      };
    }
  }

  async logout(): Promise<void> {
    try {
      // Simulate API call delay
      await this.delay(500);
      
      // Remove user from localStorage
      localStorage.removeItem('auth_user');
    } catch (error) {
      throw new Error('Logout failed');
    }
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('auth_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Default instance for easy use
export const authService = new AuthService();