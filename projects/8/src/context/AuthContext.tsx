import { createContext, useContext, useState, ReactNode } from 'react';

// Types
interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Fake users
const FAKE_USERS: Record<string, { password: string; user: User }> = {
  admin: {
    password: 'admin123',
    user: { id: '1', username: 'admin', email: 'admin@example.com', role: 'admin' },
  },
  user: {
    password: 'user123',
    user: { id: '2', username: 'user', email: 'user@example.com', role: 'user' },
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string): Promise<boolean> => {
    const fakeUser = FAKE_USERS[username];
    if (fakeUser && fakeUser.password === password) {
      setUser(fakeUser.user);
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
