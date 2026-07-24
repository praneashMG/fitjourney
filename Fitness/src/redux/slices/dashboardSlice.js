import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCoachDashboardAPI, getClientDashboardAPI } from '../../services/dashboardService';

const initialState = {
  data: null,
  isLoading: false,
  error: null,
};

export const fetchCoachDashboard = createAsyncThunk('dashboard/fetchCoach', async (_, thunkAPI) => {
  try {
    return await getCoachDashboardAPI();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const fetchClientDashboard = createAsyncThunk('dashboard/fetchClient', async (_, thunkAPI) => {
  try {
    return await getClientDashboardAPI();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboard: (state) => {
      state.data = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoachDashboard.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchCoachDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data;
      })
      .addCase(fetchCoachDashboard.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      
      .addCase(fetchClientDashboard.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchClientDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data;
      })
      .addCase(fetchClientDashboard.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });
  },
});

export const { clearDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
