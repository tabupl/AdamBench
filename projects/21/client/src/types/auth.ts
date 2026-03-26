// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

// Authentication state
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Login request
export interface LoginCredentials {
  email: string;
  password: string;
}

// Login response
export interface LoginResponse {
  user: User;
  token?: string; // Optional token for future use
}

// Auth context value
export interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}
