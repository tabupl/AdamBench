import React from 'react';
import { useAuth } from '../auth';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Dashboard</h1>
      <p>Welcome, <strong>{user?.username}</strong>!</p>
      
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button 
          onClick={() => navigate('/profile')} 
          style={{ padding: '0.5rem 1rem', cursor: 'pointer', backgroundColor: '#1890ff', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Go to Profile
        </button>
        <button 
          onClick={handleLogout} 
          style={{ padding: '0.5rem 1rem', cursor: 'pointer', backgroundColor: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;