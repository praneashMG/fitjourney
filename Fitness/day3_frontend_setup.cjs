const fs = require('fs');

// 1. clientService.js
if (!fs.existsSync('src/services')) fs.mkdirSync('src/services', { recursive: true });
fs.writeFileSync('src/services/clientService.js', `import api from './axios';

export const getClientsAPI = async (query = '') => {
  const response = await api.get(\`/clients?\${query}\`);
  return response.data;
};

export const getClientAPI = async (id) => {
  const response = await api.get(\`/clients/\${id}\`);
  return response.data;
};

export const createClientAPI = async (clientData) => {
  const response = await api.post('/clients', clientData);
  return response.data;
};

export const updateClientAPI = async (id, clientData) => {
  const response = await api.put(\`/clients/\${id}\`, clientData);
  return response.data;
};

export const deleteClientAPI = async (id) => {
  const response = await api.delete(\`/clients/\${id}\`);
  return response.data;
};

export const changeStatusAPI = async (id, status) => {
  const response = await api.patch(\`/clients/\${id}/status\`, { status });
  return response.data;
};
`);

// 2. clientSlice.js
if (!fs.existsSync('src/redux/slices')) fs.mkdirSync('src/redux/slices', { recursive: true });
fs.writeFileSync('src/redux/slices/clientSlice.js', `import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
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
`);

// 3. Components
if (!fs.existsSync('src/components/client')) fs.mkdirSync('src/components/client', { recursive: true });

fs.writeFileSync('src/components/client/ClientTable.jsx', `import React from 'react';
import { Link } from 'react-router-dom';

const ClientTable = ({ clients, onDelete }) => {
  return (
    <div style={{ overflowX: 'auto', background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--border)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
        <thead>
          <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
            <th style={{ padding: '1rem' }}>Name</th>
            <th style={{ padding: '1rem' }}>Email</th>
            <th style={{ padding: '1rem' }}>Phone</th>
            <th style={{ padding: '1rem' }}>Goal</th>
            <th style={{ padding: '1rem' }}>Status</th>
            <th style={{ padding: '1rem' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(client => (
            <tr key={client._id} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '1rem' }}>{client.fullName}</td>
              <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{client.email}</td>
              <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{client.phone}</td>
              <td style={{ padding: '1rem' }}>{client.goal}</td>
              <td style={{ padding: '1rem' }}>
                <span style={{ 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '9999px', 
                  fontSize: '0.75rem',
                  background: client.status === 'Active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  color: client.status === 'Active' ? '#10B981' : '#EF4444'
                }}>
                  {client.status}
                </span>
              </td>
              <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                <Link to={\`/clients/\${client._id}\`} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>View</Link>
                <Link to={\`/clients/edit/\${client._id}\`} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Edit</Link>
                <button onClick={() => onDelete(client._id)} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', color: '#EF4444' }}>Delete</button>
              </td>
            </tr>
          ))}
          {clients.length === 0 && (
            <tr>
              <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No clients found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ClientTable;
`);

fs.writeFileSync('src/components/client/ClientForm.jsx', `import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const ClientForm = ({ initialData, onSubmit, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialData });
  const navigate = useNavigate();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', background: 'var(--card-bg)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
      
      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
        <label>Full Name</label>
        <input type="text" className="form-input" {...register('fullName', { required: 'Required' })} />
        {errors.fullName && <span className="error-text">{errors.fullName.message}</span>}
      </div>

      <div className="form-group">
        <label>Email</label>
        <input type="email" className="form-input" {...register('email', { required: 'Required' })} />
        {errors.email && <span className="error-text">{errors.email.message}</span>}
      </div>

      <div className="form-group">
        <label>Phone</label>
        <input type="text" className="form-input" {...register('phone', { required: 'Required' })} />
        {errors.phone && <span className="error-text">{errors.phone.message}</span>}
      </div>

      <div className="form-group">
        <label>Height (cm)</label>
        <input type="number" step="0.1" className="form-input" {...register('height', { required: 'Required', min: 1 })} />
      </div>

      <div className="form-group">
        <label>Weight (kg)</label>
        <input type="number" step="0.1" className="form-input" {...register('weight', { required: 'Required', min: 1 })} />
      </div>

      <div className="form-group">
        <label>Goal</label>
        <select className="form-input" {...register('goal', { required: 'Required' })}>
          <option value="Lose Weight">Lose Weight</option>
          <option value="Gain Weight">Gain Weight</option>
          <option value="Build Muscle">Build Muscle</option>
          <option value="Maintain Weight">Maintain Weight</option>
          <option value="General Fitness">General Fitness</option>
        </select>
      </div>

      <div className="form-group">
        <label>Activity Level</label>
        <select className="form-input" {...register('activityLevel')}>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>
      
      <div className="form-group">
        <label>Status</label>
        <select className="form-input" {...register('status')}>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className="form-group" style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Client'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/clients')}>
          Cancel
        </button>
      </div>

    </form>
  );
};

export default ClientForm;
`);

// 4. Pages
if (!fs.existsSync('src/pages/Clients')) fs.mkdirSync('src/pages/Clients', { recursive: true });

fs.writeFileSync('src/pages/Clients/Clients.jsx', `import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClients, deleteClient } from '../../redux/slices/clientSlice';
import ClientTable from '../../components/client/ClientTable';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Clients = () => {
  const dispatch = useDispatch();
  const { clients, isLoading } = useSelector((state) => state.clients);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    dispatch(fetchClients(''));
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchClients(\`keyword=\${keyword}\`));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      const res = await dispatch(deleteClient(id));
      if (deleteClient.fulfilled.match(res)) {
        toast.success('Client deleted');
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: 'white' }}>Client Management</h1>
        <Link to="/clients/add" className="btn btn-primary">+ Add Client</Link>
      </div>

      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', flex: 1 }}>
          <input 
            type="text" 
            placeholder="Search by name, email, or phone..." 
            className="form-input"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ maxWidth: '400px' }}
          />
          <button type="submit" className="btn btn-secondary">Search</button>
        </form>
      </div>

      {isLoading ? <p style={{color: 'white'}}>Loading...</p> : <ClientTable clients={clients} onDelete={handleDelete} />}
    </div>
  );
};

export default Clients;
`);

fs.writeFileSync('src/pages/Clients/AddClient.jsx', `import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addClient } from '../../redux/slices/clientSlice';
import ClientForm from '../../components/client/ClientForm';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AddClient = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector(state => state.clients);

  const handleSubmit = async (data) => {
    const res = await dispatch(addClient(data));
    if (addClient.fulfilled.match(res)) {
      toast.success('Client Added Successfully!');
      navigate('/clients');
    } else {
      toast.error(res.payload || 'Failed to add client');
    }
  };

  return (
    <div>
      <h1 style={{ color: 'white', marginBottom: '2rem' }}>Add New Client</h1>
      <ClientForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default AddClient;
`);

fs.writeFileSync('src/pages/Clients/EditClient.jsx', `import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClient, updateClient, clearSelectedClient } from '../../redux/slices/clientSlice';
import ClientForm from '../../components/client/ClientForm';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const EditClient = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedClient, isLoading } = useSelector(state => state.clients);

  useEffect(() => {
    dispatch(fetchClient(id));
    return () => { dispatch(clearSelectedClient()); };
  }, [dispatch, id]);

  const handleSubmit = async (data) => {
    const res = await dispatch(updateClient({ id, data }));
    if (updateClient.fulfilled.match(res)) {
      toast.success('Client Updated!');
      navigate('/clients');
    } else {
      toast.error(res.payload || 'Failed to update client');
    }
  };

  if (!selectedClient) return <p style={{color: 'white'}}>Loading...</p>;

  return (
    <div>
      <h1 style={{ color: 'white', marginBottom: '2rem' }}>Edit Client</h1>
      <ClientForm initialData={selectedClient} onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default EditClient;
`);

fs.writeFileSync('src/pages/Clients/ClientProfile.jsx', `import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClient, clearSelectedClient } from '../../redux/slices/clientSlice';
import { useParams, Link } from 'react-router-dom';

const ClientProfile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedClient, isLoading } = useSelector(state => state.clients);

  useEffect(() => {
    dispatch(fetchClient(id));
    return () => { dispatch(clearSelectedClient()); };
  }, [dispatch, id]);

  if (isLoading || !selectedClient) return <p style={{color: 'white'}}>Loading...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: 'white' }}>{selectedClient.fullName}'s Profile</h1>
        <Link to={\`/clients/edit/\${selectedClient._id}\`} className="btn btn-primary">Edit Profile</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="auth-card" style={{ width: 'auto', padding: '2rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1.5rem' }}>Personal Info</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}><strong>Email:</strong> {selectedClient.email}</p>
          <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}><strong>Phone:</strong> {selectedClient.phone}</p>
          <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}><strong>Status:</strong> {selectedClient.status}</p>
        </div>

        <div className="auth-card" style={{ width: 'auto', padding: '2rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1.5rem' }}>Fitness Details</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}><strong>Goal:</strong> {selectedClient.goal}</p>
          <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}><strong>Height:</strong> {selectedClient.height} cm</p>
          <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}><strong>Weight:</strong> {selectedClient.weight} kg</p>
          <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}><strong>Activity Level:</strong> {selectedClient.activityLevel}</p>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
`);

console.log("Day 3 frontend files generated successfully!");
