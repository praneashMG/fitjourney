import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import clientReducer from './slices/clientSlice';
import adminReducer from './slices/adminSlice';
import notificationReducer from './slices/notificationSlice';
import dashboardReducer from './slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    clients: clientReducer,
    admin: adminReducer,
    notifications: notificationReducer,
    dashboard: dashboardReducer,
  },
});
