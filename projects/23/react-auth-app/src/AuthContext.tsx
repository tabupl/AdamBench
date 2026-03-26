import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { createAuthError, isAuthError } from "./types/auth";
import type { AuthContextValue, User } from "./types/auth";

// ── Fake user store ───────────────────────────────────────────────────────────

type StoredUser = User & { password: string };

const USERS: StoredUser[] = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", password: "password123", avatarInitials: "AJ" },
  { id: "2", name: "Bob Smith",     email: "bob@example.com",   password: "password123", avatarInitials: "BS" },
];

function deriveInitials(name: string): string {
  return name.trim().split(/\s+/).map((w) => w[0]?.toUpperCase() ?? "").slice(0, 2).join("");
}

function simulateDelay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// ── Session storage ───────────────────────────────────────────────────────────

const SESSION_KEY = "auth_user";

function loadSession(): User | null {
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
    throw createAuthError("SESSION_CORRUPT", "Stored session was unreadable and has been cleared.");
  }
}

// ── Validation ────────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email: string) {
  if (!email) throw createAuthError("VALIDATION_ERROR", "Email is required.");
  if (!EMAIL_RE.test(email)) throw createAuthError("VALIDATION_ERROR", "Please enter a valid email address.");
}

function validatePassword(password: string) {
  if (!password) throw createAuthError("VALIDATION_ERROR", "Password is required.");
  if (password.length < 6) throw createAuthError("VALIDATION_ERROR", "Password must be at least 6 characters.");
}

function validateName(name: string) {
  if (!name) throw createAuthError("VALIDATION_ERROR", "Name is required.");
  if (name.length < 2) throw createAuthError("VALIDATION_ERROR", "Name must be at least 2 characters.");
  if (name.length > 60) throw createAuthError("VALIDATION_ERROR", "Name must be 60 characters or fewer.");
}

// ── Context ───────────────────────────────────────────────────────────────────

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try { setUser(loadSession()); } catch { /* corrupt session cleared, stay logged out */ }
    finally { setIsLoading(false); }
  }, []);

  async function login(email: string, password: string): Promise<void> {
    const e = email.trim().toLowerCase();
    validateEmail(e);
    validatePassword(password);

    await simulateDelay(800);

    const match = USERS.find((u) => u.email === e && u.password === password);
    if (!match) throw createAuthError("INVALID_CREDENTIALS", "Invalid email or password.");

    const { password: _, ...loggedIn } = match;
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(loggedIn));
    setUser(loggedIn);
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    setUser(null);
  }

  async function updateProfile(name: string, email: string): Promise<void> {
    if (!user) throw new Error("Not logged in.");
    const n = name.trim();
    const e = email.trim().toLowerCase();
    validateName(n);
    validateEmail(e);

    await simulateDelay(600);

    const emailTaken = USERS.some((u) => u.email === e && u.id !== user.id);
    if (emailTaken) throw createAuthError("EMAIL_TAKEN", "That email address is already in use.");

    // Update the in-memory store so re-login reflects the change
    const idx = USERS.findIndex((u) => u.id === user.id);
    if (idx !== -1) {
      USERS[idx] = { ...USERS[idx]!, name: n, email: e, avatarInitials: deriveInitials(n) };
    }

    const updated: User = { ...user, name: n, email: e, avatarInitials: deriveInitials(n) };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(updated));
    setUser(updated);
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Re-export isAuthError so consumers don't need a separate import ───────────
export { isAuthError };
