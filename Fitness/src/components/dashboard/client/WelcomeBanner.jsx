import React from 'react';
import { motion } from 'framer-motion';

const WelcomeBanner = ({ user }) => {
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const today = new Date().toLocaleDateString(undefined, dateOptions);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="welcome-banner"
    >
      <div className="welcome-content">
        <h1>Good Morning, {user?.fullName?.split(' ')[0] || 'User'} 👋</h1>
        <p>Stay consistent today!<br/>Small daily progress creates big long-term results.</p>
        <div style={{ marginBottom: '1.5rem', opacity: 0.8, fontSize: '0.9rem' }}>
          {today}
        </div>
        <button className="btn-modern">
          Start Today's Workout
        </button>
      </div>
      
      {/* Fallback illustration using a simple SVG shape if no image is available */}
      <svg className="welcome-illustration" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path fill="#ffffff" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.6,-46.3C91.4,-33.5,98,-18,97.7,-2.6C97.4,12.8,90.2,28,81.5,41.9C72.8,55.8,62.7,68.4,49.8,77.3C36.9,86.2,21.2,91.4,5.4,90.5C-10.4,89.6,-26.1,82.5,-39.6,73.5C-53.1,64.5,-64.4,53.6,-73.2,40.6C-82,27.6,-88.3,12.5,-89.1,-2.9C-89.9,-18.3,-85.2,-34,-76.3,-46.8C-67.4,-59.6,-54.3,-69.5,-40.5,-76.7C-26.7,-83.9,-12.2,-88.4,1.8,-91.6C15.8,-94.8,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
      </svg>
    </motion.div>
  );
};

export default WelcomeBanner;
