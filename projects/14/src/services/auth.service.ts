import { User, LoginForm } from '../types';

// Mock user database - in real app, this would come from an API
export const MOCK_USERS: User[] = [
  { id: '1', email: 'admin@example.com', name: 'Admin User', password: 'password' },
  { id: '2', email: 'user@example.com', name: 'Regular User', password: 'password' },
];

// Storage key for localStorage
export const AUTH_STORAGE_KEY = 'auth_user';

/**
 * Check if user is authenticated (check localStorage)
 */
export const isUserAuthenticated = (): boolean => {
  try {
    const user = localStorage.getItem(AUTH_STORAGE_KEY);
    return !!user;
  } catch {
    return false;
  }
};

/**
 * Get current user from storage
 */
export const getCurrentUser = (): User | null => {
  try {
    const user = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!user) return null;
    return JSON.parse(user);
  } catch {
    return null;
  }
};

/**
 * Store user in localStorage
 */
export const storeUser = (user: User): void => {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Failed to store user:', error);
    throw error;
  }
};

/**
 * Remove user from localStorage
 */
export const removeUser = (): void => {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to remove user:', error);
    throw error;
  }
};

/**
 * Authenticate user with credentials
 * @param credentials - Email and password
 * @returns User object if authenticated, null otherwise
 */
export const authenticateUser = async (
  credentials: LoginForm
): Promise<User | null> => {
  const { email, password } = credentials;

  // Validate email format (basic check)
  if (!email || !email.includes('@')) {
    throw new Error('Invalid email address');
  }

  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  // Simulate network delay for fake authentication
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Find user in mock database
  const user = MOCK_USERS.find((u) => u.email === email);

  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Verify password
  if (user.password !== password) {
    throw new Error('Invalid email or password');
  }

  // Return user with unique ID (in real app, this would come from backend)
  return {
    ...user,
    id: crypto.randomUUID(),
  };
};

/**
 * Get all mock users
 */
export const getMockUsers = (): User[] => {
  return MOCK_USERS;
};

/**
 * Check if email exists in mock users
 */
export const doesEmailExist = (email: string): boolean => {
  return MOCK_USERS.some((u) => u.email === email);
};
