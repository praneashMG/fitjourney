const fs = require('fs');

// 1. Login.jsx
fs.writeFileSync('src/pages/Auth/Login.jsx', `import React from 'react';
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
      navigate('/dashboard');
    } else {
      toast.error(resultAction.payload || 'Login Failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
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
  );
};

export default Login;
`);

// 2. Register.jsx
fs.writeFileSync('src/pages/Auth/Register.jsx', `import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { register as registerUser } from '../../redux/slices/authSlice';

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);

  const onSubmit = async (data) => {
    // Exclude confirmPassword from data sent to API
    const { confirmPassword, ...userData } = data;
    const resultAction = await dispatch(registerUser(userData));
    if (registerUser.fulfilled.match(resultAction)) {
      toast.success('Registration Successful!');
      navigate('/dashboard');
    } else {
      toast.error(resultAction.payload || 'Registration Failed');
    }
  };

  const password = watch('password');

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join the ultimate fitness platform</p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
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

          <div className="form-group">
            <label>Role</label>
            <select className="form-input" {...register('role', { required: 'Role is required' })}>
              <option value="">Select a role</option>
              <option value="Client">Client</option>
              <option value="Coach">Coach</option>
            </select>
            {errors.role && <span className="error-text">{errors.role.message}</span>}
          </div>

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

          <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        <p className="auth-redirect">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
`);

// 3. CSS for Auth pages
fs.appendFileSync('src/index.css', `
/* --- Auth Forms --- */
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: var(--bg-darker);
}

.auth-card {
  background: var(--card-bg);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 3rem;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  animation: fadeUp 0.6s ease-out;
}

.auth-title {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
  text-align: center;
}

.auth-subtitle {
  color: var(--text-muted);
  text-align: center;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--text-muted);
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid var(--border);
  border-radius: 10px;
  color: white;
  font-family: inherit;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
}

.remember-me {
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.forgot-password {
  color: var(--primary);
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

.btn-block {
  width: 100%;
  padding: 0.875rem;
}

.error-text {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: block;
}

.auth-redirect {
  text-align: center;
  margin-top: 1.5rem;
  color: var(--text-muted);
  font-size: 0.875rem;
}

.auth-redirect a {
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
}

.auth-redirect a:hover {
  text-decoration: underline;
}
`);

// 4. Update Sidebar
fs.writeFileSync('src/components/layout/Sidebar.jsx', `import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <ul>
        <li><NavLink to="/dashboard" className={({isActive}) => isActive ? 'active' : ''}>Dashboard</NavLink></li>
        <li><NavLink to="/clients" className={({isActive}) => isActive ? 'active' : ''}>Clients</NavLink></li>
        <li><NavLink to="/workouts" className={({isActive}) => isActive ? 'active' : ''}>Workouts</NavLink></li>
        <li><NavLink to="/diet" className={({isActive}) => isActive ? 'active' : ''}>Diet Plans</NavLink></li>
        <li><NavLink to="/courses" className={({isActive}) => isActive ? 'active' : ''}>Courses</NavLink></li>
        <li><NavLink to="/payments" className={({isActive}) => isActive ? 'active' : ''}>Payments</NavLink></li>
        <li><NavLink to="/analytics" className={({isActive}) => isActive ? 'active' : ''}>Analytics</NavLink></li>
      </ul>
      <div style={{ marginTop: 'auto', padding: '1rem' }}>
        <button className="btn btn-secondary btn-block" onClick={handleLogout}>Logout</button>
      </div>
    </aside>
  );
};

export default Sidebar;
`);

// 5. Update index.css for active link
fs.appendFileSync('src/index.css', `
.sidebar {
  display: flex;
  flex-direction: column;
}
.sidebar li a.active {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-left: 3px solid var(--primary);
  border-radius: 0 12px 12px 0;
}
`);

// 6. Update Dashboard
fs.writeFileSync('src/pages/Dashboard/Dashboard.jsx', `import React from 'react';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div>
      <h1 style={{ color: 'white', marginBottom: '2rem' }}>Dashboard Overview</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Welcome back, {user?.fullName || user?.email || 'User'}!
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="auth-card" style={{ padding: '1.5rem', width: 'auto' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Clients</h3>
          <p style={{ fontSize: '2rem', color: 'white', fontWeight: 'bold' }}>124</p>
        </div>
        <div className="auth-card" style={{ padding: '1.5rem', width: 'auto' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Today's Sessions</h3>
          <p style={{ fontSize: '2rem', color: 'white', fontWeight: 'bold' }}>8</p>
        </div>
        <div className="auth-card" style={{ padding: '1.5rem', width: 'auto' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Revenue</h3>
          <p style={{ fontSize: '2rem', color: 'white', fontWeight: 'bold' }}>$4,200</p>
        </div>
        <div className="auth-card" style={{ padding: '1.5rem', width: 'auto' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Pending Payments</h3>
          <p style={{ fontSize: '2rem', color: 'white', fontWeight: 'bold' }}>3</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div className="auth-card" style={{ padding: '1.5rem', width: 'auto', minHeight: '300px' }}>
          <h3 style={{ color: 'white', marginBottom: '1rem' }}>Revenue Chart (Dummy)</h3>
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            Chart rendering...
          </div>
        </div>
        <div className="auth-card" style={{ padding: '1.5rem', width: 'auto', minHeight: '300px' }}>
          <h3 style={{ color: 'white', marginBottom: '1rem' }}>Recent Activity</h3>
          <ul style={{ color: 'var(--text-muted)', listStyle: 'none', lineHeight: '2' }}>
            <li>💪 John Completed Workout</li>
            <li>📚 Mary Purchased Course</li>
            <li>✨ New Client Registered</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
`);

console.log("Frontend UI logic generated!");
