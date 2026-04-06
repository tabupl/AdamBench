import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      await login(username);
      navigate('/dashboard');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>Login</h2>
        <input 
          type="text" 
          placeholder="Enter any username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          style={{ padding: '0.5rem' }}
          required
        />
        <button type="submit" style={{ padding: '0.5rem', cursor: 'pointer' }}>Login</button>
      </form>
    </div>
  );
};

export default LoginPage;