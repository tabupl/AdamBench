/**
 * Profile Page
 */

import { useState, useEffect } from 'react';
import { useAuthContext } from '../components/AuthProvider';
import './Profile.css';

export const Profile = () => {
  const { user, isLoading, updateProfile } = useAuthContext();
  const [formData, setFormData] = useState({ username: '', email: '' });
  const [errors, setErrors] = useState({ username: '', email: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) setFormData({ username: user.username, email: user.email });
  }, [user]);

  const validate = () => {
    const errs = { username: '', email: '' };
    if (!formData.username.trim()) { errs.username = 'Required'; return false; }
    if (formData.username.trim().length < 3) { errs.username = 'Min 3 chars'; return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { errs.email = 'Invalid email'; return false; }
    setErrors(errs);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await updateProfile({ username: formData.username.trim(), email: formData.email.trim() });
    } catch { /* handle error */ }
    setSubmitting(false);
  };

  if (isLoading) return <div className="loading">Loading...</div>;
  if (!user) return <div className="login-prompt">Please <a href="/login" className="link">login</a> to view your profile</div>;

  return (
    <div className="profile-page">
      <div className="profile-content">
        <header className="profile-header">
          <h1>Profile</h1>
        </header>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className={errors.username ? 'input input-error' : 'input'}
              disabled={submitting}
            />
            {errors.username && <span className="error-message">{errors.username}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={errors.email ? 'input input-error' : 'input'}
              disabled={submitting}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          <div className="form-actions">
            <button type="button" onClick={() => setFormData({ username: user.username, email: user.email })} disabled={submitting} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn btn-primary">
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        <div className="profile-info">
          <h2>Your Information</h2>
          <div className="info-card">
            <div className="info-row">
              <span className="label">Username:</span>
              <span className="value">{user.username}</span>
            </div>
            <div className="info-row">
              <span className="label">Email:</span>
              <span className="value">{user.email}</span>
            </div>
            <div className="info-row">
              <span className="label">User ID:</span>
              <span className="value">{user.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;