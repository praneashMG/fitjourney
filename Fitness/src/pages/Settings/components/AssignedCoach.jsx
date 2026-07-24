import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AssignedCoach = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
  const coach = user?.assignedCoach;

  if (!coach) {
    return (
      <div className="settings-section">
        <div className="settings-section-header">
          <h2>Assigned Coach</h2>
          <p>Your fitness professional</p>
        </div>
        <div className="overview-card" style={{ justifyContent: 'center', textAlign: 'center', flexDirection: 'column' }}>
          <p style={{ fontSize: '1.1rem', color: '#64748b' }}>You don't have a coach assigned yet.</p>
          <button className="btn btn-primary" style={{ marginTop: '1rem' }}>Find a Coach</button>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <h2>Assigned Coach</h2>
        <p>Your fitness professional</p>
      </div>
      
      <div className="overview-card">
        <img 
          src={coach.profileImage || 'https://via.placeholder.com/150'} 
          alt="Coach" 
          className="overview-photo"
        />
        <div className="overview-details">
          <h3>{coach.fullName}</h3>
          <p style={{ color: '#2563eb', fontWeight: 600 }}>Fitness Coach</p>
          <p>Email: {coach.email}</p>
          <p>Phone: {coach.phone || 'N/A'}</p>
          <p>Assigned Date: {user.coachAssignedDate ? new Date(user.coachAssignedDate).toLocaleDateString() : 'Recent'}</p>
        </div>
      </div>
      
      <div className="form-actions" style={{ justifyContent: 'flex-start' }}>
        <button className="btn btn-primary" onClick={() => navigate('/messages')}>Message Coach</button>
        <button className="btn btn-secondary">View Profile</button>
      </div>
    </div>
  );
};

export default AssignedCoach;
