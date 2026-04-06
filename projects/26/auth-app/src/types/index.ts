// Type definitions for authentication app

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export type AuthError =
  | { type: 'invalid_credentials'; message: string }
  | { type: 'network_error'; message: string }
  | { type: 'unknown_error'; message: string };

export interface UseProtectedRouteOptions {
  requireAuth: boolean;
  redirectUnauthorized?: (to: string) => void;
  redirectError?: (to: string) => void;
}

export interface UseProtectedRouteReturn {
  isAuthorized: boolean;
  error: string | null;
  isLoading: boolean;
}

export interface PublicRouteReturn {
  isPublic: boolean;
  isLoading: boolean;
}

// Namespace for window globals
namespace Window {
  interface Global {
    authToken?: string;
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  interface Window extends Window.Global {}
}