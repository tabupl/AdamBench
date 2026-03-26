import { FormEvent, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../Layout';
import { useAuth } from '../auth';

export const ProfilePage = () => {
  const { user, updateProfile } = useAuth();

  const initialValues = useMemo(
    () => ({
      name: user?.name ?? '',
      email: user?.email ?? '',
    }),
    [user?.name, user?.email],
  );

  const [name, setName] = useState(initialValues.name);
  const [email, setEmail] = useState(initialValues.email);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    try {
      updateProfile({ name, email });
      setMessage('Profile updated successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    }
  };

  return (
    <Layout>
      <h1>Profile</h1>
      <p className="muted">Edit your account details.</p>

      <form onSubmit={handleSubmit} className="form-stack">
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </label>

        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}

        <button type="submit">Save changes</button>
      </form>

      <p className="muted small">
        Back to <Link to="/dashboard">dashboard</Link>
      </p>
    </Layout>
  );
};
