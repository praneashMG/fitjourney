import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClient, clearSelectedClient } from '../../redux/slices/clientSlice';
import { useParams, Link, useNavigate } from 'react-router-dom';

const ClientProfile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedClient, isLoading } = useSelector(state => state.clients);

  useEffect(() => {
    dispatch(fetchClient(id));
    return () => { dispatch(clearSelectedClient()); };
  }, [dispatch, id]);

  if (isLoading || !selectedClient) return <p style={{color: 'var(--text-muted)', padding: '2rem'}}>Loading client profile...</p>;

  const assessment = selectedClient.assessment || {};

  const cardStyle = {
    background: 'white',
    borderRadius: '12px',
    padding: '2rem',
    border: '1px solid var(--border)',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
  };

  const titleStyle = {
    color: 'var(--text-primary, #1e293b)',
    marginBottom: '1.5rem',
    fontSize: '1.25rem',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '0.75rem',
    fontWeight: '600'
  };

  const labelStyle = { fontWeight: '600', color: 'var(--text-primary, #1e293b)', marginRight: '0.5rem' };
  const valueStyle = { color: 'var(--text-muted, #64748b)' };

  const Row = ({ label, value }) => (
    <div style={{ marginBottom: '0.875rem', display: 'flex', alignItems: 'baseline' }}>
      <span style={labelStyle}>{label}:</span>
      <span style={valueStyle}>{value}</span>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>&larr; Back</button>
          <h1 style={{ color: 'var(--text-primary, #1e293b)', margin: 0, fontSize: '1.75rem' }}>{selectedClient.fullName}'s Profile</h1>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* Personal Details */}
        <div style={cardStyle}>
          <h2 style={titleStyle}>Personal Info</h2>
          <Row label="Email" value={selectedClient.email} />
          <Row label="Phone" value={selectedClient.phone} />
          <Row label="Age / Gender" value={`${assessment.age || 'N/A'} / ${assessment.gender || selectedClient.gender || 'N/A'}`} />
          <Row label="Location" value={`${assessment.city || 'N/A'}, ${assessment.country || 'N/A'}`} />
          <div style={{ marginBottom: '0.875rem', display: 'flex', alignItems: 'baseline' }}>
            <span style={labelStyle}>Status:</span>
            <span style={{ 
              padding: '0.25rem 0.75rem', 
              borderRadius: '9999px', 
              fontSize: '0.75rem',
              fontWeight: '600',
              background: selectedClient.isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: selectedClient.isActive ? '#10B981' : '#EF4444'
            }}>
              {selectedClient.isActive ? 'Active Member' : 'Inactive'}
            </span>
          </div>
        </div>

        {/* Body Measurements */}
        <div style={cardStyle}>
          <h2 style={titleStyle}>Body Measurements</h2>
          <Row label="Height" value={`${assessment.height || selectedClient.height || 'N/A'} cm`} />
          <Row label="Current Weight" value={`${assessment.currentWeight || selectedClient.currentWeight || 'N/A'} kg`} />
          <Row label="Target Weight" value={`${assessment.targetWeight || selectedClient.targetWeight || 'N/A'} kg`} />
          <Row label="BMI" value={selectedClient.bmi ? selectedClient.bmi.toFixed(1) : 'N/A'} />
          {assessment.bodyFatPercentage && <Row label="Body Fat" value={`${assessment.bodyFatPercentage}%`} />}
        </div>

        {/* Fitness Goals & Experience */}
        <div style={cardStyle}>
          <h2 style={titleStyle}>Fitness Profile</h2>
          <Row label="Primary Goal" value={assessment.goal || selectedClient.fitnessGoal || 'N/A'} />
          <Row label="Experience Level" value={assessment.experienceLevel || selectedClient.experienceLevel || 'N/A'} />
          <Row label="Workout Location" value={assessment.workoutLocation || selectedClient.workoutPreference || 'N/A'} />
          <Row label="Prefers to workout" value={assessment.preferredWorkoutTime || 'N/A'} />
          <Row label="Activity Level" value={assessment.activityLevel || selectedClient.activityLevel || 'N/A'} />
        </div>

        {/* Nutrition & Lifestyle */}
        <div style={cardStyle}>
          <h2 style={titleStyle}>Nutrition & Lifestyle</h2>
          <Row label="Diet Preference" value={assessment.foodPreference || selectedClient.foodPreference || 'N/A'} />
          <Row label="Meals Per Day" value={assessment.mealsPerDay || 'N/A'} />
          <Row label="Water Intake" value={assessment.dailyWaterIntake ? `${assessment.dailyWaterIntake} Liters` : 'N/A'} />
          <Row label="Sleep" value={assessment.sleepHours ? `${assessment.sleepHours} Hours/night` : 'N/A'} />
          <Row label="Occupation" value={assessment.occupation || 'N/A'} />
        </div>

        {/* Medical & Restrictions */}
        <div style={{ ...cardStyle, gridColumn: '1 / -1' }}>
          <h2 style={titleStyle}>Medical & Restrictions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div>
              <h3 style={{ ...labelStyle, marginBottom: '0.75rem', display: 'block' }}>Medical Conditions:</h3>
              <p style={{ color: 'var(--text-primary)', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                {assessment.medicalConditions && assessment.medicalConditions.length > 0 
                  ? assessment.medicalConditions.join(', ') 
                  : (selectedClient.medicalConditions || 'None reported')}
              </p>
            </div>
            <div>
              <h3 style={{ ...labelStyle, marginBottom: '0.75rem', display: 'block' }}>Doctor Restrictions / Medications:</h3>
              <p style={{ color: 'var(--text-primary)', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                {assessment.doctorRestrictions || assessment.currentMedications 
                  ? `${assessment.doctorRestrictions || 'None'} / ${assessment.currentMedications || 'None'}`
                  : 'None reported'}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ClientProfile;
