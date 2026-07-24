import React from 'react';
import { motion } from 'framer-motion';
import { FiActivity, FiTrendingDown, FiHeart, FiAward } from 'react-icons/fi';

const QuickStats = ({ user }) => {
  const stats = [
    {
      title: 'Current Weight',
      value: user?.currentWeight ? `${user.currentWeight} kg` : '78 kg',
      icon: <FiActivity size={24} color="#3b82f6" />,
      trend: '-1.2 kg this week',
      trendColor: '#10b981',
      delay: 0.1
    },
    {
      title: 'Target Weight',
      value: user?.targetWeight ? `${user.targetWeight} kg` : '70 kg',
      icon: <FiTrendingDown size={24} color="#f59e0b" />,
      trend: 'On track',
      trendColor: '#10b981',
      delay: 0.2
    },
    {
      title: 'BMI',
      value: user?.bmi || '24.6',
      icon: <FiHeart size={24} color="#ef4444" />,
      trend: 'Healthy Range',
      trendColor: '#3b82f6',
      delay: 0.3
    },
    {
      title: 'Workout Streak',
      value: user?.progressStats?.currentStreak ? `${user.progressStats.currentStreak} Days 🔥` : '0 Days 🔥',
      icon: <FiAward size={24} color="#8b5cf6" />,
      trend: `Personal Best: ${user?.progressStats?.bestStreak || 0}`,
      trendColor: '#64748b',
      delay: 0.4
    }
  ];

  return (
    <div className="dashboard-grid quick-stats-grid">
      {stats.map((stat, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: stat.delay }}
          className="glass-card"
          style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}
        >
          <div style={{ 
            width: '48px', 
            height: '48px', 
            borderRadius: '12px', 
            background: 'rgba(255, 255, 255, 0.5)', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
          }}>
            {stat.icon}
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500, marginBottom: '0.25rem' }}>{stat.title}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>{stat.value}</div>
            <div style={{ fontSize: '0.75rem', color: stat.trendColor, fontWeight: 500 }}>{stat.trend}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default QuickStats;
