import React from 'react';
import { motion } from 'framer-motion';
import { FiMaximize } from 'react-icons/fi';

const BodyMeasurements = () => {
  const measurements = [
    { label: 'Chest', value: '42"' },
    { label: 'Waist', value: '32"' },
    { label: 'Hip', value: '38"' },
    { label: 'Arm', value: '15"' },
    { label: 'Leg', value: '24"' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 1.5 }}
      className="glass-card"
    >
      <div className="section-header">
        <h2>Body Measurements</h2>
        <button style={{ background: 'none', border: 'none', color: 'var(--primary-blue)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 600 }}>
          <FiMaximize /> Update
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
        {measurements.map((item, i) => (
          <div key={i} className="flex-between" style={{ padding: '0.5rem 0', borderBottom: i !== measurements.length - 1 ? '1px solid var(--glass-border)' : 'none' }}>
            <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>{item.label}</span>
            <span style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: 700 }}>{item.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default BodyMeasurements;
