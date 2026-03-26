import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, error, isAuthenticated, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: Location })?.from?.pathname || '/dashboard';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Clear error when form changes
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [email, password, error, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const loginError = await login({ email, password });

    if (!loginError) {
      navigate(from, { replace: true });
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome Back</h1>
        <p style={styles.subtitle}>Sign in to your account</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="user@example.com"
              required
              disabled={isSubmitting}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="••••••••"
              required
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <div style={styles.errorContainer}>
              <p style={styles.error}>{error.message}</p>
            </div>
          )}

          <button type="submit" style={styles.button} disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={styles.hint}>
          <p style={styles.hintTitle}>Demo Credentials:</p>
          <p style={styles.hintText}>user@example.com / password123</p>
          <p style={styles.hintText}>admin@example.com / admin123</p>
        </div>

        <div style={styles.gameLink}>
          <Link to="/snake-game" style={styles.gameLinkText}>
            🎮 Play Snake Game (no login required)
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    margin: '0 0 8px 0',
    fontSize: '24px',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    margin: '0 0 24px 0',
    color: '#666',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#333',
  },
  input: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    outline: 'none',
  },
  errorContainer: {
    padding: '12px',
    backgroundColor: '#fdf2f2',
    borderRadius: '4px',
    border: '1px solid #fecaca',
  },
  error: {
    color: '#dc2626',
    fontSize: '14px',
    margin: '0',
    textAlign: 'center',
  },
  button: {
    padding: '12px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 500,
    cursor: 'pointer',
    marginTop: '8px',
  },
  hint: {
    marginTop: '24px',
    padding: '16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    textAlign: 'center',
  },
  hintTitle: {
    margin: '0 0 8px 0',
    fontSize: '14px',
    fontWeight: 500,
    color: '#666',
  },
  hintText: {
    margin: '4px 0',
    fontSize: '12px',
    color: '#888',
  },
  gameLink: {
    marginTop: '16px',
    textAlign: 'center',
  },
  gameLinkText: {
    color: '#3498db',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 500,
  },
};
