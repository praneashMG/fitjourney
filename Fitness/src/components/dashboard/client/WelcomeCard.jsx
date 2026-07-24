import React from 'react';

const WelcomeCard = ({ user }) => {
  return (
    <div className="auth-card" style={{ padding: '2rem', width: 'auto', background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(236,72,153,0.1) 100%)' }}>
      <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
        👋 Good Morning, {user?.fullName?.split(' ')[0] || 'Client'}
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        Stay consistent! You're 72% closer to your goal.
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Goal</p>
          <p style={{ color: 'white', fontWeight: '500' }}>Lose Weight</p>
        </div>
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Coach</p>
          <p style={{ color: 'white', fontWeight: '500' }}>John Smith</p>
        </div>
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Membership</p>
          <p style={{ color: 'var(--primary)', fontWeight: '500' }}>Premium</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;
