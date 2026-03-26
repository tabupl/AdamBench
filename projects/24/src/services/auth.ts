import type { User, LoginCredentials, UpdateProfileData } from '../types';

const STORAGE_KEY = 'auth_user';

// Simulated user database
const USERS: Array<User & { password: string }> = [
  { id: '1', email: 'admin@example.com', name: 'Admin User', password: 'admin123' },
  { id: '2', email: 'user@example.com', name: 'Regular User', password: 'user123' },
];

// Simulate network delay
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function login({ email, password }: LoginCredentials): Promise<User> {
  await delay(500);

  const user = USERS.find((u) => u.email === email && u.password === password);
  if (!user) throw new Error('Invalid email or password');

  const { password: _, ...userData } = user;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  return userData;
}

export async function logout(): Promise<void> {
  await delay(200);
  localStorage.removeItem(STORAGE_KEY);
}

export async function getCurrentUser(): Promise<User | null> {
  await delay(200);
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export async function updateProfile(data: UpdateProfileData): Promise<User> {
  await delay(300);

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) throw new Error('Not authenticated');

  const currentUser: User = JSON.parse(stored);
  
  // Check if email is taken by another user
  if (data.email && data.email !== currentUser.email) {
    const taken = USERS.some((u) => u.email === data.email && u.id !== currentUser.id);
    if (taken) throw new Error('Email already in use');
  }

  const updatedUser = { ...currentUser, ...data };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
  return updatedUser;
}
