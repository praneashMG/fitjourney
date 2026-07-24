import React from 'react';
import { Link } from 'react-router-dom';

const ClientTable = ({ clients, onDelete }) => {
  return (
    <div style={{ overflowX: 'auto', background: 'white', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-primary, #1e293b)' }}>
        <thead>
          <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
            <th style={{ padding: '1rem', fontWeight: '600' }}>Name</th>
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
              <td style={{ padding: '1rem' }}>{client.fitnessGoal || 'Not set'}</td>
              <td style={{ padding: '1rem' }}>
                <span style={{ 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '9999px', 
                  fontSize: '0.75rem',
                  background: client.isActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  color: client.isActive ? '#10B981' : '#EF4444'
                }}>
                  {client.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                <Link to={`/clients/${client._id}`} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}>View</Link>
                <Link to={`/clients/edit/${client._id}`} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}>Edit</Link>
                <button onClick={() => onDelete(client._id)} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem', color: '#EF4444', borderColor: '#fee2e2', background: '#fef2f2' }}>Delete</button>
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
