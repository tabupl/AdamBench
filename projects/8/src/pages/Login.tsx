import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (isAuthenticated) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = await login(username, password);
    if (!success) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Welcome Back</h1>
        <p className="login-subtitle">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
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
              placeholder="Enter password"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn">Sign In</button>
        </form>

        <div className="demo-credentials">
          <p><strong>Quick Login:</strong></p>
          <div className="demo-buttons">
            <button
              type="button"
              className="demo-btn"
              onClick={() => { setUsername('admin'); setPassword('admin123'); }}
            >
              admin
            </button>
            <button
              type="button"
              className="demo-btn"
              onClick={() => { setUsername('user'); setPassword('user123'); }}
            >
              user
            </button>
          </div>
          <p className="demo-creds-text">
            Or use: <code>admin/admin123</code>
          </p>
        </div>

        <div className="login-footer">
          <Link to="/snake" className="snake-link">
            🐍 Play Snake Game
          </Link>
        </div>
      </div>
    </div>
  );
}
