import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui', background: '#0f172a', minHeight: '100vh', color: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <h1>Login</h1>
        <form
          onSubmit={(e) => { e.preventDefault(); navigate('/dashboard'); }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}
        >
          <input type="email" placeholder="Email" style={{ padding: '1rem', border: '1px solid #334155', borderRadius: '8px', background: '#1e293b', color: '#f8fafc' }} />
          <input type="password" placeholder="Password" style={{ padding: '1rem', border: '1px solid #334155', borderRadius: '8px', background: '#1e293b', color: '#f8fafc' }} />
          <button type="submit" style={{ padding: '1rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Sign In</button>
        </form>
        <p style={{ marginTop: '1rem', color: '#94a3b8' }}>
          No account? <Link to="/register" style={{ color: '#6366f1' }}>Register</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
