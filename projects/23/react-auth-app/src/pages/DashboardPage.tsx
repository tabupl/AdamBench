import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AppLayout } from "../AppLayout";

const STATS = [
  { label: "Projects", value: "12", icon: "📁", delta: "+2 this week" },
  { label: "Tasks Done", value: "84", icon: "✅", delta: "+9 today" },
  { label: "Team Members", value: "6", icon: "👥", delta: "No change" },
  { label: "Reports", value: "3", icon: "📊", delta: "+1 this month" },
];

const ACTIVITY = [
  { id: 1, action: "Deployed v2.1.0 to production", time: "2 min ago", icon: "🚀" },
  { id: 2, action: "Merged pull request #42", time: "1 hr ago", icon: "🔀" },
  { id: 3, action: "Created new project 'Alpha'", time: "3 hr ago", icon: "📁" },
  { id: 4, action: "Updated team settings", time: "Yesterday", icon: "⚙️" },
  { id: 5, action: "Invited bob@example.com", time: "2 days ago", icon: "✉️" },
];

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <AppLayout>
      <div className="dashboard-header">
        <h2>Good morning, {user?.name?.split(" ")[0]} 👋</h2>
        <p className="dashboard-subtitle">
          Here's what's happening with your projects today.
        </p>
      </div>

      {/* Stats grid */}
      <section className="stats-grid">
        {STATS.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="stat-top">
              <span className="stat-icon">{stat.icon}</span>
              <span className="stat-value">{stat.value}</span>
            </div>
            <p className="stat-label">{stat.label}</p>
            <p className="stat-delta">{stat.delta}</p>
          </div>
        ))}
      </section>

      {/* Activity feed */}
      <section className="activity-card">
        <h3>Recent Activity</h3>
        <ul className="activity-list">
          {ACTIVITY.map((item) => (
            <li key={item.id} className="activity-item">
              <span className="activity-icon">{item.icon}</span>
              <div className="activity-content">
                <p className="activity-action">{item.action}</p>
                <p className="activity-time">{item.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Profile summary card */}
      <section className="profile-card">
        <div className="profile-card-header">
          <h3>Your Profile</h3>
          <Link to="/profile" className="profile-edit-link">Edit →</Link>
        </div>
        <div className="profile-body">
          <div className="avatar avatar-lg">{user?.avatarInitials}</div>
          <div>
            <p className="profile-name">{user?.name}</p>
            <p className="profile-email">{user?.email}</p>
            <span className="badge">Active</span>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
