import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Navigation } from '../components/Navigation';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use the refactored auth hook
  const { login, loginSuccess, loginFailure, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the return URL from state, default to dashboard
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate input
      if (!email || !password) {
        return;
      }

      // Attempt login
      await login({ email, password });

      // Check login result
      if (loginSuccess) {
        navigate(from, { replace: true });
      }
      // If loginFailure is true, stay on page with error shown
    } catch {
      // Error is already handled by the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <Navigation />
      <div className="card form-container">
        <h1 className="form-title">Welcome back</h1>
        <p className="form-subtitle">Sign in to your OmniCoder account</p>

        {/* Show error messages */}
        <div className="error">{loginFailure && 'Invalid email or password'}</div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting || isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting || isLoading}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={isSubmitting || isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {/* Demo credentials hint */}
        <div style={{ marginTop: '20px', fontSize: '12px', color: '#6b7280', textAlign: 'center' }}>
          Demo: admin@omnicoder.com / password123
        </div>
      </div>
    </div>
  );
}
