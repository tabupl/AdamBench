import { useAuth } from '../context/AuthContext';
import type { FormEvent } from 'react';
import type { ChangeEvent } from 'react';
import { useState } from 'react';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    if (input.name === 'name') {
      setName(input.value);
    } else if (input.name === 'email') {
      setEmail(input.value);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateProfile({ name: name.trim(), email: email.trim() });
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={name}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <button type="submit">Save</button>
      </form>
      <button onClick={() => {
        // optionally navigate back to dashboard
      }}>
        Back
      </button>
    </div>
  );
};

export default ProfilePage;