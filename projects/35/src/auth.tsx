import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

/* ── types ── */
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

const STORAGE_KEY = 'auth_user';
const FAKE_USERS: (User & { password: string })[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', password: 'password123', role: 'admin' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', password: 'password123', role: 'user' },
];

/* ── low-level helpers (exported for testing) ── */
export function readStoredSession(): User | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { localStorage.removeItem(STORAGE_KEY); return null; }
}

export async function fakeLogin(email: string, password: string, delayMs = 800): Promise<User> {
  await new Promise((r) => setTimeout(r, delayMs));
  const user = FAKE_USERS.find((u) => u.email === email && u.password === password);
  if (!user) throw new Error('Invalid email or password');
  const { password: _, ...safe } = user;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
  return safe;
}

export async function fakeUpdateProfile(userId: string, data: { name: string; email: string }, delayMs = 800): Promise<User> {
  await new Promise((r) => setTimeout(r, delayMs));
  const user = FAKE_USERS.find((u) => u.id === userId);
  if (!user) throw new Error('User not found');
  user.name = data.name;
  user.email = data.email;
  const { password: _, ...safe } = user;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
  return safe;
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/* ── context ── */
interface AuthValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  updateProfile: (data: { name: string; email: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { setUser(readStoredSession()); setIsLoading(false); }, []);

  const login = useCallback(async (email: string, password: string) => {
    setUser(await fakeLogin(email, password));
  }, []);

  const updateProfile = useCallback(async (data: { name: string; email: string }) => {
    if (!user) return;
    setUser(await fakeUpdateProfile(user.id, data));
  }, [user]);

  const logout = useCallback(() => { setUser(null); clearSession(); }, []);

  const value = useMemo<AuthValue>(
    () => ({ user, isAuthenticated: user !== null, isLoading, login, updateProfile, logout }),
    [user, isLoading, login, updateProfile, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
