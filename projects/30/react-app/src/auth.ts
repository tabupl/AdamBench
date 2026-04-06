// Auth types
export interface User {
  id: string;
  username: string;
  email: string;
  name?: string;
}

export interface Credentials {
  username: string;
  password: string;
}

export interface UserProfile {
  name: string;
  email: string;
}

// Mock users
const mockUsers: Record<string, string> = {
  admin: 'admin123',
  user: 'user123',
  demo: 'demo123',
};

// Storage helpers
const STORAGE_KEY = 'auth_user';

const saveUser = (user: User) => localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
const getUser = (): User | null => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
};
const clearUser = () => localStorage.removeItem(STORAGE_KEY);

// Auth service
export const authService = {
  login: async (username: string, password: string): Promise<User> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const expectedPassword = mockUsers[username];
    if (expectedPassword !== password) {
      throw new Error('Invalid username or password');
    }

    const user: User = {
      id: crypto.randomUUID(),
      username,
      email: `${username}@example.com`,
    };

    saveUser(user);
    return user;
  },

  logout: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    clearUser();
  },

  updateUser: async (user: User, updates: Partial<User>): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const updated = { ...user, ...updates };
    saveUser(updated);
    return updated;
  },

  getStoredUser: getUser,
};
