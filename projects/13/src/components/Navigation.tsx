import { Link, useLocation } from 'react-router-dom';

export function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="site-navigation">
      <ul className="nav-list">
        <li className="nav-item">
          <Link
            to="/dashboard"
            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
          >
            Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/snake"
            className={`nav-link ${isActive('/snake') ? 'active' : ''}`}
          >
            🎮 Snake Game
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/profile"
            className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
          >
            Profile
          </Link>
        </li>
      </ul>
    </nav>
  );
}
