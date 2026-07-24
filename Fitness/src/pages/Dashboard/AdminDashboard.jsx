import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAdminStats } from '../../redux/slices/adminSlice';
import { FiUsers, FiBriefcase, FiCalendar } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats, isLoading } = useSelector(state => state.admin);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  if (isLoading || !stats) return <p style={{color: '#64748b', padding: '2rem'}}>Loading Admin Stats...</p>;

  const chartData = [
    { name: 'Total Registered', Clients: stats.totalClients || 0, Coaches: stats.totalCoaches || 0 }
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: '#0f172a', fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>Overview</h1>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Welcome to the admin dashboard.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        {/* Total Clients Card */}
        <div style={{ 
          background: 'white', 
          borderRadius: '16px', 
          padding: '1.5rem', 
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem'
        }}>
          
          <div style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: '12px', 
            background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#4f46e5',
            flexShrink: 0
          }}>
            <FiUsers size={28} />
          </div>

          <div>
            <h3 style={{ color: '#64748b', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.25rem 0', fontWeight: '600' }}>
              Total Clients
            </h3>
            <p style={{ fontSize: '2.5rem', color: '#0f172a', fontWeight: '800', margin: 0, lineHeight: 1 }}>
              {stats.totalClients || 0}
            </p>
          </div>
        </div>

        {/* Total Coaches Card */}
        <div style={{ 
          background: 'white', 
          borderRadius: '16px', 
          padding: '1.5rem', 
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem'
        }}>
          
          <div style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: '12px', 
            background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#16a34a',
            flexShrink: 0
          }}>
            <FiBriefcase size={28} />
          </div>

          <div>
            <h3 style={{ color: '#64748b', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.25rem 0', fontWeight: '600' }}>
              Total Coaches
            </h3>
            <p style={{ fontSize: '2.5rem', color: '#0f172a', fontWeight: '800', margin: 0, lineHeight: 1 }}>
              {stats.totalCoaches || 0}
            </p>
          </div>
        </div>

      </div>

      <div style={{ marginTop: '2rem', background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
        <h3 style={{ color: '#0f172a', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>User Distribution Graph</h3>
        <div style={{ height: '350px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              barSize={60}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontWeight: 500 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontWeight: 500 }} />
              <RechartsTooltip 
                cursor={{ fill: 'rgba(226, 232, 240, 0.4)' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                itemStyle={{ fontWeight: '600' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
              <Bar dataKey="Clients" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Coaches" fill="#16a34a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div style={{ marginTop: '2rem', background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
        <h3 style={{ color: '#0f172a', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FiCalendar color="#3b82f6" /> Registration History (Last 30 Days)
        </h3>
        
        {stats.registrationData && stats.registrationData.length > 0 ? (
          <div style={{ height: '350px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={stats.registrationData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                  tickFormatter={(str) => {
                    const date = new Date(str);
                    return `${date.getMonth()+1}/${date.getDate()}`;
                  }}
                />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontWeight: 500 }} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontWeight: '600' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} iconType="circle" />
                <Line type="monotone" dataKey="Clients" name="New Clients" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Coaches" name="New Coaches" stroke="#16a34a" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
            No new registrations in the last 30 days.
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminDashboard;
