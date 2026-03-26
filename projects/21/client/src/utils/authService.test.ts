/**
 * Authentication Service Tests
 * Demonstrates testable auth logic with mocked dependencies
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService, createMockApi, MockApi } from './authService';
import { InvalidCredentialsError } from './authService';

describe('AuthService', () => {
  beforeEach(() => {
    // Clear any existing state
    localStorage.clear();
    authService.logout();
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      const mockUser = {
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin' as const,
      };

      // Mock the API
      const mockApi: MockApi = {
        login: async (email: string, password: string) => {
          if (email === 'admin@example.com' && password === 'admin@example.com') {
            return { user: mockUser };
          }
          throw new InvalidCredentialsError();
        },
        getUser: async () => mockUser,
      };

      authService.setMockApi(mockApi);

      await expect(authService.login({
        email: 'admin@example.com',
        password: 'admin@example.com',
      })).resolves.not.toThrow();

      // Verify user is stored
      expect(authService.getCurrentUser()).toEqual(mockUser);
      expect(authService.isAuthenticated()).toBe(true);
    });

    it('should throw error for invalid credentials', async () => {
      await expect(authService.login({
        email: 'admin@example.com',
        password: 'wrong-password',
      })).rejects.toThrow(InvalidCredentialsError);
    });

    it('should throw error for non-existent user', async () => {
      const mockApi: MockApi = {
        login: async () => {
          throw new InvalidCredentialsError();
        },
        getUser: async () => {
          throw new InvalidCredentialsError();
        },
      };

      authService.setMockApi(mockApi);

      await expect(authService.login({
        email: 'nonexistent@example.com',
        password: 'password',
      })).rejects.toThrow(InvalidCredentialsError);
    });
  });

  describe('logout', () => {
    it('should clear the current user', () => {
      // First login
      const mockUser = {
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin' as const,
      };

      const mockApi: MockApi = {
        login: async () => ({ user: mockUser }),
        getUser: async () => mockUser,
      };

      authService.setMockApi(mockApi);
      authService.login({
        email: 'admin@example.com',
        password: 'admin@example.com',
      });

      // Now logout
      authService.logout();

      expect(authService.getCurrentUser()).toBeNull();
      expect(authService.isAuthenticated()).toBe(false);
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when user is logged in', async () => {
      const mockUser = {
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin' as const,
      };

      const mockApi: MockApi = {
        login: async () => ({ user: mockUser }),
        getUser: async () => mockUser,
      };

      authService.setMockApi(mockApi);
      
      // Login first, then check
      await authService.login({
        email: 'admin@example.com',
        password: 'admin@example.com',
      });

      expect(authService.isAuthenticated()).toBe(true);
    });

    it('should return false when not logged in', () => {
      expect(authService.isAuthenticated()).toBe(false);
    });
  });

  describe('createMockApi', () => {
    it('should create a working mock API', async () => {
      const mockApi = createMockApi();
      
      // The mock API should accept credentials where password matches email
      await expect(mockApi.login('admin@example.com', 'admin@example.com'))
        .resolves.toMatchObject({
          user: expect.objectContaining({
            email: 'admin@example.com',
          }),
        });

      // Should fail with wrong password
      await expect(mockApi.login('admin@example.com', 'wrong'))
        .rejects.toThrow(InvalidCredentialsError);
    });
  });
});
