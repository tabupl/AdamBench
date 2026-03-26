export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface LoginFormData {
  username: string;
  password: string;
}
