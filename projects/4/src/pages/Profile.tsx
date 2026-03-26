import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    // Simulate saving to backend
    setTimeout(() => {
      // In a real app, you would update the user via an API and then update the context.
      // For this demo, we'll just show a success message.
      setMessage('Profile saved successfully!');
      setIsSaving(false);
      // Note: To actually update the context, you would need to add an updateUser method to the auth service.
    }, 1000);
  };

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      {message && <p className="success">{message}</p>}
      <form onSubmit={handleSave}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isSaving}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSaving}
          />
        </div>
        <button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
      <div className="profile-actions">
        <p>
          <strong>User ID:</strong> {user?.id}
        </p>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

export default Profile;
