import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { updateUser } from '../../redux/slices/authSlice';

const AssessmentWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || ''
    }
  });

  const totalSteps = 4;

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const onSubmit = async (data) => {
    if (currentStep !== totalSteps) {
      nextStep();
      return;
    }

    try {
      setIsSubmitting(true);
      const loadingToast = toast.loading('Personalizing your plan...');
      
      const payload = { ...data, userId: user?._id || user?.id };
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await axios.post(`${apiUrl}/assessment`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.dismiss(loadingToast);
      
      if (response.data.success) {
        if (response.data.data.user) {
          dispatch(updateUser(response.data.data.user));
        }
        toast.success('Assessment complete! Welcome aboard.');
        navigate('/dashboard');
      } else {
        toast.error('Assessment failed: ' + response.data.message);
      }
    } catch (error) {
      console.error('Submission error', error);
      toast.error('An error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <h2 className="auth-title">Personal Details</h2>
            <p className="auth-subtitle">Let's get your basic details to set up your profile.</p>
            
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" {...register('fullName', { required: 'Full Name is required' })} className="form-input" placeholder="John Doe" />
              {errors.fullName && <span className="error-text">{errors.fullName.message}</span>}
            </div>

            <div className="form-group">
              <label>Age</label>
              <input type="number" {...register('age', { required: 'Age is required' })} className="form-input" placeholder="25" />
              {errors.age && <span className="error-text">{errors.age.message}</span>}
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select {...register('gender')} className="form-input">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" {...register('phone', { required: 'Phone is required' })} className="form-input" placeholder="+1 234 567 8900" />
              {errors.phone && <span className="error-text">{errors.phone.message}</span>}
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h2 className="auth-title">Body Measurements</h2>
            <p className="auth-subtitle">Accurate measurements help us calculate your BMI and macros.</p>
            
            <div className="form-group">
              <label>Height (cm)</label>
              <input type="number" {...register('height', { required: 'Height is required' })} className="form-input" placeholder="175" />
              {errors.height && <span className="error-text">{errors.height.message}</span>}
            </div>

            <div className="form-group">
              <label>Current Weight (kg)</label>
              <input type="number" step="0.1" {...register('currentWeight', { required: 'Current weight is required' })} className="form-input" placeholder="70" />
              {errors.currentWeight && <span className="error-text">{errors.currentWeight.message}</span>}
            </div>

            <div className="form-group">
              <label>Target Weight (kg)</label>
              <input type="number" step="0.1" {...register('targetWeight', { required: 'Target weight is required' })} className="form-input" placeholder="65" />
              {errors.targetWeight && <span className="error-text">{errors.targetWeight.message}</span>}
            </div>

            <div className="form-group">
              <label>Activity Level</label>
              <select {...register('activityLevel')} className="form-input">
                <option value="Sedentary">Sedentary</option>
                <option value="Lightly Active">Lightly Active</option>
                <option value="Moderately Active">Moderately Active</option>
                <option value="Very Active">Very Active</option>
              </select>
            </div>
          </>
        );
      case 3:
        return (
          <>
             <h2 className="auth-title">Fitness Goals</h2>
             <p className="auth-subtitle">What are you looking to achieve with us?</p>
            
             <div className="form-group">
                <label>Primary Goal</label>
                <select {...register('goal', { required: true })} className="form-input">
                  <option value="Bodybuilding">Bodybuilding</option>
                  <option value="Fat Loss">Fat Loss</option>
                  <option value="Strength Training">Strength Training</option>
                  <option value="Yoga">Yoga</option>
                  <option value="Crossfit">Crossfit</option>
                  <option value="General Fitness">General Fitness</option>
                </select>
              </div>

              <div className="form-group">
                <label>Experience Level</label>
                <select {...register('experienceLevel')} className="form-input">
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="form-group">
                <label>Workout Location</label>
                <select {...register('workoutLocation')} className="form-input">
                  <option value="Gym">Gym</option>
                  <option value="Home">Home</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
          </>
        );
      case 4:
        return (
          <>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ width: '60px', height: '60px', backgroundColor: '#e0e7ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px auto' }}>
                <span style={{ fontSize: '30px', color: '#4f46e5' }}>✓</span>
              </div>
              <h2 className="auth-title">You're All Set!</h2>
              <p className="auth-subtitle">Submit your assessment to generate your personalized workout and diet plans.</p>
            </div>
            
            {/* Hidden fields to satisfy the backend schema expectations for this demo */}
            <input type="hidden" {...register('foodPreference')} value="Non Vegetarian" />
            <input type="hidden" {...register('workoutDuration')} value="60 Minutes" />
            <input type="hidden" {...register('dateOfBirth')} value="1995-01-01" />
            <input type="hidden" {...register('email')} value="client@example.com" />
            <input type="hidden" {...register('preferredLanguage')} value="English" />
            <input type="hidden" {...register('country')} value="USA" />
            <input type="hidden" {...register('city')} value="New York" />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '600px', width: '100%' }}>
        <Link to="/" className="auth-logo-container" style={{ textDecoration: 'none' }}>
          <img src="/logo.png" alt="FitJourney Logo" className="auth-logo" />
          <span className="auth-logo-text">FitJourney</span>
        </Link>
        
        {/* Simple Progress text */}
        <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>
          Step {currentStep} of {totalSteps}
        </p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          {renderStep()}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
            {currentStep > 1 && (
              <button 
                type="button" 
                onClick={prevStep} 
                className="btn btn-secondary"
                style={{ width: '48%' }}
              >
                Back
              </button>
            )}
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
              style={{ width: currentStep === 1 ? '100%' : '48%', marginLeft: currentStep === 1 ? '0' : 'auto' }}
            >
              {isSubmitting ? 'Processing...' : (currentStep === totalSteps ? 'Complete' : 'Next Step')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssessmentWizard;
