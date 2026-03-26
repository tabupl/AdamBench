import { useLogin } from "../hooks/useLogin";

export function LoginPage() {
  const { email, setEmail, password, setPassword, error, isSubmitting, handleSubmit } =
    useLogin();

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="logo-icon">⚡</span>
          <h1>AppName</h1>
        </div>

        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">Sign in to your account to continue</p>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoFocus
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          {error && <p className="form-error" role="alert">{error}</p>}

          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? <span className="btn-spinner" /> : "Sign in"}
          </button>
        </form>

        <div className="auth-hint">
          <p>Demo credentials:</p>
          <code>alice@example.com / password123</code>
          <br />
          <code>bob@example.com &nbsp;/ password123</code>
        </div>
      </div>
    </div>
  );
}
