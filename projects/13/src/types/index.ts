// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

// Login credentials interface
export interface LoginCredentials {
  email: string;
  password: string;
}

// Auth state interface
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Auth context type
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  clearSession: () => void;
  loginSuccess: boolean;
  loginFailure: boolean;
}

// Auth error types
export enum AuthError {
  INVALID_CREDENTIALS = 'Invalid credentials',
  NETWORK_ERROR = 'Network error',
  SESSION_EXPIRED = 'Session expired',
  UNAUTHORIZED = 'Unauthorized',
}

// Service interface for authentication
export interface AuthServiceInterface {
  login(credentials: LoginCredentials): Promise<User | null>;
  logout(): void;
  getCurrentUser(): User | null;
  clearSession(): void;
  loadUserFromStorage(): Promise<User | null>;
}

// User database entry
export interface UserDatabaseEntry {
  email: string;
  password: string;
  name: string;
}
