import React from 'react';
import { motion } from 'framer-motion';
import { FiVideo, FiCalendar, FiClock } from 'react-icons/fi';
import { useSelector } from 'react-redux';

const UpcomingSession = ({ user }) => {
  const coachName = user?.assignedCoach?.fullName || 'Your Coach';
  
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 1.1 }}
      className="glass-card"
      style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white' }}
    >
      <div className="section-header" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ color: 'white' }}>Upcoming Session</h2>
        <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>Online</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <FiVideo size={24} color="#60a5fa" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Weekly Check-in</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>with {coachName}</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem' }}>
            <FiCalendar /> {formattedDate}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem' }}>
            <FiClock /> 6:00 PM
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button className="btn-modern-primary" style={{ flex: 1, justifyContent: 'center' }}>
            Join Session
          </button>
          <button className="btn-modern" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', flex: 1, justifyContent: 'center' }}>
            Reschedule
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default UpcomingSession;
