import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';
import './Settings.css';

// Components
import MyProfileOverview from './components/MyProfileOverview';
import PersonalInfo from './components/PersonalInfo';
import FitnessInfo from './components/FitnessInfo';
import AssignedCoach from './components/AssignedCoach';
import Subscription from './components/Subscription';
import ProgressSummary from './components/ProgressSummary';
import Security from './components/Security';
import Preferences from './components/Preferences';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('my-profile');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      dispatch(logout());
      toast.success('Logged out successfully');
      navigate('/login');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'my-profile':
        return <MyProfileOverview />;
      case 'personal-info':
        return <PersonalInfo />;
      case 'fitness-info':
        return <FitnessInfo />;
      case 'assigned-coach':
        return <AssignedCoach />;
      case 'subscription':
        return <Subscription />;
      case 'progress-summary':
        return <ProgressSummary />;
      case 'security':
        return <Security />;
      case 'notifications':
        return <Preferences type="notifications" />;
      case 'privacy':
        return <Preferences type="privacy" />;
      default:
        return <MyProfileOverview />;
    }
  };

  return (
    <div className="settings-dashboard-container">
      <div className="settings-sidebar">
        <div className="settings-sidebar-header">
          <h3>Profile Settings</h3>
          <p>Manage your account</p>
        </div>
        <ul className="settings-nav">
          <li><button className={activeTab === 'my-profile' ? 'active' : ''} onClick={() => setActiveTab('my-profile')}>My Profile</button></li>
          <li><button className={activeTab === 'personal-info' ? 'active' : ''} onClick={() => setActiveTab('personal-info')}>Personal Information</button></li>
          
          {user?.role === 'Client' && (
            <>
              <li><button className={activeTab === 'fitness-info' ? 'active' : ''} onClick={() => setActiveTab('fitness-info')}>Fitness Information</button></li>
              <li><button className={activeTab === 'assigned-coach' ? 'active' : ''} onClick={() => setActiveTab('assigned-coach')}>Assigned Coach</button></li>
              <li><button className={activeTab === 'subscription' ? 'active' : ''} onClick={() => setActiveTab('subscription')}>Subscription</button></li>
              <li><button className={activeTab === 'progress-summary' ? 'active' : ''} onClick={() => setActiveTab('progress-summary')}>Progress Summary</button></li>
            </>
          )}

          <li><button className={activeTab === 'security' ? 'active' : ''} onClick={() => setActiveTab('security')}>Security</button></li>
          <li><button className={activeTab === 'notifications' ? 'active' : ''} onClick={() => setActiveTab('notifications')}>Notifications</button></li>
          <li><button className={activeTab === 'privacy' ? 'active' : ''} onClick={() => setActiveTab('privacy')}>Privacy Settings</button></li>
          <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
        </ul>
      </div>
      
      <div className="settings-content-area">
        {renderContent()}
      </div>
    </div>
  );
};

export default Settings;
