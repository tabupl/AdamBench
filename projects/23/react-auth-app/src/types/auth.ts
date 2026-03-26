export interface User {
  id: string;
  name: string;
  email: string;
  avatarInitials: string;
}

export type AuthErrorCode =
  | "INVALID_CREDENTIALS"
  | "VALIDATION_ERROR"
  | "EMAIL_TAKEN"
  | "SESSION_CORRUPT"
  | "UNKNOWN";

export interface AuthError extends Error {
  readonly name: "AuthError";
  readonly code: AuthErrorCode;
}

export function createAuthError(code: AuthErrorCode, message: string): AuthError {
  const err = new Error(message) as AuthError;
  Object.defineProperty(err, "name", { value: "AuthError", configurable: true });
  Object.defineProperty(err, "code", { value: code, configurable: true });
  return err;
}

export function isAuthError(err: unknown): err is AuthError {
  return err instanceof Error && (err as AuthError).name === "AuthError";
}

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (name: string, email: string) => Promise<void>;
}
