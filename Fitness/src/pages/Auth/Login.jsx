import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { login } from '../../redux/slices/authSlice';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);

  const onSubmit = async (data) => {
    const resultAction = await dispatch(login(data));
    if (login.fulfilled.match(resultAction)) {
      toast.success('Login Successful!');
      const user = resultAction.payload.user;
      const role = user?.role;
      if (role === 'Client') {
        // Only go to assessment if they haven't filled out their basic fitness info
        if (user.height && user.currentWeight && user.fitnessGoal) {
          navigate('/dashboard');
        } else {
          navigate('/assessment');
        }
      } else {
        navigate('/dashboard');
      }
    } else {
      toast.error(resultAction.payload || 'Login Failed');
    }
  };

  return (
    <>
      <div className="auth-container">
        <div className="auth-card">
          <Link to="/" className="auth-logo-container" style={{ textDecoration: 'none' }}>
            <img src="/logo.png" alt="FitJourney Logo" className="auth-logo" />
            <span className="auth-logo-text">FitJourney</span>
          </Link>
          <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Log in to your account to continue</p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
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
            <label>Password</label>
            <input 
              type="password" 
              className="form-input"
              {...register('password', { required: 'Password is required' })} 
            />
            {errors.password && <span className="error-text">{errors.password.message}</span>}
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" /> Remember Me
            </label>
            <a href="#" className="forgot-password">Forgot Password?</a>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p className="auth-redirect">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
    </>
  );
};

export default Login;
