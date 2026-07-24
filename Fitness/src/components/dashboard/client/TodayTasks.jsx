import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheckSquare, FiSquare } from 'react-icons/fi';

const TodayTasks = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Drink 3L Water', completed: false },
    { id: 2, title: 'Complete Workout', completed: true },
    { id: 3, title: 'Follow Diet Plan', completed: false },
    { id: 4, title: 'Stretch for 10 mins', completed: false },
    { id: 5, title: 'Sleep 8 Hours', completed: false },
    { id: 6, title: 'Update Weight', completed: true }
  ]);

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = Math.round((completedCount / tasks.length) * 100);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.9 }}
      className="glass-card"
    >
      <div className="section-header">
        <h2>Today's Tasks</h2>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-blue)', background: 'rgba(37,99,235,0.1)', padding: '2px 8px', borderRadius: '12px' }}>
          {progress}%
        </span>
      </div>

      <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', marginBottom: '1.25rem', overflow: 'hidden' }}>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1 }}
          style={{ height: '100%', background: 'var(--primary-blue)', borderRadius: '3px' }}
        ></motion.div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {tasks.map(task => (
          <div 
            key={task.id} 
            onClick={() => toggleTask(task.id)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '8px',
              transition: 'background 0.2s',
              ':hover': { background: 'rgba(255,255,255,0.5)' }
            }}
          >
            {task.completed ? 
              <FiCheckSquare size={20} color="var(--primary-blue)" /> : 
              <FiSquare size={20} color="#cbd5e1" />
            }
            <span style={{ 
              fontSize: '0.95rem', 
              color: task.completed ? '#94a3b8' : '#334155',
              textDecoration: task.completed ? 'line-through' : 'none',
              fontWeight: 500
            }}>
              {task.title}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default TodayTasks;
