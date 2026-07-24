import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LandingNavbar from '../../components/layout/LandingNavbar';

const Landing = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'Client' && (!user.height || !user.currentWeight || !user.fitnessGoal)) {
        navigate('/assessment');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <>
      <LandingNavbar />
      <div className="landing-container">
      <div className="landing-content">
        <h1 className="hero-title">Transform Your <span className="highlight">Fitness Journey</span></h1>
        <p className="hero-subtitle">
          The ultimate platform to manage your workouts, track nutrition, and connect with expert coaches.
        </p>
        <div className="hero-buttons">
          <Link to="/register" className="btn btn-primary" style={{ marginRight: '10px' }}>Get Started</Link>
          <Link to="/login" className="btn btn-secondary">Sign In</Link>
        </div>
      </div>
    </div>
    </>
  );
};

export default Landing;
