import React from 'react';
import { motion } from 'framer-motion';

const Achievements = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
        style={{ padding: '3rem', textAlign: 'center' }}
      >
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#0f172a' }}>My Achievements</h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Unlock badges by hitting your fitness and diet goals consistently.
        </p>
        
        <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '2rem' }}>
          
          {/* Example Badge 1 */}
          <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>First Workout</h3>
            <p style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '0.5rem', fontWeight: 600 }}>Unlocked on Jul 1</p>
          </div>

          {/* Example Badge 2 */}
          <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔥</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>7 Day Streak</h3>
            <p style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '0.5rem', fontWeight: 600 }}>Unlocked on Jul 8</p>
          </div>

          {/* Locked Badge */}
          <div style={{ background: 'rgba(255,255,255,0.4)', padding: '2rem', borderRadius: '16px', border: '1px dashed #cbd5e1', display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.6, filter: 'grayscale(100%)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏃‍♂️</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Marathon Ready</h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>Locked</p>
          </div>
          
          {/* Locked Badge */}
          <div style={{ background: 'rgba(255,255,255,0.4)', padding: '2rem', borderRadius: '16px', border: '1px dashed #cbd5e1', display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.6, filter: 'grayscale(100%)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💯</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Perfect Month</h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>Locked</p>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default Achievements;
