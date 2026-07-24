import React from 'react';
import { motion } from 'framer-motion';
import { FiMessageSquare, FiCalendar, FiStar } from 'react-icons/fi';
import { useSelector } from 'react-redux';

const MyCoach = () => {
  const { user } = useSelector(state => state.auth);
  const coach = user?.assignedCoach;

  if (!coach) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
        <h2>No Coach Assigned</h2>
        <p>Please contact support to get assigned to a coach.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #e2e8f0' }}>
          <img 
            src={coach.profileImage || "https://via.placeholder.com/200"} 
            alt="Coach" 
            style={{ width: '160px', height: '160px', borderRadius: '24px', objectFit: 'cover', border: '2px solid #e2e8f0' }} 
          />
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#0f172a' }}>{coach.fullName}</h1>
            <p style={{ color: '#3b82f6', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>{coach.specialization || coach.role || 'Fitness Coach'}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b', fontSize: '1.2rem', marginBottom: '1.5rem' }}>
              <FiStar fill="#f59e0b" /> {coach.coachStats?.rating || 4.9} ({coach.coachStats?.reviews || 120} Reviews)
            </div>
            <p style={{ color: '#64748b', lineHeight: 1.6, maxWidth: '800px' }}>
              I am your dedicated coach for {user.fitnessGoal || 'your fitness journey'}. Let's work together to hit those goals!
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button className="btn-modern-primary"><FiMessageSquare /> Send Message</button>
              <button className="btn-modern-outline"><FiCalendar /> Book 1-on-1 Session</button>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '2rem', padding: '2rem', background: 'rgba(255,255,255,0.5)', borderRadius: '12px', border: '2px dashed #cbd5e1', textAlign: 'center' }}>
          <p style={{ color: '#94a3b8', fontWeight: 600 }}>Coach Availability Calendar and Reviews Coming Soon 📅</p>
        </div>
      </motion.div>
    </div>
  );
};

export default MyCoach;
