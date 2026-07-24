import React from 'react';
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
