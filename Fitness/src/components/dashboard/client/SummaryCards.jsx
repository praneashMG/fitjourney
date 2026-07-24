import React from 'react';

const SummaryCards = () => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
      <div className="auth-card" style={{ padding: '1.5rem', width: 'auto' }}>
        <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Current Weight</h3>
        <p style={{ fontSize: '1.5rem', color: 'white', fontWeight: 'bold' }}>78 kg</p>
      </div>
      <div className="auth-card" style={{ padding: '1.5rem', width: 'auto' }}>
        <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Goal Weight</h3>
        <p style={{ fontSize: '1.5rem', color: 'white', fontWeight: 'bold' }}>70 kg</p>
      </div>
      <div className="auth-card" style={{ padding: '1.5rem', width: 'auto' }}>
        <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Today's Calories</h3>
        <p style={{ fontSize: '1.5rem', color: 'var(--primary)', fontWeight: 'bold' }}>2150 kcal</p>
      </div>
      <div className="auth-card" style={{ padding: '1.5rem', width: 'auto' }}>
        <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Workout Streak</h3>
        <p style={{ fontSize: '1.5rem', color: 'var(--secondary)', fontWeight: 'bold' }}>15 Days 🔥</p>
      </div>
    </div>
  );
};

export default SummaryCards;
