import React from 'react';
import { motion } from 'framer-motion';

const Sessions = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
        style={{ padding: '3rem', textAlign: 'center' }}
      >
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#0f172a' }}>My Sessions</h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          View your upcoming and past live training sessions with your coach.
        </p>
        
        <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '2rem' }}>
          <div style={{ padding: '2rem', background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', flex: 1, maxWidth: '400px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Upcoming Sessions</h3>
            <p style={{ color: '#94a3b8' }}>No upcoming sessions booked.</p>
            <button className="btn-modern-primary" style={{ marginTop: '1rem' }}>Book Now</button>
          </div>
          <div style={{ padding: '2rem', background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', flex: 1, maxWidth: '400px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Past Sessions</h3>
            <p style={{ color: '#94a3b8' }}>You haven't completed any sessions yet.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Sessions;
