import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.name}!</p>
      <button onClick={logout}>Logout</button>
        <button onClick={() => navigate('/profile')} style={{marginLeft:10}}>Profile</button>
    </div>
  );
};

export default Dashboard;
