import { useState, useCallback } from 'react';
import type { User, LoginCredentials, ProfileUpdate } from '../types/auth';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  updateProfile: (update: ProfileUpdate) => Promise<boolean>;
}

export const useAuth = (): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (credentials.email === 'user@example.com' && credentials.password === 'password123') {
      setUser({ id: '1', email: 'user@example.com', name: 'John Doe' });
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (update: ProfileUpdate): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (update.email && !update.email.includes('@')) {
      setIsLoading(false);
      return false;
    }
    
    setUser(prev => prev ? { ...prev, ...update } : null);
    setIsLoading(false);
    return true;
  }, [user]);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateProfile,
  };
};
