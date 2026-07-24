import React from 'react';
import { motion } from 'framer-motion';
import { FiMessageSquare, FiCalendar, FiStar } from 'react-icons/fi';

const AssignedCoachWidget = ({ user }) => {
  const coach = user?.assignedCoach;

  if (!coach) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="glass-card"
    >
      <div className="section-header">
        <h2>Assigned Coach</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img 
            src={coach.profileImage || 'https://via.placeholder.com/150'} 
            alt={coach.fullName || 'Coach'} 
            style={{ width: '64px', height: '64px', borderRadius: '8px', border: '1px solid #e2e8f0', objectFit: 'cover' }} 
          />
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>
              {coach.fullName ? coach.fullName : 'Your Coach'}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: 600 }}>
              {coach.specialization || coach.role || 'Senior Fitness Coach'}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: '#f59e0b', fontWeight: 700 }}>
              <FiStar fill="#f59e0b" /> {coach.coachStats?.rating || 4.9} ({coach.coachStats?.reviews || 120} Reviews)
            </div>
          </div>
        </div>

        <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '0.75rem', paddingTop: '0.5rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Experience</div>
            <div style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: 700 }}>{coach.coachStats?.experienceYears || 8} Years</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Availability</div>
            <div style={{ fontSize: '0.95rem', color: '#10b981', fontWeight: 700 }}>{coach.coachStats?.availability || 'Available Today'}</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.5rem' }}>
          <button className="btn-modern-primary" style={{ flex: 1, minWidth: '130px', padding: '0.8rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', borderRadius: '8px' }}>
            <FiMessageSquare size={18} /> 
            <span style={{ fontWeight: 600 }}>Message</span>
          </button>
          <button className="btn-modern-outline" style={{ flex: 1, minWidth: '130px', padding: '0.8rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', borderRadius: '8px', borderColor: '#3b82f6', color: '#3b82f6' }}>
            <FiCalendar size={18} /> 
            <span style={{ fontWeight: 600 }}>Book Session</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AssignedCoachWidget;
