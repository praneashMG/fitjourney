import React, { useEffect, useState } from 'react';
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
    dispatch(fetchClients(`keyword=${keyword}`));
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
        <h1 style={{ color: 'var(--text-primary, #1e293b)' }}>Client Management</h1>
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

      {isLoading ? <p style={{color: 'var(--text-muted)'}}>Loading...</p> : <ClientTable clients={clients} onDelete={handleDelete} />}
    </div>
  );
};

export default Clients;
