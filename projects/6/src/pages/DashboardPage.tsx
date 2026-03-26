import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <h1>Dashboard</h1>
      <p>Welcome, {user}!</p>
      <button onClick={handleLogout} style={styles.button}>Logout</button>
      <button onClick={() => navigate('/profile')} style={styles.button}>Edit Profile</button>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '20px',
  },
  button: {
    padding: '8px 12px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
};

export default DashboardPage;
