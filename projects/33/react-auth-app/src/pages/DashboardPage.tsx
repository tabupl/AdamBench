import React from 'react';
import { useAuth } from '../context/AuthContext';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ maxWidth: '800px', margin: '100px auto', padding: '30px', border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center' }}>
      <h1 style={{ color: '#28a745' }}>Welcome to the Dashboard!</h1>
      <p style={{ fontSize: '1.2em' }}>Hello, {user || 'User'}! You have successfully logged in.</p>
      <p>This is your protected area.</p>
      <button 
        onClick={logout} 
        style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '20px' }}
      >
        Logout
      </button>
    </div>
  );
};

export default DashboardPage;