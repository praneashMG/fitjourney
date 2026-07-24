import React from 'react';

const TodayDietWidget = () => {
  return (
    <div className="auth-card" style={{ padding: '1.5rem', width: 'auto', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ color: 'white', marginBottom: '1rem' }}>Today's Diet</h3>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px' }}>
          <p style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>BREAKFAST</p>
          <p style={{ color: 'white', fontSize: '0.875rem' }}>Oats + Eggs + Banana</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px' }}>
          <p style={{ color: 'var(--secondary)', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>LUNCH</p>
          <p style={{ color: 'white', fontSize: '0.875rem' }}>Chicken + Rice + Veggies</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px' }}>
          <p style={{ color: '#10B981', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>DINNER</p>
          <p style={{ color: 'white', fontSize: '0.875rem' }}>Fish + Salad</p>
        </div>
      </div>
      
      <button className="btn btn-secondary btn-block" style={{ marginTop: '1.5rem' }}>View Full Diet</button>
    </div>
  );
};

export default TodayDietWidget;
