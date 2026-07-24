import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateFitnessProfile } from '../../../redux/slices/authSlice';
import toast from 'react-hot-toast';

const FitnessInfo = () => {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    height: '',
    currentWeight: '',
    targetWeight: '',
    bmi: '',
    fitnessGoal: '',
    experienceLevel: '',
    workoutPreference: '',
    foodPreference: '',
    medicalConditions: '',
    allergies: '',
    injuries: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        height: user.height || '',
        currentWeight: user.currentWeight || '',
        targetWeight: user.targetWeight || '',
        bmi: user.bmi || '',
        fitnessGoal: user.fitnessGoal || '',
        experienceLevel: user.experienceLevel || '',
        workoutPreference: user.workoutPreference || '',
        foodPreference: user.foodPreference || '',
        medicalConditions: user.medicalConditions || '',
        allergies: user.allergies || '',
        injuries: user.injuries || ''
      });
    }
  }, [user]);

  // Auto calculate BMI
  useEffect(() => {
    if (formData.height && formData.currentWeight) {
      const heightInMeters = formData.height / 100;
      const calculatedBmi = (formData.currentWeight / (heightInMeters * heightInMeters)).toFixed(1);
      setFormData(prev => ({ ...prev, bmi: calculatedBmi }));
    }
  }, [formData.height, formData.currentWeight]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(updateFitnessProfile(formData));
    if (updateFitnessProfile.fulfilled.match(resultAction)) {
      toast.success('Fitness profile updated!');
    } else {
      toast.error(resultAction.payload || 'Failed to update');
    }
  };

  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <h2>Fitness Information</h2>
        <p>Help us tailor your fitness journey</p>
      </div>

      <form onSubmit={handleSubmit} className="settings-form">
        <h3 style={{ margin: '1rem 0', fontSize: '1.1rem', color: '#0f172a' }}>Body Details</h3>
        
        <div className="form-group-row">
          <div className="form-group">
            <label>Height (cm)</label>
            <input type="number" name="height" value={formData.height} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Current Weight (kg)</label>
            <input type="number" name="currentWeight" value={formData.currentWeight} onChange={handleChange} />
          </div>
        </div>
        
        <div className="form-group-row">
          <div className="form-group">
            <label>Target Weight (kg)</label>
            <input type="number" name="targetWeight" value={formData.targetWeight} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>BMI (Auto Calculated)</label>
            <input type="text" name="bmi" value={formData.bmi} className="disabled-input" readOnly />
          </div>
        </div>
        
        <h3 style={{ margin: '1.5rem 0 1rem', fontSize: '1.1rem', color: '#0f172a' }}>Fitness Goals & Experience</h3>
        
        <div className="form-group-row">
          <div className="form-group">
            <label>Fitness Goal</label>
            <select name="fitnessGoal" value={formData.fitnessGoal} onChange={handleChange}>
              <option value="">Select Goal</option>
              <option value="Weight Loss">Weight Loss</option>
              <option value="Fat Loss">Fat Loss</option>
              <option value="Muscle Gain">Muscle Gain</option>
              <option value="Strength">Strength</option>
              <option value="General Fitness">General Fitness</option>
            </select>
          </div>
          <div className="form-group">
            <label>Experience Level</label>
            <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange}>
              <option value="">Select Experience</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>
        
        <div className="form-group-row">
          <div className="form-group">
            <label>Workout Preference</label>
            <select name="workoutPreference" value={formData.workoutPreference} onChange={handleChange}>
              <option value="">Select Preference</option>
              <option value="Gym">Gym</option>
              <option value="Home">Home</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div className="form-group">
            <label>Food Preference</label>
            <select name="foodPreference" value={formData.foodPreference} onChange={handleChange}>
              <option value="">Select Diet</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Eggetarian">Eggetarian</option>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
              <option value="Vegan">Vegan</option>
            </select>
          </div>
        </div>
        
        <h3 style={{ margin: '1.5rem 0 1rem', fontSize: '1.1rem', color: '#0f172a' }}>Medical Information</h3>
        
        <div className="form-group">
          <label>Medical Conditions</label>
          <input type="text" name="medicalConditions" value={formData.medicalConditions} onChange={handleChange} placeholder="None" />
        </div>
        
        <div className="form-group-row">
          <div className="form-group">
            <label>Allergies</label>
            <input type="text" name="allergies" value={formData.allergies} onChange={handleChange} placeholder="None" />
          </div>
          <div className="form-group">
            <label>Injuries</label>
            <input type="text" name="injuries" value={formData.injuries} onChange={handleChange} placeholder="None" />
          </div>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Fitness Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FitnessInfo;
