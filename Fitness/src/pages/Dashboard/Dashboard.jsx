import React from 'react';
import { useSelector } from 'react-redux';
import CoachDashboard from './CoachDashboard';
import ClientDashboard from './ClientDashboard';
import AdminDashboard from './AdminDashboard';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  if (user?.role === 'Admin') {
    return <AdminDashboard />;
  }
  if (user?.role === 'Client') {
    return <ClientDashboard />;
  }

  // Default to Coach Dashboard for Coach
  return <CoachDashboard />;
};

export default Dashboard;
