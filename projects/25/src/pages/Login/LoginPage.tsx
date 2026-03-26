import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuthContext } from '../../context';
import styles from './Login.module.css';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login, isAuthenticated, isLoading } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = (location.state as { from?: Location })?.from?.pathname || '/dashboard';

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await login({ email, password });
    
    if (success) {
      navigate(from, { replace: true });
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Sign In</h1>
        <p className={styles.subtitle}>Enter your credentials to access the dashboard</p>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}
          
          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
            />
          </div>
          
          <div className={styles.field}>
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
          
          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <p className={styles.hint}>
          Hint: Use <code>user@example.com</code> / <code>password123</code>
        </p>
        
        <div className={styles.divider} />
        
        <button 
          type="button" 
          onClick={() => navigate('/snake')} 
          className={styles.snakeLink}
        >
          Play Snake Game (No login required)
        </button>
      </div>
    </div>
  );
};
