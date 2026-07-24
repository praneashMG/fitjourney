import React from 'react';
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
