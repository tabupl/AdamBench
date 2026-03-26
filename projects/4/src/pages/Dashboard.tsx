import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      {user && <p>Welcome, {user.name}!</p>}
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
