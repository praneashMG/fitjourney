import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { register as registerUser } from '../../redux/slices/authSlice';
import { FiUser, FiBriefcase } from 'react-icons/fi';

const Register = () => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: { role: 'Client' }
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);

  const onSubmit = async (data) => {
    // Exclude confirmPassword from data sent to API
    const { confirmPassword, ...userData } = data;
    const resultAction = await dispatch(registerUser(userData));
    if (registerUser.fulfilled.match(resultAction)) {
      toast.success(resultAction.payload?.message || 'Registration Successful!');
      navigate('/login');
    } else {
      toast.error(resultAction.payload || 'Registration Failed');
    }
  };

  const password = watch('password');
  const watchRole = watch('role');

  return (
    <>
      <div className="auth-container">
        <div className="auth-card register-card">
          <Link to="/" className="auth-logo-container" style={{ textDecoration: 'none' }}>
            <img src="/logo.png" alt="FitJourney Logo" className="auth-logo" />
            <span className="auth-logo-text">FitJourney</span>
          </Link>
          <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join the ultimate fitness platform</p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                className="form-input"
                {...register('fullName', { required: 'Full Name is required' })} 
              />
              {errors.fullName && <span className="error-text">{errors.fullName.message}</span>}
            </div>

            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                className="form-input"
                {...register('email', { required: 'Email is required' })} 
              />
              {errors.email && <span className="error-text">{errors.email.message}</span>}
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input 
                type="text" 
                className="form-input"
                {...register('phone', { required: 'Phone is required' })} 
              />
              {errors.phone && <span className="error-text">{errors.phone.message}</span>}
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Account Type</label>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <div 
                  onClick={() => setValue('role', 'Client')}
                  style={{ 
                    flex: 1, 
                    padding: '1rem', 
                    border: watchRole === 'Client' ? '2px solid #4f46e5' : '2px solid #e2e8f0', 
                    borderRadius: '12px', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    background: watchRole === 'Client' ? '#e0e7ff' : 'white',
                    color: watchRole === 'Client' ? '#4f46e5' : '#64748b',
                    fontWeight: watchRole === 'Client' ? '600' : '400',
                    transition: 'all 0.2s'
                  }}>
                   <FiUser size={18} /> Client
                </div>
                <div 
                  onClick={() => setValue('role', 'Coach')}
                  style={{ 
                    flex: 1, 
                    padding: '1rem', 
                    border: watchRole === 'Coach' ? '2px solid #4f46e5' : '2px solid #e2e8f0', 
                    borderRadius: '12px', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    background: watchRole === 'Coach' ? '#e0e7ff' : 'white',
                    color: watchRole === 'Coach' ? '#4f46e5' : '#64748b',
                    fontWeight: watchRole === 'Coach' ? '600' : '400',
                    transition: 'all 0.2s'
                  }}>
                   <FiBriefcase size={18} /> Coach
                </div>
              </div>
              <input type="hidden" {...register('role', { required: 'Role is required' })} />
              {errors.role && <span className="error-text">{errors.role.message}</span>}
            </div>

            {watchRole === 'Coach' && (
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Specialization (Required for Coaches)</label>
                <select className="form-input" {...register('specialization', { required: 'Please select a specialization' })}>
                  <option value="">Select your main expertise</option>
                  <option value="Bodybuilding">Bodybuilding</option>
                  <option value="Fat Loss">Fat Loss</option>
                  <option value="Strength Training">Strength Training</option>
                  <option value="Yoga">Yoga</option>
                  <option value="Crossfit">Crossfit</option>
                  <option value="General Fitness">General Fitness</option>
                </select>
                {errors.specialization && <span className="error-text">{errors.specialization.message}</span>}
              </div>
            )}

            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                className="form-input"
                {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Min 8 characters' } })} 
              />
              {errors.password && <span className="error-text">{errors.password.message}</span>}
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input 
                type="password" 
                className="form-input"
                {...register('confirmPassword', { 
                  required: 'Please confirm password',
                  validate: value => value === password || 'Passwords do not match'
                })} 
              />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword.message}</span>}
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        <p className="auth-redirect">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
    </>
  );
};

export default Register;
