import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, LayoutDashboard, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Sidebar */}
      <aside style={{ width: '250px', backgroundColor: '#1f2937', color: 'white', padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
          <LayoutDashboard size={24} />
          <span>MyApp</span>
        </div >
        <nav>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li onClick={() => navigate('/dashboard')} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <LayoutDashboard size={20} />
              Dashboard
            </li>
            <li onClick={() => navigate('/profile')} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <User size={20} />
              Profile
            </li>
            <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <Settings size={20} />
              Settings
            </li>
          </ul>
        </nav>
        <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #374151' }}>
          <button
            onClick={logout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'none',
              border: 'none',
              color: '#fca5a5',
              cursor: 'pointer',
              fontSize: '1rem',
              padding: 0
            }}
          >
            <LogOut size={20} />
            Logout
          </button>
        </div >
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem' }}>
        <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827' }}>Dashboard</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: '#4b5563' }}>Welcome, <strong>{user?.name}</strong></span >
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
              {user?.name.charAt(0).toUpperCase()}
            </div >
          </div >
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ color: '#6b7280', fontSize: '0.875rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Total Users</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>1,284</p>
          </div >
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ color: '#6b7280', fontSize: '0.875rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Active Sessions</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>42</p>
          </div >
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ color: '#6b7280', fontSize: '0.875rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Revenue</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>$12,450</p>
          </div >
        </div >

        <div style={{ marginTop: '2rem', backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ marginBottom: '1rem' }}>Recent Activity</h2>
          <p style={{ color: '#6b7280' }}>No recent activity to show.</p>
        </div >
      </main>
    </div >
  );
};

export default DashboardPage;