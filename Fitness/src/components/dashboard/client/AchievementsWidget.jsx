import React from 'react';
import { motion } from 'framer-motion';

const AchievementsWidget = () => {
  const achievements = [
    { icon: '🏆', title: 'First Workout', date: 'Jul 1' },
    { icon: '🔥', title: '7 Day Streak', date: 'Jul 8' },
    { icon: '💪', title: 'Lost 5 kg', date: 'Aug 12' },
    { icon: '🥗', title: 'Diet Champion', date: 'Sep 5' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 1.2 }}
      className="glass-card"
    >
      <div className="section-header">
        <h2>Achievements</h2>
        <a href="/achievements" className="view-all">View All</a>
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {achievements.map((item, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.5)', padding: '1rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', border: '1px solid rgba(255,255,255,0.8)' }}>
            <div style={{ fontSize: '2rem' }}>{item.icon}</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', textAlign: 'center' }}>{item.title}</div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{item.date}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default AchievementsWidget;
