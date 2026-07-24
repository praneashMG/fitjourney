import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiCoffee, FiSun, FiMoon, FiMoreHorizontal } from 'react-icons/fi';
import axios from 'axios';
import { useSelector } from 'react-redux';

const DietTracker = ({ session, onComplete }) => {
  const { token } = useSelector((state) => state.auth);
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      const response = await axios.put(
        'http://localhost:5000/api/diet-session/complete',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        onComplete(response.data.data);
      }
    } catch (error) {
      console.error('Error completing diet session:', error);
      setIsCompleting(false);
    }
  };

  if (!session || !session.meals) return null;

  const icons = {
    'Breakfast': { icon: <FiCoffee />, color: '#f59e0b' },
    'Lunch': { icon: <FiSun />, color: '#ec4899' },
    'Snacks': { icon: <FiMoreHorizontal />, color: '#8b5cf6' },
    'Dinner': { icon: <FiMoon />, color: '#3b82f6' }
  };

  const mealTypes = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];
  const uiMeals = mealTypes.map(type => {
    const mealItems = session.meals[type] || [];
    return {
      type: type,
      time: type === 'Breakfast' ? '8:00 AM' : type === 'Lunch' ? '1:00 PM' : type === 'Snacks' ? '4:30 PM' : '8:00 PM',
      items: mealItems.map(m => `${m.quantity} ${m.name}`).join(', ') || 'Nothing scheduled',
      icon: icons[type].icon,
      color: icons[type].color
    };
  }).filter(m => m.items !== 'Nothing scheduled');

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card"
      style={{ border: '2px solid #10b981', position: 'relative', overflow: 'hidden' }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: '#10b981', animation: 'pulse 2s infinite' }}></div>
      
      <div className="section-header">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981' }}>
          Tracking Today's Diet
        </h2>
      </div>

      <div style={{ padding: '1rem' }}>
        <p style={{ color: '#64748b', marginBottom: '1.5rem', textAlign: 'center' }}>
          Follow your meal plan for today. Once you're done, mark the day as complete!
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          {uiMeals.length > 0 ? uiMeals.map((meal, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '0.75rem', background: 'rgba(255,255,255,0.4)', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `rgba(${meal.color === '#f59e0b' ? '245,158,11' : meal.color === '#ec4899' ? '236,72,153' : meal.color === '#8b5cf6' ? '139,92,246' : '59,130,246'}, 0.1)`, color: meal.color, display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                {meal.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div className="flex-between" style={{ marginBottom: '0.25rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{meal.type}</h4>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>{meal.time}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0 }}>{meal.items}</p>
              </div>
            </div>
          )) : (
            <p style={{ color: '#64748b', textAlign: 'center' }}>No meals planned.</p>
          )}
        </div>

        <button 
          className="btn-modern-primary" 
          style={{ width: '100%', padding: '1rem', justifyContent: 'center', fontSize: '1.1rem', gap: '0.5rem', background: '#10b981', color: 'white', border: 'none' }}
          onClick={handleComplete}
          disabled={isCompleting}
        >
          {isCompleting ? 'Saving...' : <><FiCheckCircle size={20} /> Complete Diet For Today</>}
        </button>
      </div>
    </motion.div>
  );
};

export default DietTracker;
