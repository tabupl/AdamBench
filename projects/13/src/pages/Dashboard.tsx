import { useAuth } from '../hooks/useAuth';
import { Navigation } from '../components/Navigation';

export function Dashboard() {
  // Use the refactored auth hook
  const { user, logout, clearSession } = useAuth();

  const stats = [
    { label: 'Total Projects', value: '24', icon: '📁' },
    { label: 'Completed Tasks', value: '156', icon: '✅' },
    { label: 'Hours Worked', value: '184', icon: '⏱️' },
    { label: 'Efficiency Score', value: '94%', icon: '⭐' },
  ];

  const recentProjects = [
    { id: '1', name: 'E-commerce Platform', status: 'In Progress', progress: 65 },
    { id: '2', name: 'Mobile App', status: 'Completed', progress: 100 },
    { id: '3', name: 'API Integration', status: 'Pending', progress: 0 },
    { id: '4', name: 'Dashboard UI', status: 'In Progress', progress: 45 },
  ];

  return (
    <div className="container" style={{ paddingTop: '24px' }}>
      <Navigation />
      {/* Header */}
      <div className="header">
        <div className="header-title">OmniCoder Dashboard</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img
              src={user?.avatar}
              alt={user?.name}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
            <span style={{ fontWeight: 500 }}>{user?.name}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={clearSession} className="btn btn-secondary">
              Clear Session
            </button>
            <button onClick={logout} className="btn btn-danger">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '24px', marginTop: '24px' }}>
        {/* Stats Grid */}
        <div className="grid grid-2" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{stat.icon}</div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-2" style={{ gridTemplateColumns: '2fr 1fr' }}>
          {/* Projects Section */}
          <div className="card">
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>
              Recent Projects
            </h2>
            {recentProjects.map((project) => (
              <div key={project.id} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 500 }}>{project.name}</span>
                  <span
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      backgroundColor: project.status === 'Completed' ? '#d1fae5' : project.status === 'In Progress' ? '#dbeafe' : '#fef3c7',
                      color: project.status === 'Completed' ? '#065f46' : project.status === 'In Progress' ? '#1e40af' : '#92400e',
                    }}
                  >
                    {project.status}
                  </span>
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#6b7280' }}>
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div style={{ height: '8px', borderRadius: '4px', background: '#e5e7eb', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${project.progress}%`,
                        background: project.status === 'Completed' ? '#10b981' : project.status === 'In Progress' ? '#3b82f6' : '#f59e0b',
                        borderRadius: '4px',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Activity Feed */}
          <div className="card">
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>Recent Activity</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { time: '2 hours ago', action: 'Completed task', project: 'E-commerce Platform' },
                { time: '5 hours ago', action: 'Updated project', project: 'Mobile App' },
                { time: '1 day ago', action: 'Created new project', project: 'API Integration' },
                { time: '2 days ago', action: 'Completed sprint', project: 'Dashboard UI' },
              ].map((activity, index) => (
                <div key={index} style={{ display: 'flex', gap: '12px', paddingBottom: '12px', borderBottom: index < 3 ? '1px solid #e5e7eb' : 'none' }}>
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#0066cc',
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <p style={{ fontSize: '14px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 500 }}>{activity.action}</span>
                      <span style={{ color: '#6b7280' }}> on {activity.project}</span>
                    </p>
                    <span style={{ fontSize: '12px', color: '#9ca3af' }}>{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
