import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FiPlus } from 'react-icons/fi';
import axios from 'axios';
import { useSelector } from 'react-redux';

const ProgressCharts = () => {
  const { token } = useSelector(state => state.auth);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showInput, setShowInput] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchWeightHistory = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/dashboard/weight-history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching weight history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchWeightHistory();
    }
  }, [token]);

  const handleUpdateWeight = async () => {
    if (!newWeight || isNaN(newWeight)) return;
    
    setUpdating(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/dashboard/weight`, 
        { weight: Number(newWeight) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setNewWeight('');
        setShowInput(false);
        fetchWeightHistory(); // Refresh the chart
      }
    } catch (error) {
      console.error('Error logging weight:', error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
      className="glass-card"
    >
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Weight Progress</h2>
        
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {showInput ? (
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <input 
                type="number" 
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                placeholder="kg"
                style={{ width: '60px', padding: '0.25rem 0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}
                disabled={updating}
              />
              <button 
                onClick={handleUpdateWeight}
                disabled={updating}
                style={{ padding: '0.25rem 0.75rem', background: 'var(--primary-blue)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}
              >
                {updating ? '...' : 'Save'}
              </button>
              <button 
                onClick={() => setShowInput(false)}
                disabled={updating}
                style={{ padding: '0.25rem 0.5rem', background: '#e2e8f0', color: '#64748b', border: 'none', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowInput(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0.35rem 0.75rem', background: '#f1f5f9', color: 'var(--primary-blue)', border: 'none', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}
            >
              <FiPlus /> Log Weight
            </button>
          )}

          <select style={{ padding: '0.35rem 0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', fontSize: '0.85rem' }}>
            <option>This Week</option>
            <option>This Month</option>
            <option>6 Months</option>
          </select>
        </div>
      </div>

      <div style={{ height: '250px', width: '100%', marginTop: '1rem' }}>
        {loading ? (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
            Loading chart...
          </div>
        ) : data.length === 0 ? (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
            No weight data logged yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary-blue)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--primary-blue)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} domain={['dataMin - 1', 'dataMax + 1']} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                itemStyle={{ color: 'var(--primary-blue)', fontWeight: 600 }}
              />
              <Area type="monotone" dataKey="weight" stroke="var(--primary-blue)" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--primary-blue)' }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
};

export default ProgressCharts;
