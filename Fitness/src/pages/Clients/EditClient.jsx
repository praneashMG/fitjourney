import React, { useEffect } from 'react';
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
