import { useState, useCallback, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthProvider';

const DEMO_USERS = [
  { username: 'admin', password: 'admin123' },
  { username: 'user', password: 'user123' },
  { username: 'demo', password: 'demo123' },
];

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const { login, isLoading } = useAuth();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();

    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Invalid username or password');
    }
  }, [username, password, login, navigate, from]);

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Welcome</h1>
        <p className="login-subtitle">Sign in to continue</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={isLoading}
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="demo-credentials">
          <p className="demo-title">Demo Credentials:</p>
          <ul>
            {DEMO_USERS.map((u) => (
              <li key={u.username}>
                <strong>{u.username}</strong> / {u.password}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
