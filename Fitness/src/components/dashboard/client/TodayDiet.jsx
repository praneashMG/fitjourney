import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCoffee, FiSun, FiMoon, FiMoreHorizontal, FiActivity } from 'react-icons/fi';
import axios from 'axios';
import { useSelector } from 'react-redux';

const TodayDiet = ({ dietPlan, onStartDiet }) => {
  const { token } = useSelector((state) => state.auth);
  const [isStarting, setIsStarting] = useState(false);

  if (!dietPlan || !dietPlan.meals) {
    return (
      <motion.div className="glass-card">
        <div className="section-header">
          <h2>Today's Diet</h2>
        </div>
        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
          <p>No active diet plan found.</p>
        </div>
      </motion.div>
    );
  }

  // Map backend structure to UI structure
  const icons = {
    'Breakfast': { icon: <FiCoffee />, color: '#f59e0b' },
    'Lunch': { icon: <FiSun />, color: '#ec4899' },
    'Snacks': { icon: <FiMoreHorizontal />, color: '#8b5cf6' },
    'Dinner': { icon: <FiMoon />, color: '#3b82f6' }
  };

  const mealTypes = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];
  const uiMeals = mealTypes.map(type => {
    const mealItems = dietPlan.meals[type] || [];
    return {
      type: type,
      time: type === 'Breakfast' ? '8:00 AM' : type === 'Lunch' ? '1:00 PM' : type === 'Snacks' ? '4:30 PM' : '8:00 PM',
      items: mealItems.map(m => `${m.quantity} ${m.name}`).join(', ') || 'Nothing scheduled',
      icon: icons[type].icon,
      color: icons[type].color
    };
  }).filter(m => m.items !== 'Nothing scheduled');

  const { protein, carbs, fat } = dietPlan.macros || { protein: 0, carbs: 0, fat: 0 };
  const targetCalories = dietPlan.dailyCaloriesTarget || 2000;

  // Rough percentages for doughnut chart based on calories (P: 4, C: 4, F: 9)
  const pCals = protein * 4;
  const cCals = carbs * 4;
  const fCals = fat * 9;
  const totalCals = pCals + cCals + fCals || targetCalories;
  
  const pPct = Math.round((pCals / totalCals) * 100) || 30;
  const cPct = Math.round((cCals / totalCals) * 100) || 40;
  // fPct is the remainder

  // gradient syntax: blue(protein), green(carbs), amber(fat)
  const conicGradient = `conic-gradient(#3b82f6 ${pPct}%, #10b981 ${pPct}% ${pPct + cPct}%, #f59e0b ${pPct + cPct}%, #f59e0b 100%)`;

  // Handle starting the daily diet tracker
  const handleStartDiet = async () => {
    setIsStarting(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/diet-session/start`,
        { dietPlanId: dietPlan._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success && onStartDiet) {
        onStartDiet(response.data.data);
      }
    } catch (error) {
      console.error('Error starting diet session:', error);
      setIsStarting(false);
    }
  };

  const currentProgress = dietPlan.progress || 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="glass-card"
    >
      <div className="section-header">
        <h2>Today's Diet (Day {currentProgress + 1})</h2>
        <a href="/diet" className="view-all">View Diet Plan</a>
      </div>

      <div style={{ display: 'flex', gap: '2rem' }}>
        
        {/* Macros Summary */}
        <div style={{ flex: '0 0 150px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', borderRight: '1px solid var(--glass-border)', paddingRight: '2rem' }}>
          
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: conicGradient, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '90px', height: '90px', background: 'white', borderRadius: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>{targetCalories}</span>
              <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>KCAL TOTAL</span>
            </div>
          </div>

          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div className="flex-between" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#3b82f6' }}></span> Protein</span>
              <span>{protein}g</span>
            </div>
            <div className="flex-between" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#10b981' }}></span> Carbs</span>
              <span>{carbs}g</span>
            </div>
            <div className="flex-between" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#f59e0b' }}></span> Fat</span>
              <span>{fat}g</span>
            </div>
          </div>
        </div>

        {/* Meal List */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {uiMeals.length > 0 ? uiMeals.map((meal, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '0.75rem', background: 'rgba(255,255,255,0.4)', borderRadius: '12px' }}>
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
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '1rem' }}>No meals planned.</p>
          )}
          {uiMeals.length > 0 && (
            <button 
              className="btn-modern-primary" 
              style={{ width: '100%', padding: '0.75rem', justifyContent: 'center', marginTop: '1rem', background: '#10b981', color: 'white', border: 'none' }}
              onClick={handleStartDiet}
              disabled={isStarting}
            >
              <FiActivity size={18} /> {isStarting ? 'Starting...' : "Track Today's Diet"}
            </button>
          )}
        </div>

      </div>
    </motion.div>
  );
};

export default TodayDiet;
