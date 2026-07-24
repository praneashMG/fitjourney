import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';

import Landing from '../pages/Landing/Landing';
import Coaches from '../pages/Landing/Coaches';
import Educators from '../pages/Landing/Educators';
import Influencers from '../pages/Landing/Influencers';
import About from '../pages/Landing/About';
import Contact from '../pages/Landing/Contact';
import Pricing from '../pages/Landing/Pricing';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import Dashboard from '../pages/Dashboard/Dashboard';
import Clients from '../pages/Clients/Clients';
import AddClient from '../pages/Clients/AddClient';
import EditClient from '../pages/Clients/EditClient';
import ClientDetails from '../pages/Clients/ClientDetails';
import CoachManagement from '../pages/Admin/CoachManagement';
import Workouts from '../pages/Workouts/Workouts';
import DietPlans from '../pages/Diet/DietPlans';
import Courses from '../pages/Courses/Courses';
import Payments from '../pages/Payments/Payments';
import Analytics from '../pages/Analytics/Analytics';
import Settings from '../pages/Settings/Settings';
import Progress from '../pages/Progress/Progress';
import MyCoach from '../pages/MyCoach/MyCoach';
import Sessions from '../pages/Sessions/Sessions';
import Messages from '../pages/Messages/Messages';
import Achievements from '../pages/Achievements/Achievements';
import NotFound from '../pages/NotFound';
import AssessmentWizard from '../pages/Assessment/AssessmentWizard';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/coaches" element={<Coaches />} />
      <Route path="/educators" element={<Educators />} />
      <Route path="/influencers" element={<Influencers />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route element={<ProtectedRoute />}>
        {/* Full screen assessment wizard */}
        <Route path="/assessment" element={<AssessmentWizard />} />
        
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/clients/add" element={<AddClient />} />
          <Route path="/clients/edit/:id" element={<EditClient />} />
          <Route path="/clients/:id" element={<ClientDetails />} />
          <Route path="/admin/coaches" element={<CoachManagement />} />
          <Route path="/admin/clients" element={<Clients />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/diet" element={<DietPlans />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          {/* New Scaffold Routes */}
          <Route path="/progress" element={<Progress />} />
          <Route path="/coach" element={<MyCoach />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/achievements" element={<Achievements />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
