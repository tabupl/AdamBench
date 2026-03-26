export interface AuthState {
  user: import('./auth').User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export * from './auth';
