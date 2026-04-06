import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

export function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) navigate('/dashboard', { replace: true });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateEmail = (e: ChangeEvent<HTMLInputElement>) => { setEmail(e.target.value); if (error) setError(''); };
  const updatePassword = (e: ChangeEvent<HTMLInputElement>) => { setPassword(e.target.value); if (error) setError(''); };

  return (
    <div className="page-center">
      <div className="auth-card">
        <h1 className="auth-title">Sign In</h1>
        <p className="auth-subtitle">Welcome back! Please enter your credentials.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="alert error">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input id="email" type="email" value={email} onChange={updateEmail} placeholder="name@example.com" required autoComplete="email" />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={updatePassword} placeholder="••••••••" required autoComplete="current-password" />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="auth-hint">
          <p>Demo accounts (password: <code>password123</code>):</p>
          <ul>
            <li><code>alice@example.com</code> — Admin</li>
            <li><code>bob@example.com</code> — User</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
