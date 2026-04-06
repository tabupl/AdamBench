/**
 * Login Page
 */

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../components/AuthProvider';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state?.from?.pathname || '/dashboard') as string;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    if (!/^[a-zA-Z][a-zA-Z0-9_]{0,20}$/.test(username.trim())) {
      setError('Invalid username');
      return;
    }

    try {
      await login({ username });
      navigate(from, { replace: true });
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
      <div style={{ background: 'white', padding: '2rem', borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)', width: '100%', maxWidth: 400 }}>
        <h1 style={{ marginBottom: 1.5, textAlign: 'center' }}>Login</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 1 }}>
            <label style={{ display: 'block', marginBottom: 0.5, fontWeight: 'bold' }}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              style={{ width: '100%', padding: 0.75, border: '1px solid #ddd', borderRadius: 4, boxSizing: 'border-box' }}
              placeholder="Enter your username"
              autoFocus
            />
          </div>
          {error && <div style={{ color: '#d32f2f', marginBottom: 1, padding: 0.5, borderRadius: 4, background: '#ffebee' }}>{error}</div>}
          <button type="submit" disabled={isLoading} style={{ width: '100%', padding: 0.75, background: '#1890ff', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold', opacity: isLoading ? 0.7 : 1 }}>
            {isLoading ? 'Loading...' : 'Login'}
          </button>
        </form>
        <p style={{ marginTop: 1, textAlign: 'center', color: '#666', fontSize: 0.9 }}>Any valid username works (starts with letter, 1-20 chars)</p>
      </div>
    </div>
  );
};

export default Login;