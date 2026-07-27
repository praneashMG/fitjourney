import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import axios from 'axios';
import './ClientDashboard.css';

// We will build these components next
import WelcomeBanner from '../../components/dashboard/client/WelcomeBanner';
import QuickStats from '../../components/dashboard/client/QuickStats';
import TodayWorkout from '../../components/dashboard/client/TodayWorkout';
import TodayDiet from '../../components/dashboard/client/TodayDiet';
import ProcessTracker from '../../components/dashboard/client/ProcessTracker';
import DietTracker from '../../components/dashboard/client/DietTracker';
import WaterTracker from '../../components/dashboard/client/WaterTracker';
import AssignedCoachWidget from '../../components/dashboard/client/AssignedCoachWidget';
import TodayTasks from '../../components/dashboard/client/TodayTasks';
import ProgressCharts from '../../components/dashboard/client/ProgressCharts';
import UpcomingSession from '../../components/dashboard/client/UpcomingSession';
import AchievementsWidget from '../../components/dashboard/client/AchievementsWidget';
import RecentActivity from '../../components/dashboard/client/RecentActivity';
import AlertsAndTips from '../../components/dashboard/client/AlertsAndTips';
import BodyMeasurements from '../../components/dashboard/client/BodyMeasurements';
import PaymentSummary from '../../components/dashboard/client/PaymentSummary';

const ClientDashboard = () => {
  const { user, token } = useSelector(state => state.auth);
  const [dashboardData, setDashboardData] = useState({
    user: user,
    workoutPlan: null,
    dietPlan: null
  });
  const [activeSession, setActiveSession] = useState(null);
  const [activeDietSession, setActiveDietSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/dashboard/client`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
      
      const sessionRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/workout-session/active`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (sessionRes.data.success && sessionRes.data.data) {
        setActiveSession(sessionRes.data.data);
      } else {
        setActiveSession(null);
      }

      const dietSessionRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/diet-session/active`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (dietSessionRes.data.success && dietSessionRes.data.data) {
        setActiveDietSession(dietSessionRes.data.data);
      } else {
        setActiveDietSession(null);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboard();
    } else {
      setLoading(false);
    }
  }, [token]);

  const handleWorkoutComplete = () => {
    setActiveSession(null);
    fetchDashboard(); // Refresh to get the updated progress
  };

  const handleDietComplete = () => {
    setActiveDietSession(null);
    fetchDashboard();
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#fff' }}>Loading your personalized dashboard...</div>;
  }

  // Use the fetched user stats if available, fallback to redux user
  const currentUser = dashboardData.user || user;

  return (
    <div className="client-dashboard-container">
      
      {/* 1. Welcome Section */}
      <WelcomeBanner user={currentUser} />
      
      {/* 2. Quick Stats */}
      <QuickStats user={currentUser} />
      
      {/* 3. Main Content Area (2/3 width) and Sidebar (1/3 width) */}
      <div className="dashboard-grid main-content-grid">
        
        {/* Main Column */}
        <div className="flex-col" style={{ gap: '1.5rem' }}>
          {activeSession ? (
            <ProcessTracker session={activeSession} onComplete={handleWorkoutComplete} />
          ) : (
            <TodayWorkout 
              workoutPlan={dashboardData.workoutPlan} 
              onStartSession={(session) => setActiveSession(session)} 
            />
          )}

          {activeDietSession ? (
            <DietTracker session={activeDietSession} onComplete={handleDietComplete} />
          ) : (
            <TodayDiet 
              dietPlan={dashboardData.dietPlan} 
              onStartDiet={(session) => setActiveDietSession(session)} 
            />
          )}

          <ProgressCharts />
          
          <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <BodyMeasurements user={currentUser} />
            <AchievementsWidget />
          </div>
        </div>

        {/* Side Column */}
        <div className="flex-col" style={{ gap: '1.5rem' }}>
          <WaterTracker />
          <TodayTasks />
          <AssignedCoachWidget user={currentUser} />
          <UpcomingSession user={currentUser} />
          <RecentActivity />
          <AlertsAndTips />
          <PaymentSummary user={currentUser} />
        </div>

      </div>

    </div>
  );
};

export default ClientDashboard;
