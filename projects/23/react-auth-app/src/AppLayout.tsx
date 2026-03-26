import { useNavigate, NavLink } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "./hooks/useAuth";

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <header className="navbar">
        <div className="navbar-brand">
          <span className="logo-icon">⚡</span>
          <span>AppName</span>
        </div>

        <nav className="navbar-nav">
          <NavLink to="/dashboard" className={({ isActive }) => "nav-link" + (isActive ? " nav-link--active" : "")}>
            Dashboard
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => "nav-link" + (isActive ? " nav-link--active" : "")}>
            Profile
          </NavLink>
        </nav>

        <div className="navbar-user">
          <NavLink to="/profile" className="avatar" aria-label="Go to profile">
            {user?.avatarInitials}
          </NavLink>
          <span className="user-name">{user?.name}</span>
          <button className="btn-logout" onClick={() => { logout(); navigate("/login", { replace: true }); }}>
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">{children}</main>
    </div>
  );
}
