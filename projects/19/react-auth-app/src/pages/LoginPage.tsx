import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthActions, useAuthState } from '../services/authService';
import '../styles/LoginPage.css';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('password');
  
  const { login } = useAuthActions();
  const { isLoading, error } = useAuthState();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      }
    } catch (err) {
      // Error is handled in the auth service
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <p className="login-instructions">Use test credentials: user@example.com / password</p>
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        <p className="signup-link">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
        <p className="game-link">
          <Link to="/snake">Play Snake Game (Unauthenticated)</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;