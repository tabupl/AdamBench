import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Dashboard</h2>
      <p>Welcome, {user?.name ?? 'User'}!</p>
      <button onClick={handleLogout}>Logout</button>
      <Link to="/profile">Edit Profile</Link>
    </div>
  );
};

export default DashboardPage;