import { useAuth } from "../hooks/useAuth";
import { useProfile } from "../hooks/useProfile";
import { AppLayout } from "../AppLayout";

export function ProfilePage() {
  const { user } = useAuth();
  const {
    name, setName,
    email, setEmail,
    isDirty,
    saveStatus,
    errorMessage,
    handleSubmit,
    handleReset,
  } = useProfile();

  return (
    <AppLayout>
      <div className="page-header">
        <h2>Profile</h2>
        <p className="dashboard-subtitle">Manage your personal information.</p>
      </div>

      <div className="profile-page-grid">
        {/* ── Account overview ── */}
        <section className="card">
          <h3 className="card-title">Account</h3>

          <div className="profile-overview">
            <div className="avatar avatar-xl">{user?.avatarInitials}</div>
            <div>
              <p className="profile-name">{user?.name}</p>
              <p className="profile-email">{user?.email}</p>
              <span className="badge">Active</span>
            </div>
          </div>

          <dl className="profile-meta">
            <div className="profile-meta-row">
              <dt>User ID</dt>
              <dd>
                <code>{user?.id}</code>
              </dd>
            </div>
            <div className="profile-meta-row">
              <dt>Initials</dt>
              <dd>{user?.avatarInitials}</dd>
            </div>
          </dl>
        </section>

        {/* ── Edit form ── */}
        <section className="card">
          <h3 className="card-title">Edit details</h3>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label htmlFor="profile-name">Full name</label>
              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                autoComplete="name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="profile-email">Email address</label>
              <input
                id="profile-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            {saveStatus === "error" && (
              <p className="form-error" role="alert">{errorMessage}</p>
            )}

            {saveStatus === "success" && (
              <p className="form-success" role="status">
                ✓ Profile updated successfully.
              </p>
            )}

            <div className="profile-form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={handleReset}
                disabled={!isDirty && saveStatus === "idle"}
              >
                Reset
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={!isDirty || saveStatus === "saving"}
              >
                {saveStatus === "saving" ? <span className="btn-spinner" /> : "Save changes"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </AppLayout>
  );
}
