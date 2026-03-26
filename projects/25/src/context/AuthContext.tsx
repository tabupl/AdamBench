import React, { createContext, useContext } from 'react';
import { useAuth, type AuthState } from '../hooks/useAuth';

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthContext.Provider value={useAuth()}>
    {children}
  </AuthContext.Provider>
);

export const useAuthContext = (): AuthState => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be used within AuthProvider');
  return context;
};
