import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiActivity, FiZap, FiPlayCircle, FiList } from 'react-icons/fi';
import axios from 'axios';
import { useSelector } from 'react-redux';

const TodayWorkout = ({ workoutPlan, onStartSession }) => {
  const { token } = useSelector((state) => state.auth);
  const [isStarting, setIsStarting] = useState(false);

  // If no dynamic plan exists yet, show empty state or fallback
  if (!workoutPlan || !workoutPlan.exercises) {
    return (
      <motion.div className="glass-card">
        <div className="section-header">
          <h2>Today's Workout</h2>
        </div>
        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
          <p>No active workout plan found.</p>
          <p>Please complete your fitness assessment!</p>
        </div>
      </motion.div>
    );
  }

  // Determine today's exercises based on user's progress through the plan
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  let currentProgress = workoutPlan.progress || 0;
  
  // Skip rest days
  let currentDayName = days[currentProgress % 7];
  let todayExercises = workoutPlan.exercises[currentDayName] || [];
  
  let attempts = 0;
  while (todayExercises.length === 0 && attempts < 7) {
    currentProgress++;
    currentDayName = days[currentProgress % 7];
    todayExercises = workoutPlan.exercises[currentDayName] || [];
    attempts++;
  }

  const handleStartWorkout = async () => {
    setIsStarting(true);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/workout-session/start',
        { workoutPlanId: workoutPlan._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success && onStartSession) {
        onStartSession(response.data.data);
      }
    } catch (error) {
      console.error('Error starting workout:', error);
      setIsStarting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="glass-card"
    >
      <div className="section-header">
        <h2>Next Workout: {currentDayName} (Day {currentProgress + 1})</h2>
        <a href="/workouts" className="view-all">View All</a>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
              {workoutPlan.templateId?.name || 'Custom Plan'}
            </h3>
            <div style={{ display: 'flex', gap: '1.5rem', color: '#64748b', fontSize: '0.875rem', fontWeight: 500 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><FiActivity /> {workoutPlan.templateId?.goal || 'Fitness'}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><FiClock /> {todayExercises.length * 10} Minutes</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><FiZap color="#f59e0b" /> Active</span>
            </div>
          </div>
          
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'conic-gradient(var(--primary-blue) 0%, #e2e8f0 0)', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
            <div style={{ width: '48px', height: '48px', background: 'white', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-blue)' }}>
              0%
            </div>
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.75rem', fontWeight: 600 }}>EXERCISES</h4>
          <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr', gap: '0.75rem' }}>
            {todayExercises.length > 0 ? todayExercises.map((exercise, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.95rem', color: '#334155', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary-blue)' }}></div>
                  <span style={{ fontWeight: 600 }}>{exercise.name}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  {exercise.sets && exercise.reps ? `${exercise.sets} Sets × ${exercise.reps}` : 'As directed'}
                </div>
              </div>
            )) : (
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Rest Day! No exercises scheduled for today.</p>
            )}
          </div>
        </div>

        {todayExercises.length > 0 && (
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button 
              className="btn-modern-primary" 
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={handleStartWorkout}
              disabled={isStarting}
            >
              <FiPlayCircle size={18} /> {isStarting ? 'Starting...' : 'Start Workout'}
            </button>
            <button className="btn-modern-outline" style={{ flex: 1, justifyContent: 'center' }}>
              <FiList size={18} /> View Full Plan
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TodayWorkout;
