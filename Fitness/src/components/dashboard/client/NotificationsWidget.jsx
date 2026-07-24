import React from 'react';

const NotificationsWidget = () => {
  return (
    <div className="auth-card" style={{ padding: '1.5rem', width: 'auto' }}>
      <h3 style={{ color: 'white', marginBottom: '1rem' }}>Notifications</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', marginTop: '6px' }}></div>
          <div>
            <p style={{ color: 'white', fontSize: '0.875rem' }}>Workout Assigned: Lower Body</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>2 hours ago</p>
          </div>
        </li>
        <li style={{ padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--secondary)', marginTop: '6px' }}></div>
          <div>
            <p style={{ color: 'white', fontSize: '0.875rem', margin: '0 0 0.25rem 0', fontWeight: 600 }}>New Message</p>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', margin: 0 }}>Coach Asswinth replied to your question.</p>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>10m</span>
        </li>
        <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', marginTop: '6px' }}></div>
          <div style={{ flex: 1 }}>
            <p style={{ color: 'white', fontSize: '0.875rem', margin: '0 0 0.25rem 0', fontWeight: 600 }}>Upcoming Session</p>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', margin: 0 }}>
              Session Reminder: {new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at 10 AM
            </p>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default NotificationsWidget;
