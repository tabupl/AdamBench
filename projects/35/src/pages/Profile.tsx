import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth';

export function Profile() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  if (!user) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);
    setSaved(false);
    try {
      await updateProfile({ name, email });
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const onName = (e: ChangeEvent<HTMLInputElement>) => { setName(e.target.value); setError(''); setSaved(false); };
  const onEmail = (e: ChangeEvent<HTMLInputElement>) => { setEmail(e.target.value); setError(''); setSaved(false); };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>My Profile</h1>
          <p>Update your personal information below.</p>
        </div>
        <Link to="/dashboard" className="btn btn-outline">&larr; Back</Link>
      </div>

      <div className="card form-card">
        <h3>Personal Information</h3>
        <form onSubmit={handleSubmit} className="profile-form">
          {saved && <div className="alert success">Profile updated successfully!</div>}
          {error && <div className="alert error">{error}</div>}

          <div className="form-group">
            <label htmlFor="profile-name">Name</label>
            <input id="profile-name" type="text" value={name} onChange={onName} required minLength={2} />
          </div>

          <div className="form-group">
            <label htmlFor="profile-email">Email</label>
            <input id="profile-email" type="email" value={email} onChange={onEmail} required />
          </div>

          <div className="form-group">
            <label>Role</label>
            <p className="read-only-field">
              <span className={`badge ${user.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>{user.role}</span>
            </p>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={isSaving}>
              {isSaving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
