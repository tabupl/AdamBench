import { Link } from 'react-router-dom';
import { useAuth } from '../auth';
import { Layout } from '../Layout';

export const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <Layout>
      <h1>Dashboard</h1>
      <p>
        Welcome, <strong>{user?.name}</strong>.
      </p>
      <p className="muted">Signed in as {user?.email}</p>
      <p className="muted small">
        Manage your account in <Link to="/profile">profile</Link>.
      </p>
      <button type="button" onClick={logout}>
        Logout
      </button>
    </Layout>
  );
};
