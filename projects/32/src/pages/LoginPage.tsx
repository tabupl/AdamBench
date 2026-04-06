import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login();
    navigate('/dashboard');
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Login Page</h1>
      <p>This is a fake login. Click the button to log in.</p>
      <button onClick={handleLogin} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
        Login
      </button>
    </div>
  );
};

export default LoginPage;