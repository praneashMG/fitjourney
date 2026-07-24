import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';
import { FiHome, FiActivity, FiCoffee, FiTrendingUp, FiUser, FiCalendar, FiMessageSquare, FiCreditCard, FiAward, FiSettings, FiLogOut, FiUsers, FiBriefcase, FiDollarSign, FiBarChart2, FiBell, FiLifeBuoy, FiX } from 'react-icons/fi';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [coachMenuOpen, setCoachMenuOpen] = useState(false);
  const [clientMenuOpen, setClientMenuOpen] = useState(false);

  // Close sidebar automatically when a link is clicked on mobile
  const handleLinkClick = () => {
    if (closeSidebar) closeSidebar();
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/');
  };

  const adminLinks = (
    <>
      <li><NavLink to="/dashboard" className={({isActive}) => isActive ? 'active' : ''} style={{display: 'flex', alignItems: 'center'}}><FiHome style={{marginRight: '8px'}} /> Dashboard</NavLink></li>
      
      <li>
        <div 
          onClick={() => setCoachMenuOpen(!coachMenuOpen)} 
          style={{ padding: '0.75rem 1rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#4f46e5'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <span style={{display: 'flex', alignItems: 'center'}}><FiBriefcase style={{marginRight: '8px'}} /> Coach Management</span>
          <span>{coachMenuOpen ? '▼' : '▶'}</span>
        </div>
        {coachMenuOpen && (
          <ul style={{ paddingLeft: '1.5rem', listStyle: 'none', margin: '0.5rem 0' }}>
            <li style={{marginBottom: '0.5rem'}}><NavLink to="/admin/coaches" className={({isActive}) => isActive ? 'active' : ''} style={{fontSize: '0.9rem', whiteSpace: 'nowrap'}}>• All Coaches</NavLink></li>
            <li style={{marginBottom: '0.5rem'}}><NavLink to="/admin/coaches/add" className={({isActive}) => isActive ? 'active' : ''} style={{fontSize: '0.9rem', whiteSpace: 'nowrap'}}>• Add Coach</NavLink></li>
            <li style={{marginBottom: '0.5rem'}}><NavLink to="/admin/coaches/pending" className={({isActive}) => isActive ? 'active' : ''} style={{fontSize: '0.9rem', whiteSpace: 'nowrap'}}>• Pending Approvals</NavLink></li>
          </ul>
        )}
      </li>

      <li>
        <div 
          onClick={() => setClientMenuOpen(!clientMenuOpen)} 
          style={{ padding: '0.75rem 1rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#4f46e5'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <span style={{display: 'flex', alignItems: 'center'}}><FiUsers style={{marginRight: '8px'}} /> Client Management</span>
          <span>{clientMenuOpen ? '▼' : '▶'}</span>
        </div>
        {clientMenuOpen && (
          <ul style={{ paddingLeft: '1.5rem', listStyle: 'none', margin: '0.5rem 0' }}>
            <li style={{marginBottom: '0.5rem'}}><NavLink to="/admin/clients" className={({isActive}) => isActive ? 'active' : ''} style={{fontSize: '0.9rem', whiteSpace: 'nowrap'}}>• All Clients</NavLink></li>
            <li style={{marginBottom: '0.5rem'}}><NavLink to="/admin/clients/progress" className={({isActive}) => isActive ? 'active' : ''} style={{fontSize: '0.9rem', whiteSpace: 'nowrap'}}>• Client Progress</NavLink></li>
          </ul>
        )}
      </li>

      <li><NavLink to="/workouts" className={({isActive}) => isActive ? 'active' : ''} style={{display: 'flex', alignItems: 'center'}}><FiActivity style={{marginRight: '8px'}} /> Workout Library</NavLink></li>
      <li><NavLink to="/diet" className={({isActive}) => isActive ? 'active' : ''} style={{display: 'flex', alignItems: 'center'}}><FiCoffee style={{marginRight: '8px'}} /> Diet Library</NavLink></li>
      <li><NavLink to="/appointments" className={({isActive}) => isActive ? 'active' : ''} style={{display: 'flex', alignItems: 'center'}}><FiCalendar style={{marginRight: '8px'}} /> Appointments</NavLink></li>
      <li><NavLink to="/memberships" className={({isActive}) => isActive ? 'active' : ''} style={{display: 'flex', alignItems: 'center'}}><FiCreditCard style={{marginRight: '8px'}} /> Membership Plans</NavLink></li>
      <li><NavLink to="/payments" className={({isActive}) => isActive ? 'active' : ''} style={{display: 'flex', alignItems: 'center'}}><FiDollarSign style={{marginRight: '8px'}} /> Payments</NavLink></li>
      <li><NavLink to="/reports" className={({isActive}) => isActive ? 'active' : ''} style={{display: 'flex', alignItems: 'center'}}><FiBarChart2 style={{marginRight: '8px'}} /> Reports</NavLink></li>
      <li><NavLink to="/notifications" className={({isActive}) => isActive ? 'active' : ''} style={{display: 'flex', alignItems: 'center'}}><FiBell style={{marginRight: '8px'}} /> Notifications</NavLink></li>
      <li><NavLink to="/support" className={({isActive}) => isActive ? 'active' : ''} style={{display: 'flex', alignItems: 'center'}}><FiLifeBuoy style={{marginRight: '8px'}} /> Support Tickets</NavLink></li>
      <li><NavLink to="/settings" className={({isActive}) => isActive ? 'active' : ''} style={{display: 'flex', alignItems: 'center'}}><FiSettings style={{marginRight: '8px'}} /> Settings</NavLink></li>
      <li><NavLink to="/profile" className={({isActive}) => isActive ? 'active' : ''} style={{display: 'flex', alignItems: 'center'}}><FiUser style={{marginRight: '8px'}} /> Profile</NavLink></li>
    </>
  );

  const coachLinks = (
    <>
      <li><NavLink to="/dashboard" className={({isActive}) => isActive ? 'active' : ''}>Dashboard</NavLink></li>
      <li><NavLink to="/clients" className={({isActive}) => isActive ? 'active' : ''}>Clients</NavLink></li>
      <li><NavLink to="/workouts" className={({isActive}) => isActive ? 'active' : ''}>Workouts</NavLink></li>
      <li><NavLink to="/diet" className={({isActive}) => isActive ? 'active' : ''}>Diet Plans</NavLink></li>
      <li><NavLink to="/messages" className={({isActive}) => isActive ? 'active' : ''}>Messages</NavLink></li>
      <li><NavLink to="/payments" className={({isActive}) => isActive ? 'active' : ''}>Payments</NavLink></li>
    </>
  );

  const clientLinks = (
    <>
      <li><NavLink to="/dashboard" className={({isActive}) => isActive ? 'active' : ''}><FiHome style={{marginRight: '8px'}} /> Dashboard</NavLink></li>
      <li><NavLink to="/workouts" className={({isActive}) => isActive ? 'active' : ''}><FiActivity style={{marginRight: '8px'}} /> My Workout</NavLink></li>
      <li><NavLink to="/diet" className={({isActive}) => isActive ? 'active' : ''}><FiCoffee style={{marginRight: '8px'}} /> My Diet</NavLink></li>
      <li><NavLink to="/progress" className={({isActive}) => isActive ? 'active' : ''}><FiTrendingUp style={{marginRight: '8px'}} /> Progress Tracker</NavLink></li>
      <li><NavLink to="/coach" className={({isActive}) => isActive ? 'active' : ''}><FiUser style={{marginRight: '8px'}} /> My Coach</NavLink></li>
      <li><NavLink to="/messages" className={({isActive}) => isActive ? 'active' : ''}><FiMessageSquare style={{marginRight: '8px'}} /> Messages</NavLink></li>
      <li><NavLink to="/payments" className={({isActive}) => isActive ? 'active' : ''}><FiCreditCard style={{marginRight: '8px'}} /> Payments</NavLink></li>
      <li><NavLink to="/settings" className={({isActive}) => isActive ? 'active' : ''}><FiSettings style={{marginRight: '8px'}} /> Settings</NavLink></li>
    </>
  );

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`} onClick={(e) => {
      // Close sidebar if they click a link (A tag)
      if (e.target.closest('a')) {
        handleLinkClick();
      }
    }}>
      <div className="mobile-sidebar-header" style={{ padding: '1rem 1.5rem', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src="/logo.png" alt="FitJourney Logo" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>FitJourney</span>
        </div>
        {closeSidebar && (
          <div 
            className="mobile-close-btn" 
            onClick={closeSidebar}
            style={{ cursor: 'pointer', padding: '0.5rem', background: '#f8fafc', borderRadius: '8px' }}
          >
            <FiX size={20} color="#64748b" />
          </div>
        )}
      </div>
      <ul>
        {user?.role === 'Admin' && adminLinks}
        {user?.role === 'Coach' && coachLinks}
        {user?.role === 'Client' && clientLinks}
      </ul>
      <div style={{ marginTop: 'auto', padding: '1rem' }}>
        <button className="btn btn-secondary btn-block" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <FiLogOut /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
