import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { User } from './AuthTypes';
import { useNavigate } from 'react-router-dom';
import type { AuthContextProps } from './AuthTypes';
import { authService } from '../services/AuthService';

type AuthContextValue = AuthContextProps & {
  updateProfile: (partial: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  const login = () => {
    authService.login();
    navigate('/dashboard');
  };

  const logout = () => {
    authService.logout();
    navigate('/login');
  };

  const updateProfile = (partial: Partial<User>) => {
    authService.updateProfile(partial);
  };

  const { user, isAuthenticated } = authService.getState();

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};