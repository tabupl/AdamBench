import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isDashboard = location.pathname === '/dashboard';
  const isProfile = location.pathname === '/profile';

  return (
    <div className="layout">
      {user && (
        <header className="header">
          <div className="header-content">
            <h1 className="logo">Auth App</h1>
            <nav className="nav">
              <Link to="/dashboard" className={isDashboard ? 'nav-link active' : 'nav-link'}>
                Dashboard
              </Link>
              <Link to="/profile" className={isProfile ? 'nav-link active' : 'nav-link'}>
                Profile
              </Link>
              <button onClick={logout} className="logout-btn">
                Logout
              </button>
            </nav>
          </div>
        </header>
      )}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
