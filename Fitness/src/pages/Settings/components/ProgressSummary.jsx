import React from 'react';
import { useSelector } from 'react-redux';

const ProgressSummary = () => {
  const { user } = useSelector((state) => state.auth);
  const stats = user?.progressStats || {};

  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <h2>Progress Summary</h2>
        <p>Track your fitness journey</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{user?.currentWeight || '--'} kg</div>
          <div className="stat-label">Current Weight</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{user?.bmi || '--'}</div>
          <div className="stat-label">BMI</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.currentStreak || 0}</div>
          <div className="stat-label">Current Streak (Days)</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.workoutCompletionRate || 0}%</div>
          <div className="stat-label">Workout Completion</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.dietAdherenceRate || 0}%</div>
          <div className="stat-label">Diet Adherence</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalWorkouts || 0}</div>
          <div className="stat-label">Total Workouts</div>
        </div>
      </div>
      
      <div className="overview-card" style={{ marginTop: '2rem', justifyContent: 'center', padding: '3rem 2rem' }}>
        <p style={{ color: '#64748b' }}>Chart visualization will be available after 1 week of logged data.</p>
      </div>
    </div>
  );
};

export default ProgressSummary;
