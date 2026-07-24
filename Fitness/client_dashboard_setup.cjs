const fs = require('fs');

// Create directories
if (!fs.existsSync('src/components/dashboard/client')) fs.mkdirSync('src/components/dashboard/client', { recursive: true });
if (!fs.existsSync('src/pages/Dashboard')) fs.mkdirSync('src/pages/Dashboard', { recursive: true });

// 1. Sidebar.jsx
fs.writeFileSync('src/components/layout/Sidebar.jsx', `import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/');
  };

  const coachLinks = (
    <>
      <li><NavLink to="/dashboard" className={({isActive}) => isActive ? 'active' : ''}>Dashboard</NavLink></li>
      <li><NavLink to="/clients" className={({isActive}) => isActive ? 'active' : ''}>Clients</NavLink></li>
      <li><NavLink to="/workouts" className={({isActive}) => isActive ? 'active' : ''}>Workouts</NavLink></li>
      <li><NavLink to="/diet" className={({isActive}) => isActive ? 'active' : ''}>Diet Plans</NavLink></li>
      <li><NavLink to="/courses" className={({isActive}) => isActive ? 'active' : ''}>Courses</NavLink></li>
      <li><NavLink to="/payments" className={({isActive}) => isActive ? 'active' : ''}>Payments</NavLink></li>
      <li><NavLink to="/analytics" className={({isActive}) => isActive ? 'active' : ''}>Analytics</NavLink></li>
    </>
  );

  const clientLinks = (
    <>
      <li><NavLink to="/dashboard" className={({isActive}) => isActive ? 'active' : ''}>Dashboard</NavLink></li>
      <li><NavLink to="/profile" className={({isActive}) => isActive ? 'active' : ''}>My Profile</NavLink></li>
      <li><NavLink to="/workouts" className={({isActive}) => isActive ? 'active' : ''}>Workouts</NavLink></li>
      <li><NavLink to="/diet" className={({isActive}) => isActive ? 'active' : ''}>Diet Plan</NavLink></li>
      <li><NavLink to="/progress" className={({isActive}) => isActive ? 'active' : ''}>Progress</NavLink></li>
      <li><NavLink to="/appointments" className={({isActive}) => isActive ? 'active' : ''}>Appointments</NavLink></li>
      <li><NavLink to="/messages" className={({isActive}) => isActive ? 'active' : ''}>Messages</NavLink></li>
      <li><NavLink to="/payments" className={({isActive}) => isActive ? 'active' : ''}>Payments</NavLink></li>
      <li><NavLink to="/achievements" className={({isActive}) => isActive ? 'active' : ''}>Achievements</NavLink></li>
      <li><NavLink to="/settings" className={({isActive}) => isActive ? 'active' : ''}>Settings</NavLink></li>
    </>
  );

  return (
    <aside className="sidebar">
      <ul>
        {user?.role === 'Coach' || user?.role === 'Admin' ? coachLinks : clientLinks}
      </ul>
      <div style={{ marginTop: 'auto', padding: '1rem' }}>
        <button className="btn btn-secondary btn-block" onClick={handleLogout}>Logout</button>
      </div>
    </aside>
  );
};

export default Sidebar;
`);

// 2. CoachDashboard.jsx
fs.writeFileSync('src/pages/Dashboard/CoachDashboard.jsx', `import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchClients } from '../../redux/slices/clientSlice';

const CoachDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { total } = useSelector((state) => state.clients);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchClients(''));
  }, [dispatch]);

  return (
    <div>
      <h1 style={{ color: 'white', marginBottom: '2rem' }}>Dashboard Overview</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Welcome back, {user?.fullName || user?.email || 'User'}!
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="auth-card" style={{ padding: '1.5rem', width: 'auto' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Clients</h3>
          <p style={{ fontSize: '2rem', color: 'white', fontWeight: 'bold' }}>{total}</p>
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

export default CoachDashboard;
`);

// 3. Client Dashboard Widgets
fs.writeFileSync('src/components/dashboard/client/WelcomeCard.jsx', `import React from 'react';

const WelcomeCard = ({ user }) => {
  return (
    <div className="auth-card" style={{ padding: '2rem', width: 'auto', background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(236,72,153,0.1) 100%)' }}>
      <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
        👋 Good Morning, {user?.fullName?.split(' ')[0] || 'Client'}
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        Stay consistent! You're 72% closer to your goal.
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Goal</p>
          <p style={{ color: 'white', fontWeight: '500' }}>Lose Weight</p>
        </div>
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Coach</p>
          <p style={{ color: 'white', fontWeight: '500' }}>John Smith</p>
        </div>
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Membership</p>
          <p style={{ color: 'var(--primary)', fontWeight: '500' }}>Premium</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;
`);

fs.writeFileSync('src/components/dashboard/client/SummaryCards.jsx', `import React from 'react';

const SummaryCards = () => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
      <div className="auth-card" style={{ padding: '1.5rem', width: 'auto' }}>
        <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Current Weight</h3>
        <p style={{ fontSize: '1.5rem', color: 'white', fontWeight: 'bold' }}>78 kg</p>
      </div>
      <div className="auth-card" style={{ padding: '1.5rem', width: 'auto' }}>
        <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Goal Weight</h3>
        <p style={{ fontSize: '1.5rem', color: 'white', fontWeight: 'bold' }}>70 kg</p>
      </div>
      <div className="auth-card" style={{ padding: '1.5rem', width: 'auto' }}>
        <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Today's Calories</h3>
        <p style={{ fontSize: '1.5rem', color: 'var(--primary)', fontWeight: 'bold' }}>2150 kcal</p>
      </div>
      <div className="auth-card" style={{ padding: '1.5rem', width: 'auto' }}>
        <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Workout Streak</h3>
        <p style={{ fontSize: '1.5rem', color: 'var(--secondary)', fontWeight: 'bold' }}>15 Days 🔥</p>
      </div>
    </div>
  );
};

export default SummaryCards;
`);

fs.writeFileSync('src/components/dashboard/client/TodayWorkoutWidget.jsx', `import React from 'react';

const TodayWorkoutWidget = () => {
  const workout = [
    { name: 'Warm-up', sets: '-', reps: '5 min', status: 'Done' },
    { name: 'Push-ups', sets: '3', reps: '15', status: 'Pending' },
    { name: 'Bench Press', sets: '4', reps: '12', status: 'Pending' },
    { name: 'Shoulder Press', sets: '3', reps: '12', status: 'Pending' },
  ];

  return (
    <div className="auth-card" style={{ padding: '1.5rem', width: 'auto', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ color: 'white', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
        Today's Workout
        <span style={{ fontSize: '0.875rem', color: 'var(--primary)' }}>Upper Body</span>
      </h3>
      
      <div style={{ flex: 1 }}>
        {workout.map((ex, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" checked={ex.status === 'Done'} readOnly />
              <span style={{ color: ex.status === 'Done' ? 'var(--text-muted)' : 'white', textDecoration: ex.status === 'Done' ? 'line-through' : 'none' }}>{ex.name}</span>
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              {ex.sets !== '-' && \`\${ex.sets}x\`}{ex.reps}
            </div>
          </div>
        ))}
      </div>
      
      <button className="btn btn-primary btn-block" style={{ marginTop: '1.5rem' }}>Start Workout</button>
    </div>
  );
};

export default TodayWorkoutWidget;
`);

fs.writeFileSync('src/components/dashboard/client/TodayDietWidget.jsx', `import React from 'react';

const TodayDietWidget = () => {
  return (
    <div className="auth-card" style={{ padding: '1.5rem', width: 'auto', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ color: 'white', marginBottom: '1rem' }}>Today's Diet</h3>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px' }}>
          <p style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>BREAKFAST</p>
          <p style={{ color: 'white', fontSize: '0.875rem' }}>Oats + Eggs + Banana</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px' }}>
          <p style={{ color: 'var(--secondary)', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>LUNCH</p>
          <p style={{ color: 'white', fontSize: '0.875rem' }}>Chicken + Rice + Veggies</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px' }}>
          <p style={{ color: '#10B981', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>DINNER</p>
          <p style={{ color: 'white', fontSize: '0.875rem' }}>Fish + Salad</p>
        </div>
      </div>
      
      <button className="btn btn-secondary btn-block" style={{ marginTop: '1.5rem' }}>View Full Diet</button>
    </div>
  );
};

export default TodayDietWidget;
`);

fs.writeFileSync('src/components/dashboard/client/ProgressChartWidget.jsx', `import React from 'react';

const ProgressChartWidget = () => {
  return (
    <div className="auth-card" style={{ padding: '1.5rem', width: 'auto', minHeight: '250px' }}>
      <h3 style={{ color: 'white', marginBottom: '1rem' }}>Weight Progress</h3>
      <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 1rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ height: '90%', width: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px 4px 0 0' }}></div>
        <div style={{ height: '85%', width: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px 4px 0 0' }}></div>
        <div style={{ height: '80%', width: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px 4px 0 0' }}></div>
        <div style={{ height: '70%', width: '40px', background: 'var(--primary)', borderRadius: '4px 4px 0 0' }}></div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1rem 0', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
        <span>Wk 1</span>
        <span>Wk 2</span>
        <span>Wk 3</span>
        <span style={{ color: 'white' }}>Current</span>
      </div>
    </div>
  );
};

export default ProgressChartWidget;
`);

fs.writeFileSync('src/components/dashboard/client/UpcomingAppointmentWidget.jsx', `import React from 'react';

const UpcomingAppointmentWidget = () => {
  return (
    <div className="auth-card" style={{ padding: '1.5rem', width: 'auto' }}>
      <h3 style={{ color: 'white', marginBottom: '1rem' }}>Upcoming Session</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'rgba(99,102,241,0.2)', padding: '1rem', borderRadius: '12px', textAlign: 'center', minWidth: '70px' }}>
          <p style={{ color: 'var(--primary)', fontWeight: 'bold' }}>TOM</p>
          <p style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>10</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>AM</p>
        </div>
        <div>
          <p style={{ color: 'white', fontWeight: '500', marginBottom: '0.25rem' }}>Weekly Check-in</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Coach: John Smith</p>
        </div>
      </div>
      <button className="btn btn-secondary btn-block">Join Meeting</button>
    </div>
  );
};

export default UpcomingAppointmentWidget;
`);

fs.writeFileSync('src/components/dashboard/client/NotificationsWidget.jsx', `import React from 'react';

const NotificationsWidget = () => {
  return (
    <div className="auth-card" style={{ padding: '1.5rem', width: 'auto' }}>
      <h3 style={{ color: 'white', marginBottom: '1rem' }}>Notifications</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', marginTop: '6px' }}></div>
          <div>
            <p style={{ color: 'white', fontSize: '0.875rem' }}>Workout Assigned: Lower Body</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>2 hours ago</p>
          </div>
        </li>
        <li style={{ padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--secondary)', marginTop: '6px' }}></div>
          <div>
            <p style={{ color: 'white', fontSize: '0.875rem' }}>Diet Updated: New Macros</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>5 hours ago</p>
          </div>
        </li>
        <li style={{ padding: '0.75rem 0', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', marginTop: '6px' }}></div>
          <div>
            <p style={{ color: 'white', fontSize: '0.875rem' }}>Session Reminder: Tomorrow 10 AM</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>1 day ago</p>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default NotificationsWidget;
`);

fs.writeFileSync('src/components/dashboard/client/RecentMessagesWidget.jsx', `import React from 'react';

const RecentMessagesWidget = () => {
  return (
    <div className="auth-card" style={{ padding: '1.5rem', width: 'auto' }}>
      <h3 style={{ color: 'white', marginBottom: '1rem' }}>Recent Messages</h3>
      <div style={{ display: 'flex', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
          JS
        </div>
        <div>
          <p style={{ color: 'white', fontSize: '0.875rem', fontWeight: '500' }}>Coach John</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>"Great progress! Increase your water intake today."</p>
        </div>
      </div>
    </div>
  );
};

export default RecentMessagesWidget;
`);

// 4. ClientDashboard.jsx
fs.writeFileSync('src/pages/Dashboard/ClientDashboard.jsx', `import React from 'react';
import { useSelector } from 'react-redux';
import WelcomeCard from '../../components/dashboard/client/WelcomeCard';
import SummaryCards from '../../components/dashboard/client/SummaryCards';
import TodayWorkoutWidget from '../../components/dashboard/client/TodayWorkoutWidget';
import TodayDietWidget from '../../components/dashboard/client/TodayDietWidget';
import ProgressChartWidget from '../../components/dashboard/client/ProgressChartWidget';
import UpcomingAppointmentWidget from '../../components/dashboard/client/UpcomingAppointmentWidget';
import NotificationsWidget from '../../components/dashboard/client/NotificationsWidget';
import RecentMessagesWidget from '../../components/dashboard/client/RecentMessagesWidget';

const ClientDashboard = () => {
  const { user } = useSelector(state => state.auth);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '2rem' }}>
      <WelcomeCard user={user} />
      
      <SummaryCards />
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <TodayWorkoutWidget />
        <TodayDietWidget />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <ProgressChartWidget />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <UpcomingAppointmentWidget />
          <RecentMessagesWidget />
          <NotificationsWidget />
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
`);

// 5. Dashboard.jsx (Router)
fs.writeFileSync('src/pages/Dashboard/Dashboard.jsx', `import React from 'react';
import { useSelector } from 'react-redux';
import CoachDashboard from './CoachDashboard';
import ClientDashboard from './ClientDashboard';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  if (user?.role === 'Client') {
    return <ClientDashboard />;
  }

  // Default to Coach Dashboard for Coach and Admin
  return <CoachDashboard />;
};

export default Dashboard;
`);

console.log('Client Dashboard setup complete!');
