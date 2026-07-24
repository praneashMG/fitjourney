import React from 'react';
import { motion } from 'framer-motion';
import { FiBell, FiZap } from 'react-icons/fi';

const AlertsAndTips = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 1.4 }}
      className="glass-card"
    >
      <div className="section-header">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FiZap color="#f59e0b" /> Daily Tips</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ background: 'rgba(59,130,246,0.05)', borderLeft: '4px solid #3b82f6', padding: '1rem', borderRadius: '0 8px 8px 0' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>Fitness Tip</h4>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Engage your core during compound movements to protect your lower back.</p>
        </div>
        
        <div style={{ background: 'rgba(16,185,129,0.05)', borderLeft: '4px solid #10b981', padding: '1rem', borderRadius: '0 8px 8px 0' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>Nutrition Tip</h4>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Eat a protein-rich snack 30 mins after your workout for optimal recovery.</p>
        </div>
      </div>
    </motion.div>
  );
};

export default AlertsAndTips;
