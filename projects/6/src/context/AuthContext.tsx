import React, { createContext, useContext, useState, ReactNode } from 'react';


// Simple auth utilities using localStorage
const STORAGE_KEY = 'user';
const PROFILE_KEY = 'profile';

const getUser = (): string | null => localStorage.getItem(STORAGE_KEY);
const setUser = (username: string | null): void => {
  if (username) localStorage.setItem(STORAGE_KEY, username);
  else localStorage.removeItem(STORAGE_KEY);
};

const getProfile = (): { name: string; email: string } | null => {
  const data = localStorage.getItem(PROFILE_KEY);
  return data ? JSON.parse(data) : null;
};
const setProfile = (profile: { name: string; email: string } | null): void => {
  if (profile) localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  else localStorage.removeItem(PROFILE_KEY);
};
const authUpdateProfile = (updates: { name?: string; email?: string }): void => {
  const current = getProfile() || { name: '', email: '' };
  const newProfile = { ...current, ...updates };
  setProfile(newProfile);
};

const authLogin = async (username: string, password: string): Promise<boolean> => {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      if (username && password) {
        setUser(username);
        resolve(true);
      } else {
        resolve(false);
      }
    }, 500);
  });
};

const authLogout = (): void => {
  setUser(null);
  setProfile(null);
};

/**
 * Context shape exposed to components.
 * `login` and `logout` delegate to the auth service, making the logic
 * reusable and easily mockable in tests.
 */
interface AuthContextType {
  user: string | null;
  profile: { name: string; email: string } | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: { name: string; email: string }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialise state from the service (which reads localStorage)
  const [user, setUser] = useState<string | null>(getUser());
  const [profile, setProfile] = useState<{ name: string; email: string } | null>(getProfile());

  const login = async (username: string, password: string) => {
    const success = await authLogin(username, password);
    if (success) setUser(username);
    return success;
  };

  const logout = () => {
    authLogout();
    setUser(null);
    setProfile(null);
  };

  const updateProfile = (data: { name: string; email: string }) => {
    authUpdateProfile(data);
    setProfile(data);
  };

  return (
    <AuthContext.Provider value={{ user, profile, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
