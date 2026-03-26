import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">MyApp</h1>
          <nav className="nav-links">
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              Dashboard
            </NavLink>
            <NavLink 
              to="/profile" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              Profile
            </NavLink>
          </nav>
          <div className="user-menu">
            <span className="user-name">Welcome, {user?.name}</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
