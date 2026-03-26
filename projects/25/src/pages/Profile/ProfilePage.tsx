import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context';
import styles from './Profile.module.css';

export const ProfilePage: React.FC = () => {
  const { user, logout, updateProfile } = useAuthContext();
  const navigate = useNavigate();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const success = await updateProfile({ name, email });

    setIsSaving(false);

    if (success) {
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } else {
      setMessage({ type: 'error', text: 'Invalid email format' });
    }
  };

  const handleCancel = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setIsEditing(false);
    setMessage(null);
  };

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>Profile</div>
        <div className={styles.navLinks}>
          <button onClick={() => navigate('/dashboard')} className={styles.navLink}>Dashboard</button>
          <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1>User Profile</h1>
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className={styles.editBtn}>Edit Profile</button>
            )}
          </div>

          {message && (
            <div className={`${styles.message} ${styles[message.type]}`}>{message.text}</div>
          )}

          <form onSubmit={handleSave} className={styles.form}>
            <div className={styles.avatar}>
              <div className={styles.avatarCircle}>{name.charAt(0).toUpperCase()}</div>
              <span className={styles.avatarHint}>Profile Photo</span>
            </div>

            <div className={styles.field}>
              <label htmlFor="name">Full Name</label>
              <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} disabled={!isEditing} required />
            </div>

            <div className={styles.field}>
              <label htmlFor="email">Email Address</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!isEditing} required />
            </div>

            <div className={styles.field}>
              <label htmlFor="id">User ID</label>
              <input id="id" type="text" value={user?.id || ''} disabled className={styles.readOnly} />
              <span className={styles.hint}>ID cannot be changed</span>
            </div>

            {isEditing && (
              <div className={styles.actions}>
                <button type="button" onClick={handleCancel} className={styles.cancelBtn} disabled={isSaving}>Cancel</button>
                <button type="submit" className={styles.saveBtn} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
};
