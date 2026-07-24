import React from 'react';

const ProgressChartWidget = () => {
  return (
    <div className="auth-card" style={{ padding: '1.5rem', width: 'auto', minHeight: '250px' }}>
      <h3 style={{ color: 'white', marginBottom: '1rem' }}>Weight Progress</h3>
      <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 1rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ height: '90%', width: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px 4px 0 0' }}></div>
        <div style={{ height: '85%', width: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px 4px 0 0' }}></div>
        <div style={{ height: '80%', width: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px 4px 0 0' }}></div>
        <div style={{ height: '70%', width: '40px', background: 'var(--primary)', borderRadius: '4px 4px 0 0' }}></div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1rem 0', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
        <span>Wk 1</span>
        <span>Wk 2</span>
        <span>Wk 3</span>
        <span style={{ color: 'white' }}>Current</span>
      </div>
    </div>
  );
};

export default ProgressChartWidget;
