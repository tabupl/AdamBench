import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';

// Define the authentication service interface
export interface AuthActions {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: User) => Promise<void>;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Define the context type
interface AuthContextType {
  state: AuthState;
  actions: AuthActions;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Authentication service class for better modularity
export class AuthService {
  private static STORAGE_KEY = 'user';

  static async performLogin(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Fake authentication logic - in real app this would be an API call
    if (email === 'user@example.com' && password === 'password') {
      const user: User = {
        id: 1,
        email,
        name: 'John Doe'
      };
      return { success: true, user };
    }
    
    return { 
      success: false, 
      error: 'Invalid email or password' 
    };
  }

  static async updateUser(user: User): Promise<void> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // In a real app, this would be an API call to update user data
    // For now, we'll just save to storage
    this.saveUserToStorage(user);
  }

  static saveUserToStorage(user: User): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }

  static getUserFromStorage(): User | null {
    const userStr = localStorage.getItem(this.STORAGE_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  static clearUserFromStorage(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

// AuthProvider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  });

  // Initialize auth state from storage
  useEffect(() => {
    const storedUser = AuthService.getUserFromStorage();
    if (storedUser) {
      setState(prev => ({
        ...prev,
        user: storedUser,
        isAuthenticated: true
      }));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const result = await AuthService.performLogin(email, password);
      
      if (result.success && result.user) {
        AuthService.saveUserToStorage(result.user);
        setState({
          user: result.user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        return true;
      } else {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: result.error || 'Login failed'
        });
        return false;
      }
    } catch (error) {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'An unexpected error occurred'
      });
      return false;
    }
  };

  const logout = () => {
    AuthService.clearUserFromStorage();
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
  };

  const updateUser = async (user: User): Promise<void> => {
    try {
      await AuthService.updateUser(user);
      setState(prev => ({
        ...prev,
        user
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to update user profile'
      }));
    }
  };

  const actions: AuthActions = {
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={{ state, actions }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easier access to auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Hook for just the auth state
export const useAuthState = (): AuthState => {
  const { state } = useAuth();
  return state;
};

// Hook for just the auth actions
export const useAuthActions = (): AuthActions => {
  const { actions } = useAuth();
  return actions;
};