import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const UserProfilePage: React.FC = () => {
  const { name, email, updateProfile } = useAuth();
  const [newName, setNewName] = useState(name);
  const [newEmail, setNewEmail] = useState(email);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim() && newEmail.trim()) {
      updateProfile(newName.trim(), newEmail.trim());
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '100px auto', padding: '30px', border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center' }}>
      <h1 style={{ color: '#ffc107' }}>User Profile</h1>
      <p style={{ fontSize: '1.2em', marginBottom: '30px' }}>Manage your account details.</p>

      <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Name:</label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            required
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            required
          />
        </div>
        <button 
          type="submit" 
          style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '20px' }}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default UserProfilePage;