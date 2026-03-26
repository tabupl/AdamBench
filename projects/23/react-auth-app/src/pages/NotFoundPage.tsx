import { useNavigate } from "react-router-dom";

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="auth-wrapper">
      <div className="notfound-card">
        <p className="notfound-code">404</p>
        <h2>Page not found</h2>
        <p className="auth-subtitle">
          The page you're looking for doesn't exist.
        </p>
        <button className="btn-primary" onClick={() => navigate(-1)}>
          Go back
        </button>
      </div>
    </div>
  );
}
