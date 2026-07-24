import React from 'react';

const UpcomingAppointmentWidget = () => {
  return (
    <div className="auth-card" style={{ padding: '1.5rem', width: 'auto' }}>
      <h3 style={{ color: 'white', marginBottom: '1rem' }}>Upcoming Session</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'rgba(99,102,241,0.2)', padding: '1rem', borderRadius: '12px', textAlign: 'center', minWidth: '70px' }}>
          <p style={{ color: 'var(--primary)', fontWeight: 'bold' }}>TOM</p>
          <p style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>10</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>AM</p>
        </div>
        <div>
          <p style={{ color: 'white', fontWeight: '500', marginBottom: '0.25rem' }}>Weekly Check-in</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Coach: John Smith</p>
        </div>
      </div>
      <button className="btn btn-secondary btn-block">Join Meeting</button>
    </div>
  );
};

export default UpcomingAppointmentWidget;
