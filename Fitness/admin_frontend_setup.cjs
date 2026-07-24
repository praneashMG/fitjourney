const fs = require('fs');

// 1. adminService.js
fs.writeFileSync('src/services/adminService.js', `import api from './axios';

export const getDashboardStatsAPI = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

export const getCoachesAPI = async () => {
  const response = await api.get('/admin/coaches');
  return response.data;
};

export const updateCoachStatusAPI = async (id, statusData) => {
  const response = await api.patch(\`/admin/coaches/\${id}/status\`, statusData);
  return response.data;
};
`);

// 2. adminSlice.js
fs.writeFileSync('src/redux/slices/adminSlice.js', `import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDashboardStatsAPI, getCoachesAPI, updateCoachStatusAPI } from '../../services/adminService';

const initialState = {
  stats: null,
  coaches: [],
  isLoading: false,
  error: null,
};

export const fetchAdminStats = createAsyncThunk('admin/fetchStats', async (_, thunkAPI) => {
  try {
    return await getDashboardStatsAPI();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const fetchCoaches = createAsyncThunk('admin/fetchCoaches', async (_, thunkAPI) => {
  try {
    return await getCoachesAPI();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateCoachStatus = createAsyncThunk('admin/updateCoachStatus', async ({ id, statusData }, thunkAPI) => {
  try {
    return await updateCoachStatusAPI(id, statusData);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Stats
      .addCase(fetchAdminStats.pending, (state) => { state.isLoading = true; })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.data;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      // Coaches
      .addCase(fetchCoaches.pending, (state) => { state.isLoading = true; })
      .addCase(fetchCoaches.fulfilled, (state, action) => {
        state.isLoading = false;
        state.coaches = action.payload.data;
      })
      .addCase(fetchCoaches.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      // Update Coach
      .addCase(updateCoachStatus.fulfilled, (state, action) => {
        const index = state.coaches.findIndex(c => c._id === action.payload.data._id);
        if (index !== -1) {
          state.coaches[index] = action.payload.data;
        }
      });
  },
});

export default adminSlice.reducer;
`);

// 3. AdminDashboard.jsx
if (!fs.existsSync('src/pages/Dashboard')) fs.mkdirSync('src/pages/Dashboard', { recursive: true });
fs.writeFileSync('src/pages/Dashboard/AdminDashboard.jsx', `import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAdminStats } from '../../redux/slices/adminSlice';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats, isLoading } = useSelector(state => state.admin);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  if (isLoading || !stats) return <p style={{color: 'white'}}>Loading Admin Stats...</p>;

  return (
    <div>
      <h1 style={{ color: 'white', marginBottom: '2rem' }}>Platform Administration</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="auth-card" style={{ padding: '1.5rem', width: 'auto', background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.1) 100%)' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Coaches</h3>
          <p style={{ fontSize: '2rem', color: 'white', fontWeight: 'bold' }}>{stats.totalCoaches}</p>
        </div>
        <div className="auth-card" style={{ padding: '1.5rem', width: 'auto' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Clients</h3>
          <p style={{ fontSize: '2rem', color: 'white', fontWeight: 'bold' }}>{stats.totalClients}</p>
        </div>
        <div className="auth-card" style={{ padding: '1.5rem', width: 'auto' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Revenue</h3>
          <p style={{ fontSize: '2rem', color: '#10B981', fontWeight: 'bold' }}>₹{stats.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="auth-card" style={{ padding: '1.5rem', width: 'auto' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Today's Sessions</h3>
          <p style={{ fontSize: '2rem', color: 'white', fontWeight: 'bold' }}>{stats.todaysSessions}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div className="auth-card" style={{ padding: '1.5rem', width: 'auto', minHeight: '300px' }}>
          <h3 style={{ color: 'white', marginBottom: '1rem' }}>Monthly Registrations (Placeholder)</h3>
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            Chart rendering...
          </div>
        </div>
        <div className="auth-card" style={{ padding: '1.5rem', width: 'auto', minHeight: '300px' }}>
          <h3 style={{ color: 'white', marginBottom: '1rem' }}>Pending Coach Approvals</h3>
          <ul style={{ color: 'var(--text-muted)', listStyle: 'none', lineHeight: '2' }}>
            <li style={{borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom:'0.5rem'}}>John Doe <span style={{color: '#F59E0B', fontSize:'0.75rem', float:'right'}}>Pending</span></li>
            <li style={{paddingTop:'0.5rem'}}>Sarah Smith <span style={{color: '#F59E0B', fontSize:'0.75rem', float:'right'}}>Pending</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
`);

// 4. CoachManagement.jsx
if (!fs.existsSync('src/pages/Admin')) fs.mkdirSync('src/pages/Admin', { recursive: true });
fs.writeFileSync('src/pages/Admin/CoachManagement.jsx', `import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCoaches, updateCoachStatus } from '../../redux/slices/adminSlice';
import toast from 'react-hot-toast';

const CoachManagement = () => {
  const dispatch = useDispatch();
  const { coaches, isLoading } = useSelector(state => state.admin);

  useEffect(() => {
    dispatch(fetchCoaches());
  }, [dispatch]);

  const toggleApproval = async (id, currentStatus) => {
    if(window.confirm(\`Are you sure you want to \${currentStatus ? 'suspend' : 'approve'} this coach?\`)) {
      const res = await dispatch(updateCoachStatus({ id, statusData: { isActive: !currentStatus, isVerified: !currentStatus } }));
      if(updateCoachStatus.fulfilled.match(res)) {
        toast.success(\`Coach \${currentStatus ? 'Suspended' : 'Approved'}\`);
      }
    }
  };

  return (
    <div>
      <h1 style={{ color: 'white', marginBottom: '2rem' }}>Coach Management</h1>
      
      {isLoading ? <p style={{color: 'white'}}>Loading Coaches...</p> : (
        <div style={{ overflowX: 'auto', background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                <th style={{ padding: '1rem' }}>Name</th>
                <th style={{ padding: '1rem' }}>Email</th>
                <th style={{ padding: '1rem' }}>Phone</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coaches.map(coach => (
                <tr key={coach._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem' }}>{coach.fullName}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{coach.email}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{coach.phone}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '9999px', 
                      fontSize: '0.75rem',
                      background: coach.isVerified ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                      color: coach.isVerified ? '#10B981' : '#F59E0B'
                    }}>
                      {coach.isVerified ? 'Active' : 'Pending'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <button 
                      onClick={() => toggleApproval(coach._id, coach.isVerified)}
                      className="btn"
                      style={{ 
                        padding: '0.5rem 1rem', 
                        fontSize: '0.875rem', 
                        background: coach.isVerified ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                        color: coach.isVerified ? '#EF4444' : '#10B981',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: '6px'
                      }}
                    >
                      {coach.isVerified ? 'Suspend' : 'Approve'}
                    </button>
                  </td>
                </tr>
              ))}
              {coaches.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No coaches found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CoachManagement;
`);

console.log('Admin frontend setup complete!');
