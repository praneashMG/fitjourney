import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getClientsAPI, getClientAPI, createClientAPI, updateClientAPI, deleteClientAPI, changeStatusAPI } from '../../services/clientService';

const initialState = {
  clients: [],
  selectedClient: null,
  total: 0,
  page: 1,
  pages: 1,
  isLoading: false,
  error: null,
};

export const fetchClients = createAsyncThunk('clients/fetchAll', async (query, thunkAPI) => {
  try {
    return await getClientsAPI(query);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const fetchClient = createAsyncThunk('clients/fetchSingle', async (id, thunkAPI) => {
  try {
    return await getClientAPI(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const addClient = createAsyncThunk('clients/add', async (clientData, thunkAPI) => {
  try {
    return await createClientAPI(clientData);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateClient = createAsyncThunk('clients/update', async ({ id, data }, thunkAPI) => {
  try {
    return await updateClientAPI(id, data);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const deleteClient = createAsyncThunk('clients/delete', async (id, thunkAPI) => {
  try {
    await deleteClientAPI(id);
    return id; // Return ID so we can remove it from state
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const clientSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    clearSelectedClient: (state) => {
      state.selectedClient = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchClients.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clients = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchClients.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      // Fetch Single
      .addCase(fetchClient.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchClient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedClient = action.payload.data;
      })
      .addCase(fetchClient.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      // Add
      .addCase(addClient.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(addClient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clients.unshift(action.payload.data);
      })
      .addCase(addClient.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      // Update
      .addCase(updateClient.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(updateClient.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.clients.findIndex(c => c._id === action.payload.data._id);
        if (index !== -1) {
          state.clients[index] = action.payload.data;
        }
        state.selectedClient = action.payload.data;
      })
      .addCase(updateClient.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      // Delete
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.clients = state.clients.filter(c => c._id !== action.payload);
      });
  },
});

export const { clearSelectedClient } = clientSlice.actions;
export default clientSlice.reducer;
