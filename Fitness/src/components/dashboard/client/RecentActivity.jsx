import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiEdit2, FiActivity, FiCreditCard } from 'react-icons/fi';

const RecentActivity = () => {
  const activities = [
    { text: 'Completed Chest Workout', time: '2 hours ago', icon: <FiActivity color="#3b82f6" />, bg: 'rgba(59,130,246,0.1)' },
    { text: 'Coach Updated Diet', time: '5 hours ago', icon: <FiEdit2 color="#f59e0b" />, bg: 'rgba(245,158,11,0.1)' },
    { text: 'Weight Updated to 78kg', time: 'Yesterday', icon: <FiCheckCircle color="#10b981" />, bg: 'rgba(16,185,129,0.1)' },
    { text: 'Subscription Renewed', time: '3 days ago', icon: <FiCreditCard color="#8b5cf6" />, bg: 'rgba(139,92,246,0.1)' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 1.3 }}
      className="glass-card"
    >
      <div className="section-header">
        <h2>Recent Activity</h2>
      </div>

      <div style={{ position: 'relative', marginLeft: '1rem', marginTop: '1rem' }}>
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '15px', width: '2px', background: '#e2e8f0' }}></div>
        
        {activities.map((act, i) => (
          <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', position: 'relative', zIndex: 2 }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: act.bg, display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
              {act.icon}
            </div>
            <div style={{ paddingTop: '0.25rem' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' }}>{act.text}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>{act.time}</div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecentActivity;
