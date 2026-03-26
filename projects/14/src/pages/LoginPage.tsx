import React, { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLogin } from '../hooks/useAuth';

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<{ message: string; field?: string } | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err: any) {
      setError({ message: err.message, field: undefined });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const demoAccounts = [
    { email: 'admin@example.com', password: 'password', name: 'Admin User' },
    { email: 'user@example.com', password: 'password', name: 'Regular User' },
  ];

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {error && (
            <div className="error-message">
              <span className="error-icon"></span>
              {error.message}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Demo accounts:
            <ul>
              {demoAccounts.map((account) => (
                <li key={account.email}>
                  {account.name} ({account.email})
                </li>
              ))}
            </ul>
          </p>
          <Link to="/" className="home-link">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};
