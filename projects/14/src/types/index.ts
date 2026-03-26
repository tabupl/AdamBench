// User type
export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
}

// Authentication state type
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Login form data
export interface LoginForm {
  email: string;
  password: string;
}

// Auth context type
export type AuthContextType = AuthState & {
  login: (formData: LoginForm) => Promise<void>;
  logout: () => void;
};
