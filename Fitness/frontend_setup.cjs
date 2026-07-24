const fs = require('fs');
const path = require('path');

// 1. axios.js
if (!fs.existsSync('src/services')) fs.mkdirSync('src/services', { recursive: true });
fs.writeFileSync('src/services/axios.js', `import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = \`Bearer \${token}\`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
`);

// 2. authService.js
fs.writeFileSync('src/services/authService.js', `import api from './axios';

export const registerAPI = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const loginAPI = async (userData) => {
  const response = await api.post('/auth/login', userData);
  return response.data;
};
`);

// 3. authSlice.js
if (!fs.existsSync('src/redux/slices')) fs.mkdirSync('src/redux/slices', { recursive: true });
fs.writeFileSync('src/redux/slices/authSlice.js', `import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginAPI, registerAPI } from '../../services/authService';

const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');

const initialState = {
  user: user || null,
  token: token || null,
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
  try {
    const data = await loginAPI(userData);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    const data = await registerAPI(userData);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        // Mock user details since /profile isn't fetched here yet
        const userObj = { email: action.meta.arg.email };
        state.user = userObj;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(userObj));
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        const userObj = { email: action.meta.arg.email, fullName: action.meta.arg.fullName };
        state.user = userObj;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(userObj));
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
`);

// 4. store.js
fs.writeFileSync('src/redux/store.js', `import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
`);

// 5. ProtectedRoute.jsx
fs.writeFileSync('src/routes/ProtectedRoute.jsx', `import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
  const { token } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
`);

// 6. AppRoutes.jsx
fs.writeFileSync('src/routes/AppRoutes.jsx', `import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';

import Landing from '../pages/Landing/Landing';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import Dashboard from '../pages/Dashboard/Dashboard';
import Clients from '../pages/Clients/Clients';
import Workouts from '../pages/Workouts/Workouts';
import DietPlans from '../pages/Diet/DietPlans';
import Courses from '../pages/Courses/Courses';
import Payments from '../pages/Payments/Payments';
import Analytics from '../pages/Analytics/Analytics';
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/diet" element={<DietPlans />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/analytics" element={<Analytics />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
`);

console.log("Frontend auth logic generated!");
