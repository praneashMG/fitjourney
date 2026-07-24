import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCoachDashboard } from '../../redux/slices/dashboardSlice';
import { motion } from 'framer-motion';
import { FiUsers, FiCalendar, FiDollarSign, FiClock, FiActivity, FiTrendingUp, FiArrowRight, FiCheckCircle, FiStar } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const CoachDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { data: dashboardData, isLoading } = useSelector((state) => state.dashboard);
  const dispatch = useDispatch();
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    dispatch(fetchCoachDashboard());
  }, [dispatch]);

  const { totalClients, activePlans, todaysSessions, pendingReviews, chartData = [0, 0, 0, 0, 0, 0, 0], recentActivity = [] } = dashboardData || {};

  const maxVal = Math.max(...chartData, 1); // Avoid division by zero issues
  const peakIndex = chartData.indexOf(Math.max(...chartData));

  const stats = [
    { id: 1, title: 'Total Clients', value: totalClients || 0, icon: <FiUsers />, color: '#3b82f6', bg: '#eff6ff' },
    { id: 2, title: 'Active Plans', value: activePlans || 0, icon: <FiActivity />, color: '#10b981', bg: '#ecfdf5' },
    { id: 3, title: 'Today\'s Sessions', value: todaysSessions || 0, icon: <FiCalendar />, color: '#8b5cf6', bg: '#f5f3ff' },
    { id: 4, title: 'Pending Reviews', value: pendingReviews || 0, icon: <FiClock />, color: '#f59e0b', bg: '#fffbeb' }
  ];

  const getIconForType = (type) => {
    if (type === 'workout') return <FiCheckCircle color="#10b981" />;
    if (type === 'diet') return <FiCheckCircle color="#10b981" />;
    if (type === 'client') return <FiStar color="#f59e0b" />;
    return <FiActivity color="#3b82f6" />;
  };

  return (
    <div style={{ padding: '2rem 3rem', maxWidth: '1400px', margin: '0 auto', fontFamily: 'Inter, sans-serif', backgroundColor: '#fafafa', minHeight: '100vh' }}>
      
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
      >
        <div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#64748b' }}>Overview</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-1px', margin: '0.25rem 0' }}>
            Welcome back, {user?.fullName?.split(' ')[0] || 'Coach'}! 👋
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.05rem', margin: 0 }}>
            Here is what's happening with your clients today.
          </p>
        </div>
        <Link to="/clients" style={{ textDecoration: 'none' }}>
          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '12px' }}>
            Manage Clients <FiArrowRight />
          </button>
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            onMouseEnter={() => setHoveredCard(stat.id)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{ 
              background: 'white', 
              padding: '1.75rem', 
              borderRadius: '20px',
              border: '1px solid #f1f5f9',
              boxShadow: hoveredCard === stat.id ? '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)' : '0 4px 6px -1px rgba(0, 0, 0, 0.02)',
              transition: 'all 0.3s ease',
              transform: hoveredCard === stat.id ? 'translateY(-5px)' : 'translateY(0)',
              cursor: 'default',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: stat.bg, color: stat.color, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem' }}>
                {stat.icon}
              </div>
              <FiTrendingUp color={stat.color} style={{ opacity: 0.5 }} />
            </div>
            <div>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500, marginTop: '0.5rem' }}>{stat.title}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* Performance Chart (Visual Mockup) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ background: 'white', borderRadius: '24px', padding: '2rem', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.03)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Client Engagement</h3>
            <select style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontSize: '0.85rem', outline: 'none' }}>
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
          
          <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '2%', paddingBottom: '1rem', borderBottom: '1px dashed #e2e8f0' }}>
            {chartData.map((height, idx) => (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem', height: '100%' }}>
                <motion.div 
                  initial={{ height: '0%' }}
                  animate={{ height: `${(height / maxVal) * 100}%` }}
                  transition={{ duration: 1, delay: 0.5 + (idx * 0.1), type: 'spring' }}
                  style={{ 
                    width: '100%', 
                    background: idx === peakIndex ? 'linear-gradient(to top, #3b82f6, #60a5fa)' : 'linear-gradient(to top, #e2e8f0, #f1f5f9)', 
                    borderRadius: '8px 8px 0 0',
                    position: 'relative'
                  }}
                >
                  {idx === peakIndex && (
                    <div style={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)', background: '#1e293b', color: 'white', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                      Peak
                    </div>
                  )}
                </motion.div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx]}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity Feed */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{ background: 'white', borderRadius: '24px', padding: '2rem', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.03)', display: 'flex', flexDirection: 'column' }}
        >
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: '0 0 1.5rem 0' }}>Recent Activity</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
            {recentActivity.map((activity, idx) => {
              // Convert absolute time to relative (e.g. 2 hours ago)
              const timeDiff = new Date() - new Date(activity.time);
              const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
              const timeText = hoursAgo < 1 ? 'Just now' : hoursAgo < 24 ? `${hoursAgo} hours ago` : `${Math.floor(hoursAgo / 24)} days ago`;
              
              return (
              <div key={activity.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f8fafc', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0, border: '1px solid #f1f5f9' }}>
                  {getIconForType(activity.type)}
                </div>
                <div>
                  <div style={{ fontSize: '0.95rem', color: '#1e293b', fontWeight: 600, lineHeight: 1.4 }}>{activity.text}</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>{timeText}</div>
                </div>
              </div>
            )})}
            {recentActivity.length === 0 && (
              <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: '2rem' }}>No recent activity</div>
            )}
          </div>

          <button className="btn btn-secondary" style={{ width: '100%', marginTop: '2rem', background: '#f8fafc', color: '#64748b' }}>
            View All Activity
          </button>
        </motion.div>

      </div>
    </div>
  );
};

export default CoachDashboard;
