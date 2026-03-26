import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './auth';

export function Profile() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = await updateProfile(name, email);
    if (ok) setSuccess(true);
    setLoading(false);
  };

  return (
    <div className="profile-container">
      <header className="profile-header">
        <Link to="/dashboard" className="back-link">← Dashboard</Link>
        <h1>Profile Settings</h1>
      </header>

      <main className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar">
            <div className="avatar-circle">{user?.name?.[0] || 'U'}</div>
          </div>

          <form onSubmit={handleSubmit} className="profile-form">
            {success && <div className="success-message">Profile updated!</div>}

            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input id="name" value={name} onChange={(e) => setName(e.target.value)} required disabled={loading} />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
            </div>

            <div className="form-actions">
              <Link to="/dashboard" className="cancel-button">Cancel</Link>
              <button type="submit" className="save-button" disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>

        <div className="profile-info-card">
          <h3>Account Info</h3>
          <div className="info-row"><span>Member since</span><span>Jan 2024</span></div>
          <div className="info-row"><span>Account type</span><span>Premium</span></div>
          <div className="info-row"><span>Status</span><span className="status-active">Active</span></div>
        </div>
      </main>
    </div>
  );
}
