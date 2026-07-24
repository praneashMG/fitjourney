import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDashboardStatsAPI, getCoachesAPI, updateCoachStatusAPI, deleteUserAdminAPI, updateUserAdminAPI, addUserAdminAPI } from '../../services/adminService';

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

export const updateCoachAdmin = createAsyncThunk('admin/updateCoachAdmin', async ({ id, data }, thunkAPI) => {
  try {
    return await updateUserAdminAPI(id, data);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const deleteCoachAdmin = createAsyncThunk('admin/deleteCoachAdmin', async (id, thunkAPI) => {
  try {
    await deleteUserAdminAPI(id);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const addUserAdmin = createAsyncThunk('admin/addUserAdmin', async (data, thunkAPI) => {
  try {
    return await addUserAdminAPI(data);
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
      })
      .addCase(updateCoachAdmin.fulfilled, (state, action) => {
        const index = state.coaches.findIndex(c => c._id === action.payload.data._id);
        if (index !== -1) {
          state.coaches[index] = action.payload.data;
        }
      })
      // Delete Coach
      .addCase(deleteCoachAdmin.fulfilled, (state, action) => {
        state.coaches = state.coaches.filter(c => c._id !== action.payload);
      })
      // Add User
      .addCase(addUserAdmin.fulfilled, (state, action) => {
        if (action.payload.data.role === 'Coach') {
          state.coaches.unshift(action.payload.data);
        }
      });
  },
});

export default adminSlice.reducer;
