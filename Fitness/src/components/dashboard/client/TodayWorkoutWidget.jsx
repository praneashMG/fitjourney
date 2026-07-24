import React from 'react';

const TodayWorkoutWidget = () => {
  const workout = [
    { name: 'Warm-up', sets: '-', reps: '5 min', status: 'Done' },
    { name: 'Push-ups', sets: '3', reps: '15', status: 'Pending' },
    { name: 'Bench Press', sets: '4', reps: '12', status: 'Pending' },
    { name: 'Shoulder Press', sets: '3', reps: '12', status: 'Pending' },
  ];

  return (
    <div className="auth-card" style={{ padding: '1.5rem', width: 'auto', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ color: 'white', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
        Today's Workout
        <span style={{ fontSize: '0.875rem', color: 'var(--primary)' }}>Upper Body</span>
      </h3>
      
      <div style={{ flex: 1 }}>
        {workout.map((ex, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" checked={ex.status === 'Done'} readOnly />
              <span style={{ color: ex.status === 'Done' ? 'var(--text-muted)' : 'white', textDecoration: ex.status === 'Done' ? 'line-through' : 'none' }}>{ex.name}</span>
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              {ex.sets !== '-' && `${ex.sets}x`}{ex.reps}
            </div>
          </div>
        ))}
      </div>
      
      <button className="btn btn-primary btn-block" style={{ marginTop: '1.5rem' }}>Start Workout</button>
    </div>
  );
};

export default TodayWorkoutWidget;
