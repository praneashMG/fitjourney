import React, { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updatePersonalProfile } from '../../../redux/slices/authSlice';
import toast from 'react-hot-toast';

const MyProfileOverview = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  
  if (!user) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = async () => {
        setIsUploading(true);
        const resultAction = await dispatch(updatePersonalProfile({ profileImage: reader.result }));
        if (updatePersonalProfile.fulfilled.match(resultAction)) {
          toast.success('Profile photo updated!');
        } else {
          toast.error(resultAction.payload || 'Failed to update photo');
        }
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = async () => {
    if (window.confirm('Are you sure you want to remove your profile photo?')) {
      setIsUploading(true);
      const resultAction = await dispatch(updatePersonalProfile({ profileImage: "" }));
      if (updatePersonalProfile.fulfilled.match(resultAction)) {
        toast.success('Profile photo removed!');
      } else {
        toast.error(resultAction.payload || 'Failed to remove photo');
      }
      setIsUploading(false);
    }
  };

  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <h2>My Profile</h2>
        <p>Quick overview of your account</p>
      </div>
      
      <div className="overview-card">
        <div className="profile-image-container">
          <img 
            src={user.profileImage || 'https://via.placeholder.com/150'} 
            alt="Profile" 
            className="overview-photo"
            style={{ opacity: isUploading ? 0.5 : 1 }}
          />
          <div className="profile-image-actions">
            <button className="btn btn-primary btn-sm" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
              Change
            </button>
            {user.profileImage && (
              <button className="btn btn-secondary btn-sm" onClick={handleDeleteImage} disabled={isUploading}>
                Remove
              </button>
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            style={{ display: 'none' }} 
          />
        </div>
        <div className="overview-details">
          <h3>{user.fullName}</h3>
          <p>Client ID: {user._id.substring(0, 8).toUpperCase()}</p>
          <p>{user.email}</p>
          <p>{user.phone}</p>
        </div>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{user.subscription?.status || 'Free'}</div>
          <div className="stat-label">Membership Status</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{new Date(user.createdAt).toLocaleDateString()}</div>
          <div className="stat-label">Joined Date</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">85%</div>
          <div className="stat-label">Profile Completion</div>
        </div>
      </div>
    </div>
  );
};

export default MyProfileOverview;
