import { describe, it, expect } from 'vitest';
import { authenticateUser, getMockUsers, doesEmailExist } from './auth.service';
import { User } from '../types';

describe('auth.service', () => {
  describe('authenticateUser', () => {
    it('should authenticate valid user with correct password', async () => {
      const credentials = {
        email: 'admin@example.com',
        password: 'password',
      };

      const user = await authenticateUser(credentials);

      expect(user).toBeDefined();
      expect((user as User).email).toBe('admin@example.com');
      expect((user as User).name).toBe('Admin User');
      expect((user as User).id).toBeDefined();
      expect((user as User).password).toBe('password');
    });

    it('should reject invalid email', async () => {
      const credentials = {
        email: 'invalid-email',
        password: 'password',
      };

      await expect(authenticateUser(credentials)).rejects.toThrow('Invalid email');
    });

    it('should reject wrong password', async () => {
      const credentials = {
        email: 'admin@example.com',
        password: 'wrongpassword',
      };

      await expect(authenticateUser(credentials)).rejects.toThrow('Invalid email or password');
    });

    it('should reject non-existent email', async () => {
      const credentials = {
        email: 'nonexistent@example.com',
        password: 'password',
      };

      await expect(authenticateUser(credentials)).rejects.toThrow('Invalid email or password');
    });

    it('should reject empty password', async () => {
      const credentials = {
        email: 'admin@example.com',
        password: '',
      };

      await expect(authenticateUser(credentials)).rejects.toThrow('Password must be at least 6 characters');
    });

    it('should reject short password', async () => {
      const credentials = {
        email: 'admin@example.com',
        password: '12345',
      };

      await expect(authenticateUser(credentials)).rejects.toThrow('Password must be at least 6 characters');
    });

    it('should add a unique ID to the returned user', async () => {
      const credentials = {
        email: 'admin@example.com',
        password: 'password',
      };

      const user = await authenticateUser(credentials);

      expect((user as User).id).not.toBe('1'); // Original ID should be replaced with UUID
    });
  });

  describe('getMockUsers', () => {
    it('should return all mock users', () => {
      const users = getMockUsers();

      expect(users).toHaveLength(2);
      expect(users[0].email).toBe('admin@example.com');
      expect(users[1].email).toBe('user@example.com');
    });
  });

  describe('doesEmailExist', () => {
    it('should return true for existing email', () => {
      expect(doesEmailExist('admin@example.com')).toBe(true);
      expect(doesEmailExist('user@example.com')).toBe(true);
    });

    it('should return false for non-existing email', () => {
      expect(doesEmailExist('nonexistent@example.com')).toBe(false);
    });
  });
});
