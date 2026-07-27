import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FiTrendingDown, FiTrendingUp, FiActivity, FiTarget, FiPlus } from 'react-icons/fi';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Progress = () => {
  const { token, user } = useSelector(state => state.auth);
  const [weightData, setWeightData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchWeightHistory = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/dashboard/weight-history?limit=30`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setWeightData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching weight history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchWeightHistory();
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
        fetchWeightHistory();
      }
    } catch (error) {
      console.error('Error logging weight:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading progress data...</div>;

  return (
    <div className="page-container">
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Progress Tracker</h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '0.5rem' }}>Track your body metrics and strength gains over time.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <select className="form-input" style={{ width: '150px' }}>
            <option>Last 6 Weeks</option>
            <option>Last 3 Months</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <FiTrendingDown size={24} />
          </div>
          <div>
            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 0.25rem 0' }}>Current Weight</p>
            <h3 style={{ fontSize: '1.5rem', color: '#0f172a', margin: 0 }}>{user?.currentWeight || '--'} kg</h3>
            <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>Up to date</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <FiActivity size={24} />
          </div>
          <div>
            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 0.25rem 0' }}>Body Fat %</p>
            <h3 style={{ fontSize: '1.5rem', color: '#0f172a', margin: 0 }}>14.5%</h3>
            <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>-2.1% total</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <FiTrendingUp size={24} />
          </div>
          <div>
            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 0.25rem 0' }}>Total Volume</p>
            <h3 style={{ fontSize: '1.5rem', color: '#0f172a', margin: 0 }}>12,450 kg</h3>
            <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>+15% this week</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <FiTarget size={24} />
          </div>
          <div>
            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 0.25rem 0' }}>Workout Consistency</p>
            <h3 style={{ fontSize: '1.5rem', color: '#0f172a', margin: 0 }}>92%</h3>
            <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>On track</span>
          </div>
        </motion.div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        
        {/* Weight Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#0f172a', margin: 0 }}>Weight Trend</h3>
            {showInput ? (
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                <input 
                  type="number" value={newWeight} onChange={(e) => setNewWeight(e.target.value)} placeholder="kg"
                  style={{ width: '60px', padding: '0.25rem 0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}
                  disabled={updating}
                />
                <button onClick={handleUpdateWeight} disabled={updating} style={{ padding: '0.25rem 0.75rem', background: 'var(--primary-blue)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>
                  {updating ? '...' : 'Save'}
                </button>
                <button onClick={() => setShowInput(false)} disabled={updating} style={{ padding: '0.25rem 0.5rem', background: '#e2e8f0', color: '#64748b', border: 'none', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            ) : (
              <button onClick={() => setShowInput(true)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0.35rem 0.75rem', background: '#f1f5f9', color: 'var(--primary-blue)', border: 'none', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>
                <FiPlus /> Log Weight
              </button>
            )}
          </div>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weightData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  labelStyle={{ fontWeight: 600, color: '#0f172a' }}
                />
                <Area type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Progress;
