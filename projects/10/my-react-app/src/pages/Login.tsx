import type { FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    login();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <button type="submit">Fake Login</button>
      </form>
    </div>
  );
};

export default LoginPage;