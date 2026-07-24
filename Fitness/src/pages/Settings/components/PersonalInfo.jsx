import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePersonalProfile } from '../../../redux/slices/authSlice';
import toast from 'react-hot-toast';

const PersonalInfo = () => {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    emergencyContact: '',
    address: { street: '', city: '', state: '', country: '' }
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        gender: user.gender || '',
        emergencyContact: user.emergencyContact || '',
        address: user.address || { street: '', city: '', state: '', country: '' }
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('address.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({ ...prev, address: { ...prev.address, [field]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(updatePersonalProfile(formData));
    if (updatePersonalProfile.fulfilled.match(resultAction)) {
      toast.success('Personal info updated!');
    } else {
      toast.error(resultAction.payload || 'Failed to update');
    }
  };

  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <h2>Personal Information</h2>
        <p>Update your personal details and contact information</p>
      </div>

      <form onSubmit={handleSubmit} className="settings-form">
        <div className="form-group-row">
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} className="disabled-input" disabled />
          </div>
        </div>
        
        <div className="form-group-row">
          <div className="form-group">
            <label>Mobile Number</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Emergency Contact</label>
            <input type="text" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} />
          </div>
        </div>
        
        <div className="form-group-row">
          <div className="form-group">
            <label>Date of Birth</label>
            <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
        </div>
        
        <h3 style={{ margin: '1.5rem 0 1rem', fontSize: '1.1rem', color: '#0f172a' }}>Address</h3>
        
        <div className="form-group">
          <label>Street Address</label>
          <input type="text" name="address.street" value={formData.address.street} onChange={handleChange} />
        </div>
        
        <div className="form-group-row">
          <div className="form-group">
            <label>City</label>
            <input type="text" name="address.city" value={formData.address.city} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>State</label>
            <input type="text" name="address.state" value={formData.address.state} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Country</label>
            <input type="text" name="address.country" value={formData.address.country} onChange={handleChange} />
          </div>
        </div>
        
        <div className="form-actions">
          <button type="button" className="btn btn-secondary">Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfo;
