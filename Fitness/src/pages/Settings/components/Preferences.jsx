import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePreferencesProfile } from '../../../redux/slices/authSlice';
import toast from 'react-hot-toast';

const Preferences = ({ type }) => {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);
  
  const [prefs, setPrefs] = useState({
    notifications: {
      workoutReminder: true,
      dietReminder: true,
      sessionReminder: true,
      coachMessages: true,
      emailNotifications: true,
      pushNotifications: true
    },
    privacy: {
      shareProgressWithCoach: true,
      allowProgressPhotos: false
    }
  });

  useEffect(() => {
    if (user?.preferences) {
      setPrefs({
        notifications: { ...prefs.notifications, ...(user.preferences.notifications || {}) },
        privacy: { ...prefs.privacy, ...(user.preferences.privacy || {}) }
      });
    }
  }, [user]);

  const handleToggle = (category, field) => {
    setPrefs(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: !prev[category][field]
      }
    }));
  };

  const handleSave = async () => {
    const dataToUpdate = type === 'notifications' 
      ? { notifications: prefs.notifications }
      : { privacy: prefs.privacy };
      
    const resultAction = await dispatch(updatePreferencesProfile(dataToUpdate));
    if (updatePreferencesProfile.fulfilled.match(resultAction)) {
      toast.success(`${type === 'notifications' ? 'Notifications' : 'Privacy settings'} saved!`);
    } else {
      toast.error(resultAction.payload || 'Failed to update');
    }
  };

  if (type === 'notifications') {
    return (
      <div className="settings-section">
        <div className="settings-section-header">
          <h2>Notifications</h2>
          <p>Manage how we communicate with you</p>
        </div>

        <div className="settings-form">
          <div className="toggle-row">
            <div className="toggle-info">
              <h4>Workout Reminders</h4>
              <p>Get notified before your scheduled workouts</p>
            </div>
            <label className="switch">
              <input type="checkbox" checked={prefs.notifications.workoutReminder} onChange={() => handleToggle('notifications', 'workoutReminder')} />
              <span className="slider round"></span>
            </label>
          </div>
          
          <div className="toggle-row">
            <div className="toggle-info">
              <h4>Diet Reminders</h4>
              <p>Get notified for meal times</p>
            </div>
            <label className="switch">
              <input type="checkbox" checked={prefs.notifications.dietReminder} onChange={() => handleToggle('notifications', 'dietReminder')} />
              <span className="slider round"></span>
            </label>
          </div>

          <div className="toggle-row">
            <div className="toggle-info">
              <h4>Session Reminders</h4>
              <p>Reminders for coach sessions</p>
            </div>
            <label className="switch">
              <input type="checkbox" checked={prefs.notifications.sessionReminder} onChange={() => handleToggle('notifications', 'sessionReminder')} />
              <span className="slider round"></span>
            </label>
          </div>

          <div className="toggle-row">
            <div className="toggle-info">
              <h4>Coach Messages</h4>
              <p>Notifications when your coach messages you</p>
            </div>
            <label className="switch">
              <input type="checkbox" checked={prefs.notifications.coachMessages} onChange={() => handleToggle('notifications', 'coachMessages')} />
              <span className="slider round"></span>
            </label>
          </div>

          <h3 style={{ margin: '2rem 0 1rem', fontSize: '1.25rem', color: '#0f172a' }}>Delivery Methods</h3>

          <div className="toggle-row">
            <div className="toggle-info">
              <h4>Email Notifications</h4>
              <p>Receive updates via email</p>
            </div>
            <label className="switch">
              <input type="checkbox" checked={prefs.notifications.emailNotifications} onChange={() => handleToggle('notifications', 'emailNotifications')} />
              <span className="slider round"></span>
            </label>
          </div>

          <div className="toggle-row">
            <div className="toggle-info">
              <h4>Push Notifications</h4>
              <p>Receive updates via browser push notifications</p>
            </div>
            <label className="switch">
              <input type="checkbox" checked={prefs.notifications.pushNotifications} onChange={() => handleToggle('notifications', 'pushNotifications')} />
              <span className="slider round"></span>
            </label>
          </div>

          <div className="form-actions">
            <button className="btn btn-primary" onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Privacy Settings
  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <h2>Privacy Settings</h2>
        <p>Manage your data sharing and privacy</p>
      </div>

      <div className="settings-form">
        <div className="toggle-row">
          <div className="toggle-info">
            <h4>Share Progress with Coach</h4>
            <p>Allow your assigned coach to view your progress stats and logs</p>
          </div>
          <label className="switch">
            <input type="checkbox" checked={prefs.privacy.shareProgressWithCoach} onChange={() => handleToggle('privacy', 'shareProgressWithCoach')} />
            <span className="slider round"></span>
          </label>
        </div>
        
        <div className="toggle-row">
          <div className="toggle-info">
            <h4>Allow Progress Photos</h4>
            <p>Allow your coach to view uploaded progress photos</p>
          </div>
          <label className="switch">
            <input type="checkbox" checked={prefs.privacy.allowProgressPhotos} onChange={() => handleToggle('privacy', 'allowProgressPhotos')} />
            <span className="slider round"></span>
          </label>
        </div>

        <h3 style={{ margin: '2rem 0 1rem', fontSize: '1.25rem', color: '#0f172a' }}>Data Management</h3>
        
        <div className="overview-card" style={{ padding: '1.5rem' }}>
          <div className="overview-details" style={{ flex: 1 }}>
            <h4 style={{ color: '#0f172a', marginBottom: '0.25rem' }}>Download My Data</h4>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Export a copy of all your profile data and workout history.</p>
          </div>
          <button className="btn btn-secondary">Request Data</button>
        </div>

        <div className="overview-card" style={{ padding: '1.5rem', backgroundColor: '#fef2f2', borderColor: '#fca5a5' }}>
          <div className="overview-details" style={{ flex: 1 }}>
            <h4 style={{ color: '#dc2626', marginBottom: '0.25rem' }}>Delete Account</h4>
            <p style={{ color: '#b91c1c', fontSize: '0.9rem' }}>Permanently delete your account and all associated data. This action cannot be undone.</p>
          </div>
          <button className="btn" style={{ backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '6px', fontWeight: 600 }}>Delete Account</button>
        </div>

        <div className="form-actions">
          <button className="btn btn-primary" onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Preferences;
