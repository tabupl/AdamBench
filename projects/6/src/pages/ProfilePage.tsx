import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, email });
    setMessage('Profile updated successfully');
  };

  const goBack = () => navigate('/dashboard');

  return (
    <div style={styles.container}>
      <h2>User Profile</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>Save</button>
        <button type="button" onClick={goBack} style={styles.button}>Back</button>
        {message && <p style={styles.success}>{message}</p>}
      </form>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '40px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
    gap: '10px',
  },
  input: {
    padding: '8px',
    fontSize: '1rem',
  },
  button: {
    padding: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  success: {
    color: 'green',
    marginTop: '10px',
  },
};

export default ProfilePage;
