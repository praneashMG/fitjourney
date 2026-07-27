import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiCheckCircle, FiActivity, FiPlay, FiPause, FiAlertCircle } from 'react-icons/fi';
import axios from 'axios';
import { useSelector } from 'react-redux';

const ProcessTracker = ({ session, onComplete }) => {
  const { token } = useSelector((state) => state.auth);
  
  const [elapsedTime, setElapsedTime] = useState(session?.elapsedSeconds || 0);
  const [timerStatus, setTimerStatus] = useState(session?.timerStatus || 'running');
  const [targetSeconds, setTargetSeconds] = useState(session?.targetSeconds || 3600);
  
  const [isCompleting, setIsCompleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!session) return;
    
    setTimerStatus(session.timerStatus || 'running');
    setTargetSeconds(session.targetSeconds || 3600);
    
    let baseElapsed = session.elapsedSeconds || 0;
    if (session.timerStatus === 'running' && session.lastTimerActionAt) {
      const now = new Date().getTime();
      const lastAction = new Date(session.lastTimerActionAt).getTime();
      baseElapsed += Math.floor((now - lastAction) / 1000);
    }
    
    setElapsedTime(baseElapsed);
  }, [session]);

  useEffect(() => {
    let interval;
    if (timerStatus === 'running') {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerStatus]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleToggleTimer = async () => {
    if (isToggling) return;
    setIsToggling(true);
    const action = timerStatus === 'running' ? 'pause' : 'resume';
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/workout-session/toggle-timer`,
        { action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setTimerStatus(response.data.data.timerStatus);
        setElapsedTime(response.data.data.elapsedSeconds);
      }
    } catch (error) {
      console.error('Error toggling timer:', error);
    }
    setIsToggling(false);
  };

  const handleComplete = async () => {
    if (elapsedTime < targetSeconds) {
       setErrorMsg(`Workout incomplete. You need to train for at least ${Math.ceil(targetSeconds/60)} minutes.`);
       return;
    }
    
    setIsCompleting(true);
    setErrorMsg('');
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/workout-session/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        onComplete(response.data.data);
      }
    } catch (error) {
      console.error('Error completing session:', error);
      if (error.response?.data?.message) {
         setErrorMsg(error.response.data.message);
      }
      setIsCompleting(false);
    }
  };

  if (!session) return null;

  const progressPercent = Math.min((elapsedTime / targetSeconds) * 100, 100);
  const isTimeMet = elapsedTime >= targetSeconds;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card"
      style={{ border: '2px solid var(--primary-blue)', position: 'relative', overflow: 'hidden' }}
    >
      {timerStatus === 'running' && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'var(--primary-blue)', animation: 'pulse 2s infinite' }}></div>
      )}
      
      <div className="section-header">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-blue)' }}>
          <FiActivity className={timerStatus === 'running' ? "spin-slow" : ""} /> 
          {timerStatus === 'paused' ? 'Workout Paused' : 'Active Workout'}
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem', gap: '1.5rem' }}>
        
        {/* Timer Display */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '3rem', fontWeight: 800, color: timerStatus === 'paused' ? '#94a3b8' : '#0f172a', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiClock color={timerStatus === 'paused' ? '#94a3b8' : '#64748b'} size={32} />
            {formatTime(elapsedTime)}
          </div>
          
          <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>
            Target: {formatTime(targetSeconds)}
          </div>

          {/* Progress Bar */}
          <div style={{ width: '100%', maxWidth: '300px', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', background: isTimeMet ? '#10b981' : 'var(--primary-blue)', transition: 'width 1s linear' }}></div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
          <button 
            onClick={handleToggleTimer}
            disabled={isToggling}
            style={{ 
              flex: 1, 
              padding: '1rem', 
              borderRadius: '12px', 
              border: 'none', 
              background: timerStatus === 'running' ? '#fff1f2' : '#ecfdf5',
              color: timerStatus === 'running' ? '#e11d48' : '#059669',
              fontWeight: 600,
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {timerStatus === 'running' ? <><FiPause size={20} /> Pause</> : <><FiPlay size={20} /> Resume</>}
          </button>
        </div>

        {errorMsg && (
          <div style={{ width: '100%', padding: '0.75rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiAlertCircle /> {errorMsg}
          </div>
        )}

        <div style={{ width: '100%', background: '#f8fafc', padding: '1.5rem', borderRadius: '12px' }}>
          <h4 style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem', fontWeight: 600, textTransform: 'uppercase' }}>Exercises</h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto' }}>
            {session.exercises && session.exercises.length > 0 ? (
              session.exercises.map((exercise, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}></div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>{exercise.name}</div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>
                        {exercise.sets && exercise.reps ? `${exercise.sets} Sets × ${exercise.reps}` : 'As directed'}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: '#64748b', textAlign: 'center', fontSize: '0.9rem' }}>Open session. Keep working hard!</p>
            )}
          </div>
        </div>

        <button 
          className="btn-modern-primary" 
          style={{ 
            width: '100%', 
            padding: '1rem', 
            justifyContent: 'center', 
            fontSize: '1.1rem', 
            gap: '0.5rem',
            opacity: (!isTimeMet || isCompleting) ? 0.6 : 1,
            cursor: (!isTimeMet || isCompleting) ? 'not-allowed' : 'pointer'
          }}
          onClick={handleComplete}
          disabled={!isTimeMet || isCompleting}
        >
          {isCompleting ? 'Saving...' : <><FiCheckCircle size={20} /> Complete Workout</>}
        </button>

      </div>
    </motion.div>
  );
};

export default ProcessTracker;
