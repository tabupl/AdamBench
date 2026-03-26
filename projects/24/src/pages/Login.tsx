import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  // Redirect if already authenticated - use useEffect to avoid render-time navigation
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, from]);

  // Show loading while checking auth state
  if (isLoading) {
    return (
      <div className="login-page">
        <div className="loading-container">
          <div className="loading-spinner" />
        </div>
      </div>
    );
  }

  // Don't render form if redirecting
  if (isAuthenticated) {
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch {
      // Error is handled by AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (setter: (value: string) => void) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (error) clearError();
      setter(e.target.value);
    };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={handleInputChange(setEmail)}
              placeholder="Enter your email"
              autoComplete="email"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={handleInputChange(setPassword)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="demo-credentials">
          <p><strong>Demo Credentials:</strong></p>
          <p>Email: admin@example.com</p>
          <p>Password: admin123</p>
        </div>
      </div>
    </div>
  );
}
