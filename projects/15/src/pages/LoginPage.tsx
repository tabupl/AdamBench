import React, { useState, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  // Simple email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Check if email is already registered (only in register mode)
  const checkEmailAvailability = async (): Promise<void> => {
    if (isRegistering) {
      setIsCheckingEmail(true);
      try {
        // Mock check - always allow registration
      } catch {
        setError('Failed to check email availability');
      } finally {
        setIsCheckingEmail(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (isRegistering) {
      await checkEmailAvailability();
      if (error) return;
    }

    try {
      if (isRegistering) {
        // Mock registration
        await login(formData.email, formData.password);
      } else {
        // Mock login
        await login(formData.email);
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const toggleAuthMode = (): void => {
    setError(null);
    setFormData({ email: '', password: '' });
    setIsRegistering(!isRegistering);
  };

  if (isLoading) {
    return <div className="auth-loading"><div className="spinner"></div><p>Loading...</p></div>;
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <h1>{isRegistering ? 'Create Account' : 'Welcome Back'}</h1>
          <p>
            {isRegistering ? 'Join us today to get started!' : 'Sign in to your account'}
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                required
                disabled={isCheckingEmail}
              />
              {isCheckingEmail && (
                <span className="loading-indicator">Checking...</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={isRegistering ? 'Create a password' : 'Enter password'}
                required
                minLength={isRegistering ? 6 : 4}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="submit-btn" disabled={isCheckingEmail}>
              {isRegistering ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <p className="toggle-auth">
            {isRegistering ? "Already have an account? " : "Don't have an account? "}
            <button type="button" onClick={toggleAuthMode} className="toggle-btn">
              {isRegistering ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
