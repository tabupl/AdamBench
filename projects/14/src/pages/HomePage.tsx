import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

export const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuthContext();

  return (
    <div className="home-page">
      <div className="home-container">
        <header className="home-header">
          <h1>Auth App</h1>
          <p>A React + TypeScript Authentication Demo</p>
        </header>

        <main className="home-main">
          <section className="hero-section">
            <h2>Protect your data with secure authentication</h2>
            <p>
              Built with React, TypeScript, and React Router. Features include
              protected routes, fake authentication, and a clean UI.
            </p>
            <button onClick={() => window.location.href = '/login'} className="cta-btn">
              Get Started
            </button>
          </section>

          <section className="features-section">
            <h2>Features</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🔐</div>
                <h3>Protected Routes</h3>
                <p>Secure route protection using React Router</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🎭</div>
                <h3>Authentication</h3>
                <p>Fake authentication with localStorage persistence</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">⚡</div>
                <h3>TypeScript</h3>
                <p>Full type safety with TypeScript</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🎨</div>
                <h3>Modern UI</h3>
                <p>Clean and responsive design</p>
              </div>
            </div>
          </section>

          {!isAuthenticated && (
            <section className="demo-section">
              <h2>Demo Accounts</h2>
              <div className="demo-cards">
                <div className="demo-card">
                  <h3>Admin User</h3>
                  <p>Email: admin@example.com</p>
                  <p>Password: password</p>
                  <Link to="/login" className="login-link">
                    Sign In &rarr;
                  </Link>
                </div>
                <div className="demo-card">
                  <h3>Regular User</h3>
                  <p>Email: user@example.com</p>
                  <p>Password: password</p>
                  <Link to="/login" className="login-link">
                    Sign In &rarr;
                  </Link>
                </div>
              </div>
            </section>
          )}

          {isAuthenticated && (
            <section className="dashboard-preview-section">
              <h2>Your Dashboard</h2>
              <Link to="/dashboard" className="dashboard-link">
                Go to Dashboard &rarr;
              </Link>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};
