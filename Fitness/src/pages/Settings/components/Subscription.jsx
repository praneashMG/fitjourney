import React from 'react';
import { useSelector } from 'react-redux';

const Subscription = () => {
  const { user } = useSelector((state) => state.auth);
  
  const sub = user?.subscription || {};
  
  const getDaysRemaining = () => {
    if (!sub.expiryDate) return 0;
    const expiry = new Date(sub.expiryDate);
    const today = new Date();
    const diff = expiry - today;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <h2>Subscription</h2>
        <p>Manage your billing and membership plan</p>
      </div>
      
      <div className="stats-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="stat-card" style={{ textAlign: 'left' }}>
          <h3 style={{ color: '#0f172a', marginBottom: '1rem' }}>Current Plan</h3>
          <div className="stat-value">{sub.planType || 'Free'}</div>
          <div className="stat-label">Status: <span style={{ color: sub.status === 'Active' ? '#10b981' : '#f59e0b', fontWeight: 600 }}>{sub.status || 'None'}</span></div>
        </div>
        
        <div className="stat-card" style={{ textAlign: 'left' }}>
          <h3 style={{ color: '#0f172a', marginBottom: '1rem' }}>Plan Details</h3>
          <p style={{ margin: '0.25rem 0' }}><strong>Start Date:</strong> {sub.startDate ? new Date(sub.startDate).toLocaleDateString() : 'N/A'}</p>
          <p style={{ margin: '0.25rem 0' }}><strong>Expiry Date:</strong> {sub.expiryDate ? new Date(sub.expiryDate).toLocaleDateString() : 'N/A'}</p>
          <p style={{ margin: '0.25rem 0', color: '#2563eb', fontWeight: 600 }}>{getDaysRemaining()} Days Remaining</p>
        </div>
      </div>
      
      <div className="form-actions" style={{ justifyContent: 'flex-start', marginTop: '2rem' }}>
        <button className="btn btn-primary">Renew Plan</button>
        <button className="btn btn-secondary">View Payment History</button>
      </div>
    </div>
  );
};

export default Subscription;
