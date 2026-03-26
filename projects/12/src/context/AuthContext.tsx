import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (name: string, email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setUser({ id: '1', name: username, email: `${username}@example.com` });
  };

  const logout = async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    setUser(null);
  };

  const updateProfile = async (name: string, email: string) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    setUser((prev) => (prev ? { ...prev, name, email } : null));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
