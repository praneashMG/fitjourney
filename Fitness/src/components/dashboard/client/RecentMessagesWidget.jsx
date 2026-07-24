import React from 'react';

const RecentMessagesWidget = () => {
  return (
    <div className="auth-card" style={{ padding: '1.5rem', width: 'auto' }}>
      <h3 style={{ color: 'white', marginBottom: '1rem' }}>Recent Messages</h3>
      <div style={{ display: 'flex', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
          JS
        </div>
        <div>
          <p style={{ color: 'white', fontSize: '0.875rem', fontWeight: '500' }}>Coach John</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>"Great progress! Increase your water intake today."</p>
        </div>
      </div>
    </div>
  );
};

export default RecentMessagesWidget;
