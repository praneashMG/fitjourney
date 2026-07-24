const fs = require('fs');

// 1. Sidebar.jsx
const sidebarContent = `import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [coachMenuOpen, setCoachMenuOpen] = useState(false);
  const [clientMenuOpen, setClientMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/');
  };

  const adminLinks = (
    <>
      <li><NavLink to="/dashboard" className={({isActive}) => isActive ? 'active' : ''}>🏠 Dashboard</NavLink></li>
      
      <li>
        <div 
          onClick={() => setCoachMenuOpen(!coachMenuOpen)} 
          style={{ padding: '0.75rem 1rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <span>👨‍🏫 Coach Management</span>
          <span>{coachMenuOpen ? '▼' : '▶'}</span>
        </div>
        {coachMenuOpen && (
          <ul style={{ paddingLeft: '2rem', listStyle: 'none', background: 'rgba(0,0,0,0.2)' }}>
            <li><NavLink to="/admin/coaches" className={({isActive}) => isActive ? 'active' : ''} style={{fontSize: '0.875rem'}}>• All Coaches</NavLink></li>
            <li><NavLink to="/admin/coaches/add" className={({isActive}) => isActive ? 'active' : ''} style={{fontSize: '0.875rem'}}>• Add Coach</NavLink></li>
            <li><NavLink to="/admin/coaches/pending" className={({isActive}) => isActive ? 'active' : ''} style={{fontSize: '0.875rem'}}>• Pending Approvals</NavLink></li>
          </ul>
        )}
      </li>

      <li>
        <div 
          onClick={() => setClientMenuOpen(!clientMenuOpen)} 
          style={{ padding: '0.75rem 1rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <span>👥 Client Management</span>
          <span>{clientMenuOpen ? '▼' : '▶'}</span>
        </div>
        {clientMenuOpen && (
          <ul style={{ paddingLeft: '2rem', listStyle: 'none', background: 'rgba(0,0,0,0.2)' }}>
            <li><NavLink to="/admin/clients" className={({isActive}) => isActive ? 'active' : ''} style={{fontSize: '0.875rem'}}>• All Clients</NavLink></li>
            <li><NavLink to="/admin/clients/progress" className={({isActive}) => isActive ? 'active' : ''} style={{fontSize: '0.875rem'}}>• Client Progress</NavLink></li>
          </ul>
        )}
      </li>

      <li><NavLink to="/workouts" className={({isActive}) => isActive ? 'active' : ''}>💪 Workout Library</NavLink></li>
      <li><NavLink to="/diet" className={({isActive}) => isActive ? 'active' : ''}>🥗 Diet Library</NavLink></li>
      <li><NavLink to="/appointments" className={({isActive}) => isActive ? 'active' : ''}>📅 Appointments</NavLink></li>
      <li><NavLink to="/memberships" className={({isActive}) => isActive ? 'active' : ''}>💳 Membership Plans</NavLink></li>
      <li><NavLink to="/payments" className={({isActive}) => isActive ? 'active' : ''}>💰 Payments</NavLink></li>
      <li><NavLink to="/reports" className={({isActive}) => isActive ? 'active' : ''}>📊 Reports</NavLink></li>
      <li><NavLink to="/notifications" className={({isActive}) => isActive ? 'active' : ''}>🔔 Notifications</NavLink></li>
      <li><NavLink to="/support" className={({isActive}) => isActive ? 'active' : ''}>🎫 Support Tickets</NavLink></li>
      <li><NavLink to="/settings" className={({isActive}) => isActive ? 'active' : ''}>⚙️ Settings</NavLink></li>
      <li><NavLink to="/profile" className={({isActive}) => isActive ? 'active' : ''}>👤 Profile</NavLink></li>
    </>
  );

  const coachLinks = (
    <>
      <li><NavLink to="/dashboard" className={({isActive}) => isActive ? 'active' : ''}>Dashboard</NavLink></li>
      <li><NavLink to="/clients" className={({isActive}) => isActive ? 'active' : ''}>Clients</NavLink></li>
      <li><NavLink to="/workouts" className={({isActive}) => isActive ? 'active' : ''}>Workouts</NavLink></li>
      <li><NavLink to="/diet" className={({isActive}) => isActive ? 'active' : ''}>Diet Plans</NavLink></li>
      <li><NavLink to="/courses" className={({isActive}) => isActive ? 'active' : ''}>Courses</NavLink></li>
      <li><NavLink to="/payments" className={({isActive}) => isActive ? 'active' : ''}>Payments</NavLink></li>
      <li><NavLink to="/analytics" className={({isActive}) => isActive ? 'active' : ''}>Analytics</NavLink></li>
    </>
  );

  const clientLinks = (
    <>
      <li><NavLink to="/dashboard" className={({isActive}) => isActive ? 'active' : ''}>Dashboard</NavLink></li>
      <li><NavLink to="/profile" className={({isActive}) => isActive ? 'active' : ''}>My Profile</NavLink></li>
      <li><NavLink to="/workouts" className={({isActive}) => isActive ? 'active' : ''}>Workouts</NavLink></li>
      <li><NavLink to="/diet" className={({isActive}) => isActive ? 'active' : ''}>Diet Plan</NavLink></li>
      <li><NavLink to="/progress" className={({isActive}) => isActive ? 'active' : ''}>Progress</NavLink></li>
      <li><NavLink to="/appointments" className={({isActive}) => isActive ? 'active' : ''}>Appointments</NavLink></li>
      <li><NavLink to="/messages" className={({isActive}) => isActive ? 'active' : ''}>Messages</NavLink></li>
      <li><NavLink to="/payments" className={({isActive}) => isActive ? 'active' : ''}>Payments</NavLink></li>
      <li><NavLink to="/achievements" className={({isActive}) => isActive ? 'active' : ''}>Achievements</NavLink></li>
      <li><NavLink to="/settings" className={({isActive}) => isActive ? 'active' : ''}>Settings</NavLink></li>
    </>
  );

  return (
    <aside className="sidebar">
      <ul>
        {user?.role === 'Admin' ? adminLinks : user?.role === 'Coach' ? coachLinks : clientLinks}
      </ul>
      <div style={{ marginTop: 'auto', padding: '1rem' }}>
        <button className="btn btn-secondary btn-block" onClick={handleLogout}>🚪 Logout</button>
      </div>
    </aside>
  );
};

export default Sidebar;
`;
fs.writeFileSync('src/components/layout/Sidebar.jsx', sidebarContent);

// 2. AdminDashboard.jsx
const adminDashboardContent = `import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAdminStats } from '../../redux/slices/adminSlice';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats, isLoading } = useSelector(state => state.admin);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  if (isLoading || !stats) return <p style={{color: 'white'}}>Loading Admin Stats...</p>;

  // Inject active plans dummy data since it's not coming from API yet
  const activePlansCount = 486;

  return (
    <div>
      <h1 style={{ color: 'white', marginBottom: '2rem' }}>Admin Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="auth-card" style={{ padding: '1.5rem', width: 'auto', background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.1) 100%)' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Coaches</h3>
          <p style={{ fontSize: '2rem', color: 'white', fontWeight: 'bold' }}>{stats.totalCoaches}</p>
        </div>
        <div className="auth-card" style={{ padding: '1.5rem', width: 'auto' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Clients</h3>
          <p style={{ fontSize: '2rem', color: 'white', fontWeight: 'bold' }}>{stats.totalClients}</p>
        </div>
        <div className="auth-card" style={{ padding: '1.5rem', width: 'auto' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Revenue</h3>
          <p style={{ fontSize: '2rem', color: '#10B981', fontWeight: 'bold' }}>₹{stats.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="auth-card" style={{ padding: '1.5rem', width: 'auto' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Active Plans</h3>
          <p style={{ fontSize: '2rem', color: 'white', fontWeight: 'bold' }}>{activePlansCount}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div className="auth-card" style={{ padding: '1.5rem', width: 'auto', minHeight: '300px' }}>
          <h3 style={{ color: 'white', marginBottom: '1rem' }}>Monthly Registrations (Placeholder)</h3>
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            Chart rendering...
          </div>
        </div>
        <div className="auth-card" style={{ padding: '1.5rem', width: 'auto', minHeight: '300px' }}>
          <h3 style={{ color: 'white', marginBottom: '1rem' }}>Pending Coach Approvals</h3>
          <ul style={{ color: 'var(--text-muted)', listStyle: 'none', lineHeight: '2' }}>
            <li style={{borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom:'0.5rem'}}>John Doe <span style={{color: '#F59E0B', fontSize:'0.75rem', float:'right'}}>Pending</span></li>
            <li style={{paddingTop:'0.5rem'}}>Sarah Smith <span style={{color: '#F59E0B', fontSize:'0.75rem', float:'right'}}>Pending</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
`;
fs.writeFileSync('src/pages/Dashboard/AdminDashboard.jsx', adminDashboardContent);

console.log('UI Alignment complete!');
