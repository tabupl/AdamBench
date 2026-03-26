import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AuthError, authService } from './AuthService';
import { User } from '../types';

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset user
    (authService as unknown as { user: User | null }).user = null;
  });

  afterEach(() => {
    // Note: delay is private, so we just clear mocks
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const credentials = {
        email: 'admin@omnicoder.com',
        password: 'password123',
      };

      const result = await authService.login(credentials);

      expect(result).toEqual({
        id: expect.any(String),
        email: 'admin@omnicoder.com',
        name: 'Admin User',
        avatar: expect.any(String),
      });
    });

    it('should throw error for invalid credentials', async () => {
      const credentials = {
        email: 'invalid@example.com',
        password: 'wrongpassword',
      };

      await expect(authService.login(credentials)).rejects.toThrow(AuthError.INVALID_CREDENTIALS);
    });

    it('should throw error for missing email', async () => {
      const credentials = {
        email: '',
        password: 'password',
      };

      await expect(authService.login(credentials)).rejects.toThrow(AuthError.INVALID_CREDENTIALS);
    });

    it('should throw error for missing password', async () => {
      const credentials = {
        email: 'admin@omnicoder.com',
        password: '',
      };

      await expect(authService.login(credentials)).rejects.toThrow(AuthError.INVALID_CREDENTIALS);
    });
  });

  describe('logout', () => {
    it('should clear current user', () => {
      (authService as unknown as { user: User | null }).user = {
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
      } as User;

      authService.logout();

      expect((authService as unknown as { user: User | null }).user).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    it('should return null when not authenticated', () => {
      expect(authService.getCurrentUser()).toBeNull();
    });

    it('should return current user when authenticated', () => {
      (authService as unknown as { user: User | null }).user = {
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
        avatar: 'avatar.png',
      } as User;

      const user = authService.getCurrentUser();

      expect(user).not.toBeNull();
      expect(user?.email).toBe('test@test.com');
      expect(user?.name).toBe('Test User');
    });
  });

  describe('clearSession', () => {
    it('should clear user and localStorage', () => {
      (authService as unknown as { user: User | null }).user = {
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
      } as User;

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
      }));

      authService.clearSession();

      expect((authService as unknown as { user: User | null }).user).toBeNull();
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('omnicoder_user');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('omnicoder_session');
    });
  });

  describe('loadUserFromStorage', () => {
    it('should load user from storage', async () => {
      const storedUser = {
        id: '1',
        email: 'admin@omnicoder.com',
        name: 'Admin User',
        _password: 'password123',
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storedUser));

      const user = await authService.loadUserFromStorage();

      expect(user).not.toBeNull();
      expect(user?.email).toBe('admin@omnicoder.com');
      expect(user?.name).toBe('Admin User');
    });

    it('should clear session if stored user is invalid', async () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        id: '999',
        email: 'invalid@example.com',
        name: 'Invalid User',
        _password: 'wrongpassword',
      }));

      await authService.loadUserFromStorage();

      expect((authService as unknown as { user: User | null }).user).toBeNull();
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('omnicoder_user');
    });

    it('should handle storage errors gracefully', async () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const user = await authService.loadUserFromStorage();

      expect(user).toBeNull();
    });

    it('should handle missing storage', async () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const user = await authService.loadUserFromStorage();

      expect(user).toBeNull();
    });
  });

  describe('delay', () => {
    it('should simulate network delay during login', async () => {
      // The delay is private, so we just verify it exists and works by checking login timing
      // Login should take approximately 500ms
      const startTime = Date.now();
      await authService.login({
        email: 'admin@omnicoder.com',
        password: 'password123',
      });
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeGreaterThanOrEqual(450);
    });
  });

  describe('Avatar generation', () => {
    it('should generate correct avatar URL', () => {
      const testUser = {
        email: 'test@example.com',
        password: 'password',
        name: 'Test User',
      };

      const avatar = authService['generateAvatar'](testUser.name);
      
      expect(avatar).toContain('ui-avatars.com');
      expect(avatar).toContain('name=Test');
      expect(avatar).toContain('background=0066cc');
    });

    it('should handle special characters in names', () => {
      const avatar = authService['generateAvatar']('Test User 123');
      
      expect(avatar).toContain('ui-avatars.com');
      expect(avatar).toContain('name=Test');
      expect(avatar).toContain('background=0066cc');
    });
  });
});
