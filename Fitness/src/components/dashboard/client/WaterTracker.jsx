import React from 'react';
import { motion } from 'framer-motion';
import { FiDroplet, FiPlus } from 'react-icons/fi';

const WaterTracker = () => {
  const current = 2.2;
  const goal = 3.0;
  const percentage = (current / goal) * 100;
  
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="glass-card"
    >
      <div className="section-header">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FiDroplet color="#3b82f6" /> Water Tracker
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '1rem 0' }}>
        
        {/* SVG Progress Circle */}
        <div style={{ position: 'relative', width: '140px', height: '140px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
            <circle 
              cx="70" cy="70" r={radius} 
              fill="none" stroke="#f1f5f9" strokeWidth="12" 
            />
            <circle 
              cx="70" cy="70" r={radius} 
              fill="none" stroke="#3b82f6" strokeWidth="12" 
              strokeDasharray={circumference} 
              strokeDashoffset={offset} 
              strokeLinecap="round" 
              style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
            />
          </svg>
          <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', lineHeight: '1' }}>{current}</span>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, letterSpacing: '1px' }}>/ {goal} L</span>
          </div>
        </div>

        {/* 8 Pills */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {[1,2,3,4,5,6,7,8].map(glass => (
            <div key={glass} style={{ 
              width: '14px', 
              height: '18px', 
              borderRadius: '4px', 
              background: glass <= Math.floor((current/goal)*8) ? '#3b82f6' : '#e2e8f0',
              transition: 'background 0.3s'
            }}></div>
          ))}
        </div>

        {/* Add Water Button */}
        <button className="btn-modern-primary" style={{ width: '100%', position: 'relative', display: 'flex', justifyContent: 'center', padding: '1rem', borderRadius: '8px' }}>
          <FiPlus size={18} style={{ position: 'absolute', left: '1rem' }} /> 
          <span style={{ fontWeight: 600 }}>Add Water</span>
        </button>
      </div>
    </motion.div>
  );
};

export default WaterTracker;
