import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCoaches, updateCoachStatus, deleteCoachAdmin, updateCoachAdmin } from '../../redux/slices/adminSlice';
import { FiEdit2, FiTrash2, FiCheck, FiX, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CoachManagement = () => {
  const dispatch = useDispatch();
  const { coaches, isLoading } = useSelector(state => state.admin);
  const [editingId, setEditingId] = React.useState(null);
  const [editForm, setEditForm] = React.useState({});
  
  // Add Coach Modal State
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [addForm, setAddForm] = React.useState({ fullName: '', email: '', phone: '', specialization: '', password: 'Password123!' });

  useEffect(() => {
    dispatch(fetchCoaches());
  }, [dispatch]);

  const handleApproval = async (id, status) => {
    if(window.confirm(`Are you sure you want to ${status.toLowerCase()} this coach?`)) {
      const res = await dispatch(updateCoachStatus({ id, statusData: { approvalStatus: status } }));
      if(updateCoachStatus.fulfilled.match(res)) {
        toast.success(`Coach ${status}`);
        // Optionally refetch here if needed, but assuming slice handles state update
      }
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to permanently delete this coach?')) {
      const res = await dispatch(deleteCoachAdmin(id));
      if(deleteCoachAdmin.fulfilled.match(res)) {
        toast.success('Coach deleted successfully');
      }
    }
  };

  const handleEditClick = (coach) => {
    setEditingId(coach._id);
    setEditForm({ fullName: coach.fullName, phone: coach.phone, specialization: coach.specialization });
  };

  const handleSaveEdit = async (id) => {
    const res = await dispatch(updateCoachAdmin({ id, data: editForm }));
    if(updateCoachAdmin.fulfilled.match(res)) {
      toast.success('Coach updated successfully');
      setEditingId(null);
    }
  };

  const handleAddCoach = async (e) => {
    e.preventDefault();
    const { addUserAdmin } = await import('../../redux/slices/adminSlice');
    const payload = { ...addForm, role: 'Coach' };
    const res = await dispatch(addUserAdmin(payload));
    if (addUserAdmin.fulfilled.match(res)) {
      toast.success('Coach added successfully');
      setShowAddModal(false);
      setAddForm({ fullName: '', email: '', phone: '', specialization: '', password: 'Password123!' });
    } else {
      toast.error(res.payload || 'Failed to add coach');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: '#0f172a', margin: 0, fontSize: '1.8rem', fontWeight: '700' }}>Coach Management</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <FiPlus /> Add Coach
        </button>
      </div>
      
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '400px' }}>
            <h2 style={{ marginTop: 0 }}>Add New Coach</h2>
            <form onSubmit={handleAddCoach} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Full Name</label>
                <input required value={addForm.fullName} onChange={e => setAddForm({...addForm, fullName: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email</label>
                <input required type="email" value={addForm.email} onChange={e => setAddForm({...addForm, email: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Phone</label>
                <input required value={addForm.phone} onChange={e => setAddForm({...addForm, phone: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Specialization</label>
                <input required value={addForm.specialization} onChange={e => setAddForm({...addForm, specialization: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Password</label>
                <input required value={addForm.password} onChange={e => setAddForm({...addForm, password: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" style={{ flex: 1, background: '#10b981', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Add Coach</button>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, background: '#ef4444', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoading ? <p style={{color: '#64748b'}}>Loading Coaches...</p> : (
        <div style={{ overflowX: 'auto', background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', border: '1px solid #e2e8f0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: '#334155' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: '#475569', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: '#475569', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Specialty</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: '#475569', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: '#475569', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: '#475569', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coaches.map((coach, index) => (
                <tr key={coach._id} style={{ borderBottom: index === coaches.length - 1 ? 'none' : '1px solid #e2e8f0', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    {editingId === coach._id ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <input value={editForm.fullName} onChange={e => setEditForm({...editForm, fullName: e.target.value})} style={{ padding: '0.2rem', border: '1px solid #ccc', borderRadius: '4px' }} />
                        <div style={{fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem'}}>{coach.email}</div>
                      </div>
                    ) : (
                      <>
                        <div style={{fontWeight: '600', color: '#0f172a'}}>{coach.fullName}</div>
                        <div style={{fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem'}}>{coach.email}</div>
                      </>
                    )}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: '#64748b' }}>
                    {editingId === coach._id ? (
                      <input value={editForm.specialization} onChange={e => setEditForm({...editForm, specialization: e.target.value})} style={{ padding: '0.2rem', border: '1px solid #ccc', borderRadius: '4px', width: '100px' }} />
                    ) : (
                      <span style={{background: '#f1f5f9', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: '500', color: '#334155'}}>{coach.specialization || 'General'}</span>
                    )}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: '#64748b' }}>
                    {editingId === coach._id ? (
                      <input value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} style={{ padding: '0.2rem', border: '1px solid #ccc', borderRadius: '4px', width: '100px' }} />
                    ) : (
                      coach.phone
                    )}
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ 
                      padding: '0.35rem 0.85rem', 
                      borderRadius: '9999px', 
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      background: coach.approvalStatus === 'Approved' ? '#dcfce7' : coach.approvalStatus === 'Declined' ? '#fee2e2' : '#fef3c7',
                      color: coach.approvalStatus === 'Approved' ? '#166534' : coach.approvalStatus === 'Declined' ? '#991b1b' : '#92400e'
                    }}>
                      {coach.approvalStatus || 'Pending'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {editingId === coach._id ? (
                      <>
                        <button onClick={() => handleSaveEdit(coach._id)} style={{ padding: '0.4rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}><FiCheck /></button>
                        <button onClick={() => setEditingId(null)} style={{ padding: '0.4rem', background: '#64748b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}><FiX /></button>
                      </>
                    ) : (
                      <>
                        {coach.approvalStatus !== 'Approved' && (
                          <button 
                            onClick={() => handleApproval(coach._id, 'Approved')}
                            style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', fontWeight: '600', background: 'white', color: '#10B981', border: '1px solid #10B981', cursor: 'pointer', borderRadius: '6px', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                          >
                            Approve
                          </button>
                        )}
                        {coach.approvalStatus !== 'Declined' && (
                          <button 
                            onClick={() => handleApproval(coach._id, 'Declined')}
                            style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', fontWeight: '600', background: 'white', color: '#EF4444', border: '1px solid #EF4444', cursor: 'pointer', borderRadius: '6px', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                          >
                            Decline
                          </button>
                        )}
                        <button onClick={() => handleEditClick(coach)} style={{ padding: '0.5rem', background: 'transparent', color: '#3b82f6', border: 'none', cursor: 'pointer' }}><FiEdit2 size={16} /></button>
                        <button onClick={() => handleDelete(coach._id)} style={{ padding: '0.5rem', background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer' }}><FiTrash2 size={16} /></button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {coaches.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: '#64748b', fontSize: '1.1rem' }}>No coaches found in the system.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CoachManagement;
