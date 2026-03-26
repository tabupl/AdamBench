import type { User } from '../context/AuthTypes';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export class FakeAuthService {
  private state: AuthState = { user: null, isAuthenticated: false };

  constructor() {
    const stored = localStorage.getItem('auth');
    if (stored) {
      try {
        this.state = JSON.parse(stored);
      } catch {
        // ignore parse errors, fall back to defaults
      }
    }
  }

  private save() {
    localStorage.setItem('auth', JSON.stringify(this.state));
  }

  getState() {
    return this.state;
  }

  login = (): void => {
    this.state.user = { name: 'Fake User', email: 'fake@example.com' };
    this.state.isAuthenticated = true;
    this.save();
  };

  logout(): void {
    this.state.user = null;
    this.state.isAuthenticated = false;
    this.save();
  }

  updateProfile(partial: Partial<User>): void {
    if (this.state.user) {
      this.state.user = { ...this.state.user, ...partial };
      this.save();
    }
  }
}

// Singleton instance for the whole app
export const authService = new FakeAuthService();