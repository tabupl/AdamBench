import { createContext, useContext, useMemo, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, LoginCredentials } from '../types';

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

// Create context with default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider props
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthContext Provider
 * 
 * Wraps the application to provide authentication context.
 * This is a simple wrapper around useAuth hook for compatibility.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  // Use the refactored useAuth hook
  const auth = useAuth(true);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      user: auth.user,
      isAuthenticated: auth.isAuthenticated,
      isLoading: auth.isLoading,
      login: auth.login,
      logout: auth.logout,
      clearSession: auth.clearSession,
      loginSuccess: auth.loginSuccess,
      loginFailure: auth.loginFailure,
    }),
    [auth]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to access auth context
 * 
 * Must be used within AuthProvider.
 * Throws error if used outside of provider.
 */
export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  
  return context;
}

// Re-export useAuth for convenience
export { useAuth };

// Re-export service for testing/mock purposes
export { authService, AuthError } from '../services/AuthService';
