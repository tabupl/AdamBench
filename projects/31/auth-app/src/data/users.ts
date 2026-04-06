import type { User } from '../types/auth.types';

export interface UserWithPassword extends User {
  password: string;
}

export const FAKE_USERS: UserWithPassword[] = [
  { id: '1', email: 'admin@example.com', password: 'admin123', name: 'Admin User', role: 'admin' },
  { id: '2', email: 'user@example.com', password: 'user123', name: 'Regular User', role: 'user' },
];
