import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiSearch, FiBell, FiCalendar, FiChevronDown, FiCheck, FiMenu } from 'react-icons/fi';
import { fetchNotifications, markNotificationRead } from '../../redux/slices/notificationSlice';
import './LandingNavbar.css';

const Navbar = ({ toggleSidebar }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { items: notifications, error } = useSelector(state => state.notifications || { items: [] });
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, user]);

  const unreadCount = notifications?.filter(n => !n.isRead)?.length || 0;

  const handleNotificationClick = (id) => {
    dispatch(markNotificationRead(id));
  };

  return (
    <nav className="navbar bg-white" style={{ display: 'flex', justifyContent: 'space-between', padding: '0 1rem', zIndex: 1000 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {toggleSidebar && (
          <div 
            className="mobile-menu-btn"
            onClick={toggleSidebar} 
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem', background: '#f1f5f9', borderRadius: '8px' }}
          >
            <FiMenu size={24} color="#0f172a" />
          </div>
        )}
        <Link to="/" className="landing-navbar-brand">
          <img src="/logo.png" alt="FitJourney Logo" className="brand-logo-img" />
          <span className="landing-navbar-brand-text">FitJourney</span>
        </Link>
      </div>
      
      {/* Top Navbar Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        
        <div className="desktop-only" style={{ position: 'relative' }}>
          <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input 
            type="text" 
            placeholder="Search workouts, diets..." 
            style={{ padding: '0.5rem 1rem 0.5rem 2.5rem', borderRadius: '20px', border: '1px solid #e2e8f0', outline: 'none', width: '250px', fontSize: '0.9rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#64748b' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ cursor: 'pointer', position: 'relative' }} onClick={() => setShowNotifications(!showNotifications)}>
              <FiBell size={20} />
              {unreadCount > 0 && (
                <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#ef4444', minWidth: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'white', fontWeight: 'bold', padding: '0 4px' }}>
                  {unreadCount}
                </span>
              )}
            </div>
            
            {showNotifications && (
              <div style={{ position: 'absolute', top: '35px', right: '-80px', width: '300px', maxWidth: '90vw', background: 'white', borderRadius: '8px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0', zIndex: 1000, overflow: 'hidden' }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 'bold', color: '#0f172a' }}>
                  Notifications
                </div>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {error ? (
                    <div style={{ padding: '1rem', textAlign: 'center', color: '#ef4444', fontSize: '0.9rem' }}>Error: {error}</div>
                  ) : !notifications || notifications.length === 0 ? (
                    <div style={{ padding: '1rem', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>No notifications yet</div>
                  ) : (
                    notifications.map(notif => (
                      <div key={notif._id} 
                           onClick={() => !notif.isRead && handleNotificationClick(notif._id)}
                           style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', cursor: notif.isRead ? 'default' : 'pointer', background: notif.isRead ? 'white' : '#eff6ff', display: 'flex', flexDirection: 'column', gap: '0.25rem', transition: 'background-color 0.2s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: '600', fontSize: '0.85rem', color: '#0f172a' }}>{notif.title}</span>
                          {!notif.isRead && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }}></span>}
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#475569', margin: 0, lineHeight: '1.4' }}>{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          <FiCalendar className="desktop-only" size={20} style={{ cursor: 'pointer' }} />
        </div>

        <div className="desktop-only" style={{ height: '32px', width: '1px', backgroundColor: '#e2e8f0', margin: '0 0.5rem' }}></div>

        <Link to="/settings" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', cursor: 'pointer' }}>
          <img src={user?.profileImage || 'https://via.placeholder.com/150'} alt="Profile" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
          <div className="desktop-only" style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.95rem', lineHeight: '1.2' }}>{user?.fullName || 'User'}</span>
            <span style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600 }}>{user?.subscription?.status === 'Active' ? 'Premium Member' : 'Free Member'}</span>
          </div>
          <FiChevronDown className="desktop-only" color="#64748b" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
