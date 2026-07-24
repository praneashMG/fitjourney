import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { updatePasswordAPI } from '../../../services/authService';
import toast from 'react-hot-toast';

const Security = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwords.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await updatePasswordAPI({
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword
      });
      toast.success('Password updated successfully');
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <h2>Security</h2>
        <p>Manage your password and account security</p>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: '1fr', marginBottom: '2.5rem' }}>
        <div className="stat-card" style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ color: '#0f172a', marginBottom: '0.25rem' }}>Last Login</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
              {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Currently Active'}
            </p>
          </div>
          <button className="btn btn-secondary">Logout of All Devices</button>
        </div>
      </div>

      <form onSubmit={handleUpdatePassword} className="settings-form">
        <h3 style={{ margin: '0 0 1.5rem', fontSize: '1.25rem', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>Change Password</h3>
        
        <div className="form-group">
          <label>Current Password</label>
          <input 
            type="password" 
            name="oldPassword" 
            value={passwords.oldPassword} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="form-group-row">
          <div className="form-group">
            <label>New Password</label>
            <input 
              type="password" 
              name="newPassword" 
              value={passwords.newPassword} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input 
              type="password" 
              name="confirmPassword" 
              value={passwords.confirmPassword} 
              onChange={handleChange} 
              required 
            />
          </div>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Security;
