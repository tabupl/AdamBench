import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DEMO_CREDENTIALS = {
  user: { email: 'user@example.com', password: 'password123' },
  admin: { email: 'admin@example.com', password: 'admin123' },
};

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login, error, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch {
      // Error handled by auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemo = (type: 'user' | 'admin') => {
    const creds = DEMO_CREDENTIALS[type];
    setEmail(creds.email);
    setPassword(creds.password);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Welcome Back</h1>
        <p className="subtitle">Sign in to your account</p>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error.message}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={isSubmitting}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="demo-credentials">
          <p>Demo Credentials:</p>
          <div className="demo-buttons">
            <button type="button" onClick={() => fillDemo('user')} className="demo-btn">User</button>
            <button type="button" onClick={() => fillDemo('admin')} className="demo-btn">Admin</button>
          </div>
          <p className="hint">
            User: user@example.com / password123<br />
            Admin: admin@example.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
