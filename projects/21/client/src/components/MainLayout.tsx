/**
 * Main Layout Component
 * Provides the main layout structure for the application
 */

import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthWithNavigate } from '../context/useAuthWithNavigate';

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logoutWithRedirect } = useAuthWithNavigate();

  const handleLogout = () => {
    logoutWithRedirect();
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <div style={styles.navLogo}>
          <Link to="/" style={styles.logoLink}>
            OmniCoder
          </Link>
        </div>
        
        <div style={styles.navLinks}>
          {user && (
            <>
              {user.role !== 'admin' && (
                <Link
                  to="/dashboard"
                  style={styles.navLink(isActive('/dashboard'))}
                >
                  Dashboard
                </Link>
              )}
              
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  style={styles.navLink(isActive('/admin'))}
                >
                  Admin Dashboard
                </Link>
              )}
              
              <Link
                to="/profile"
                style={styles.navLink(isActive('/profile'))}
              >
                Profile
              </Link>
              
              <button
                style={styles.logoutButton}
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
          
          {!user && (
            <Link
              to="/login"
              style={styles.loginButton}
            >
              Login
            </Link>
          )}
        </div>
      </nav>

      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  navLogo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#333',
  },
  logoLink: {
    textDecoration: 'none',
    color: '#007bff',
  },
  navLinks: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  navLink: (active: boolean) => ({
    padding: '0.5rem 1rem',
    textDecoration: 'none',
    color: active ? '#007bff' : '#333',
    fontWeight: active ? '600' : '400',
    borderRadius: '4px',
    transition: 'all 0.2s',
  }),
  logoutButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.875rem',
  },
  loginButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.875rem',
  },
  main: {
    flex: 1,
    padding: '2rem',
  },
};

export default MainLayout;
