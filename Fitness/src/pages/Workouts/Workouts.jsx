import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlayCircle, FiClock, FiActivity, FiTarget, FiCalendar, FiCheck, FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi';
import api from '../../services/axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

const Workouts = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [toggling, setToggling] = useState(null);
  
  // Coach Editing State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [activeEditDay, setActiveEditDay] = useState('Monday');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const calculateDayTime = (exercises) => {
    if (!exercises || exercises.length === 0) return 0;
    
    let totalSeconds = 0;
    
    exercises.forEach(ex => {
      if (ex.name.toLowerCase().includes('rest') && ex.sets === 0) return;
      
      const sets = parseInt(ex.sets) || 0;
      
      let repTimeSeconds = 0;
      if (ex.reps) {
        const repStr = ex.reps.toString().toLowerCase();
        if (repStr.includes('s')) {
          repTimeSeconds = parseInt(repStr) || 0;
        } else if (repStr.includes('m')) {
          repTimeSeconds = (parseInt(repStr) || 0) * 60;
        } else {
          const match = repStr.match(/(\d+)/g);
          if (match) {
            const maxReps = parseInt(match[match.length - 1]);
            repTimeSeconds = maxReps * 4; // Assume 4s per rep
          } else {
            repTimeSeconds = 60; // Default for failure/etc
          }
        }
      }
      
      let restTimeSeconds = 0;
      if (ex.rest) {
        const restStr = ex.rest.toString().toLowerCase();
        if (restStr.includes('m')) {
          restTimeSeconds = (parseInt(restStr) || 0) * 60;
        } else if (restStr.includes('s')) {
          restTimeSeconds = parseInt(restStr) || 0;
        } else {
          restTimeSeconds = parseInt(restStr) || 0;
        }
      }
      
      totalSeconds += (sets * repTimeSeconds) + (sets * restTimeSeconds);
    });
    
    return Math.ceil(totalSeconds / 60);
  };

  const { user } = useSelector((state) => state.auth);
  const isClient = user && user.role === 'Client';
  const isCoach = user && (user.role === 'Coach' || user.role === 'Admin');
  const isAdmin = user && user.role === 'Admin';

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchData = async () => {
    try {
      if (isClient) {
        const { data } = await api.get('/my-plan/workout');
        if (data.success && data.data) {
          setSelectedTemplate(data.data);
        } else {
          setSelectedTemplate(null);
        }
      } else {
        const { data } = await api.get('/templates/workouts');
        let fetchedTemplates = data.data;
        setTemplates(fetchedTemplates);
        if (fetchedTemplates.length > 0 && !selectedTemplate) {
          setSelectedTemplate(fetchedTemplates[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [user, isClient]);

  const handleToggle = async (day, exerciseIndex, exerciseId, isCompleted, isLocked) => {
    if (isLocked || toggling || !isClient) return;
    
    setToggling(exerciseId);
    
    // Optimistic update
    const newStatus = !isCompleted;
    setSelectedTemplate(prev => {
      const updated = { ...prev };
      updated.exercises[day][exerciseIndex].completed = newStatus;
      return updated;
    });

    try {
      await api.put('/my-plan/workout/toggle', { day, exerciseId, completed: newStatus });
      if (newStatus) toast.success('Exercise completed!');
    } catch (error) {
      toast.error('Failed to update progress');
      // Revert on error
      setSelectedTemplate(prev => {
        const updated = { ...prev };
        updated.exercises[day][exerciseIndex].completed = isCompleted;
        return updated;
      });
    } finally {
      setToggling(null);
    }
  };

  // --- COACH CRUD LOGIC ---

  const initEmptyWorkout = () => {
    const ex = {};
    days.forEach(d => { ex[d] = []; });
    return ex;
  };

  const handleCreateNew = () => {
    const defaultGoal = isAdmin ? 'Fat Loss' : (user?.specialization || 'Fat Loss');
    setEditForm({
      name: 'New Workout Template',
      goal: defaultGoal,
      experienceLevel: 'Beginner',
      weightRange: { min: 50, max: 60 },
      equipmentRequired: [],
      exercises: initEmptyWorkout()
    });
    setIsEditing(true);
    setSelectedTemplate(null);
  };

  const handleEdit = () => {
    setEditForm(JSON.parse(JSON.stringify(selectedTemplate)));
    setIsEditing(true);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this global template?')) return;
    try {
      await api.delete(`/templates/workouts/${selectedTemplate._id}`);
      toast.success('Template deleted');
      setSelectedTemplate(null);
      fetchData();
    } catch (err) {
      toast.error('Failed to delete template');
    }
  };

  const handleSave = async () => {
    try {
      const payload = { ...editForm };
      if (!payload.bmiRange && payload.weightRange) {
        payload.bmiRange = {
          min: payload.weightRange.min / 2.89 || 20,
          max: payload.weightRange.max / 2.89 || 25
        };
      } else if (!payload.bmiRange) {
        payload.bmiRange = { min: 20, max: 25 };
      }
      if (!payload.workoutLocation) {
        payload.workoutLocation = 'Gym';
      }

      if (payload._id) {
        await api.put(`/templates/workouts/${payload._id}`, payload);
        toast.success('Template updated successfully');
      } else {
        await api.post('/templates/workouts', payload);
        toast.success('New template created');
      }
      setIsEditing(false);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save template');
    }
  };

  const updateEditForm = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const updateWeightRange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      weightRange: { ...prev.weightRange, [field]: parseInt(value) || 0 }
    }));
  };

  const handleFileUpload = async (index, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('media', file);
    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
      updateExercise(index, 'image', baseUrl + data.url);
      toast.success('Media uploaded successfully!');
    } catch (error) {
      console.error('Upload Error:', error);
      toast.error('Failed to upload media');
    }
  };

  const addExercise = () => {
    const newEx = { name: '', sets: 3, reps: '10', rest: '60s' };
    setEditForm(prev => ({
      ...prev,
      exercises: {
        ...prev.exercises,
        [activeEditDay]: [...(prev.exercises[activeEditDay] || []), newEx]
      }
    }));
  };

  const updateExercise = (index, field, value) => {
    const dayEx = [...editForm.exercises[activeEditDay]];
    dayEx[index][field] = value;
    setEditForm(prev => ({
      ...prev,
      exercises: { ...prev.exercises, [activeEditDay]: dayEx }
    }));
  };

  const deleteExercise = (index) => {
    const dayEx = editForm.exercises[activeEditDay].filter((_, i) => i !== index);
    setEditForm(prev => ({
      ...prev,
      exercises: { ...prev.exercises, [activeEditDay]: dayEx }
    }));
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '3px solid #f1f5f9', borderTopColor: '#0f172a', animation: 'spin 1s linear infinite' }}></div>
    </div>
  );

  return (
    <div style={{ padding: isMobile ? '1rem' : '3rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Inter, sans-serif', backgroundColor: '#fafafa', minHeight: '100vh' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-1px', marginBottom: '0.5rem' }}>
            {isClient ? 'My Workout Plan' : 'Workout Library'}
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.05rem', margin: 0 }}>
            {isClient ? 'Track your progress and check off exercises daily.' : 'Explore and manage global workout protocols.'}
          </p>
        </div>
        {isCoach && !isEditing && (
          <button onClick={handleCreateNew} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiPlus /> Add Template
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '2.5rem' }}>
        
        {/* Sidebar for non-clients */}
        {!isClient && (
          <div style={{ width: isMobile ? '100%' : '300px', flexShrink: 0 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a', marginBottom: '1.2rem', paddingLeft: '0.5rem', borderLeft: '3px solid #0f172a' }}>Global Templates</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <AnimatePresence>
                {templates.map((temp) => {
                  const isSelected = selectedTemplate?._id === temp._id && !isEditing;
                  return (
                    <motion.div 
                      key={temp._id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setSelectedTemplate(temp); setIsEditing(false); }}
                      style={{ 
                        padding: '1rem', 
                        borderRadius: '12px', 
                        cursor: 'pointer',
                        background: isSelected ? '#0f172a' : 'transparent',
                        color: isSelected ? 'white' : '#0f172a',
                        border: isSelected ? '1px solid #0f172a' : '1px solid #e2e8f0',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '600', fontFamily: 'Outfit', fontSize: '1.1rem', marginBottom: '0.2rem' }}>{temp.name}</div>
                        <div style={{ fontSize: '0.8rem', color: isSelected ? '#94a3b8' : '#64748b', fontWeight: 500 }}>
                          {temp.weightRange?.min}-{temp.weightRange?.max}kg • {temp.goal}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div style={{ flex: 1 }}>
          {isEditing ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
                <h2 style={{ margin: 0 }}>{editForm._id ? 'Edit Template' : 'New Template'}</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={() => { setIsEditing(false); if (!selectedTemplate && templates.length > 0) setSelectedTemplate(templates[0]); }} className="btn btn-secondary"><FiX /> Cancel</button>
                  <button onClick={handleSave} className="btn btn-primary"><FiSave /> Save</button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: '600', color: '#334155', marginBottom: '0.5rem', display: 'block' }}>Template Name</label>
                  <input type="text" value={editForm.name} onChange={e => updateEditForm('name', e.target.value)} className="form-input" style={{ padding: '0.75rem', width: '100%', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>
                <div>
                  <label className="form-label" style={{ fontWeight: '600', color: '#334155', marginBottom: '0.5rem', display: 'block' }}>Goal</label>
                  <select value={editForm.goal} onChange={e => updateEditForm('goal', e.target.value)} className="form-input" disabled={!isAdmin} style={{ padding: '0.75rem', width: '100%', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                    {isAdmin ? (
                      <>
                        <option value="Fat Loss">Fat Loss</option>
                        <option value="Muscle Gain">Muscle Gain</option>
                        <option value="Endurance">Endurance</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="General Fitness">General Fitness</option>
                        <option value="Weight Loss">Weight Loss</option>
                        <option value="Bodybuilding">Bodybuilding</option>
                      </>
                    ) : (
                      <option value={editForm.goal}>{editForm.goal}</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="form-label" style={{ fontWeight: '600', color: '#334155', marginBottom: '0.5rem', display: 'block' }}>Min Weight (kg)</label>
                  <input type="number" value={editForm.weightRange?.min || ''} onChange={e => updateWeightRange('min', e.target.value)} className="form-input" style={{ padding: '0.75rem', width: '100%', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>
                <div>
                  <label className="form-label" style={{ fontWeight: '600', color: '#334155', marginBottom: '0.5rem', display: 'block' }}>Max Weight (kg)</label>
                  <input type="number" value={editForm.weightRange?.max || ''} onChange={e => updateWeightRange('max', e.target.value)} className="form-input" style={{ padding: '0.75rem', width: '100%', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>
                <div>
                  <label className="form-label" style={{ fontWeight: '600', color: '#334155', marginBottom: '0.5rem', display: 'block' }}>Experience Level</label>
                  <select value={editForm.experienceLevel} onChange={e => updateEditForm('experienceLevel', e.target.value)} className="form-input" style={{ padding: '0.75rem', width: '100%', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '1.5rem' }}>Schedule Editor</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', borderBottom: '2px solid #f1f5f9' }}>
                  {days.map(day => (
                    <button 
                      key={day} 
                      onClick={() => setActiveEditDay(day)} 
                      style={{ 
                        padding: '0.75rem 1.25rem', 
                        whiteSpace: 'nowrap',
                        background: activeEditDay === day ? '#0f172a' : 'transparent',
                        color: activeEditDay === day ? 'white' : '#64748b',
                        fontWeight: activeEditDay === day ? '600' : '500',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        fontSize: '0.95rem'
                      }}
                    >
                      {day}
                    </button>
                  ))}
                </div>

                <div style={{ flex: 1, background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a', fontWeight: '600' }}>{activeEditDay} Routine</h4>
                    <button onClick={addExercise} className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '8px' }}><FiPlus /> Add Exercise</button>
                  </div>
                  
                  {(!editForm.exercises[activeEditDay] || editForm.exercises[activeEditDay].length === 0) ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8', border: '2px dashed #e2e8f0', borderRadius: '12px', background: '#f8fafc' }}>
                      <p style={{ margin: 0, fontSize: '1.05rem' }}>No exercises for {activeEditDay}.</p>
                      <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem' }}>Click "Add Exercise" to start building the routine.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {(editForm.exercises[activeEditDay] || []).map((ex, idx) => (
                        <div key={idx} style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', alignItems: 'center', background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', transition: 'all 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#cbd5e1'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}>
                          <div style={{ flex: '1 1 250px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div>
                              <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', marginBottom: '0.4rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Exercise Name</span>
                              <input type="text" value={ex.name} onChange={e => updateExercise(idx, 'name', e.target.value)} placeholder="e.g. Barbell Squats" className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }} />
                            </div>
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Media URL (Image or Video)</span>
                                <label style={{ cursor: 'pointer', color: '#3b82f6', fontSize: '0.8rem', fontWeight: '600' }}>
                                  Upload File
                                  <input type="file" style={{ display: 'none' }} accept="image/*,video/*" onChange={e => handleFileUpload(idx, e.target.files[0])} />
                                </label>
                              </div>
                              <div 
                                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                onDrop={(e) => { e.preventDefault(); e.stopPropagation(); handleFileUpload(idx, e.dataTransfer.files[0]); }}
                              >
                                <input type="text" value={ex.image || ''} onChange={e => updateExercise(idx, 'image', e.target.value)} placeholder="Drag & drop file, or paste URL" className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }} />
                              </div>
                            </div>
                          </div>
                          
                          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.4rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sets</span>
                              <input type="number" value={ex.sets} onChange={e => updateExercise(idx, 'sets', e.target.value)} className="form-input" style={{ width: '80px', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', textAlign: 'center' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.4rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reps</span>
                              <input type="text" value={ex.reps} onChange={e => updateExercise(idx, 'reps', e.target.value)} className="form-input" style={{ width: '90px', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', textAlign: 'center' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.4rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rest</span>
                              <input type="text" value={ex.rest} onChange={e => updateExercise(idx, 'rest', e.target.value)} className="form-input" style={{ width: '90px', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', textAlign: 'center' }} />
                            </div>
                            <button onClick={() => deleteExercise(idx)} style={{ padding: '0.75rem', color: '#ef4444', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', height: '42px' }} title="Delete Exercise" onMouseEnter={(e) => e.currentTarget.style.background = '#fecaca'} onMouseLeave={(e) => e.currentTarget.style.background = '#fee2e2'}><FiTrash2 size={18} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </motion.div>
          ) : selectedTemplate ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="neat-card" style={{ padding: isMobile ? '1.5rem' : '3.5rem' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '2.5rem', marginBottom: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span className="badge-neat"><FiTarget size={14} /> {selectedTemplate.templateId ? selectedTemplate.templateId.goal : selectedTemplate.goal}</span>
                    <span className="badge-neat"><FiActivity size={14} /> {selectedTemplate.templateId ? selectedTemplate.templateId.experienceLevel : selectedTemplate.experienceLevel}</span>
                  </div>
                  {isCoach && (isAdmin || user?.specialization === selectedTemplate.goal) && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={handleEdit} className="btn btn-secondary"><FiEdit2 /> Edit</button>
                      <button onClick={handleDelete} className="btn btn-secondary" style={{ color: '#ef4444', borderColor: '#fee2e2', background: '#fef2f2' }}><FiTrash2 /></button>
                    </div>
                  )}
                </div>
                
                <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.2rem', fontWeight: 600, letterSpacing: '-0.5px' }}>
                  {selectedTemplate.templateId ? selectedTemplate.templateId.name : selectedTemplate.name}
                </h2>
                <div style={{ color: '#64748b', fontSize: '0.95rem' }}>
                  {!isClient && <>Target: <strong>{selectedTemplate.weightRange?.min} - {selectedTemplate.weightRange?.max} kg</strong> &nbsp;•&nbsp;</>} 
                  Equipment: <strong>{selectedTemplate.templateId ? selectedTemplate.templateId.equipmentRequired?.join(', ') : (selectedTemplate.equipmentRequired?.join(', ') || 'None')}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
                {(() => {
                  let isPreviousCompleted = true; // Track completion across all days
                  
                  return days.map(day => {
                    const hasExercises = selectedTemplate.exercises[day] && selectedTemplate.exercises[day].length > 0;

                    return (
                      <div key={day}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                          <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{day}</h3>
                          {hasExercises && (
                            <span style={{ fontSize: '0.85rem', color: '#64748b', background: '#f1f5f9', padding: '0.2rem 0.6rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <FiClock size={12} /> ~{calculateDayTime(selectedTemplate.exercises[day])} mins
                            </span>
                          )}
                          <div style={{ flex: 1, height: '1px', background: '#f1f5f9' }}></div>
                        </div>
                        
                        {hasExercises ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                            {selectedTemplate.exercises[day].map((ex, i) => {
                              const isRestDay = ex.name.toLowerCase().includes('rest') && ex.sets === 0;
                              const isLocked = isClient && !isPreviousCompleted && !ex.completed && !isRestDay;
                              const isCompleted = ex.completed;
                              
                              if (!isRestDay) isPreviousCompleted = !!ex.completed;

                              return (
                                <div 
                                  key={i} 
                                  onClick={() => { if (!isRestDay && isClient) handleToggle(day, i, ex._id, isCompleted, isLocked); }}
                                  style={{ 
                                    padding: '1.25rem 0', borderBottom: i === selectedTemplate.exercises[day].length - 1 ? 'none' : '1px solid #f8fafc',
                                    display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem',
                                    opacity: isLocked ? 0.5 : 1, cursor: (isClient && !isRestDay && !isLocked) ? 'pointer' : 'default',
                                    transition: 'all 0.2s ease' 
                                  }}
                                  onMouseEnter={(e) => { if (isClient && !isRestDay && !isLocked) e.currentTarget.style.background = '#f8fafc'; }}
                                  onMouseLeave={(e) => { if (isClient && !isRestDay && !isLocked) e.currentTarget.style.background = 'transparent'; }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1 }}>
                                    
                                    {isClient && !isRestDay && (
                                      <div style={{ width: '28px', height: '28px', borderRadius: '8px', border: isCompleted ? 'none' : '2px solid #cbd5e1', background: isCompleted ? '#22c55e' : 'transparent', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', marginRight: '0.5rem' }}>
                                        {isCompleted && <FiCheck size={16} strokeWidth={3} />}
                                      </div>
                                    )}

                                    <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: '#f1f5f9', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#94a3b8', flexShrink: 0, overflow: 'hidden' }}>
                                      {ex.image ? (
                                        ex.image.match(/\.(mp4|webm|ogg)$/i) ? (
                                          <video src={ex.image} autoPlay loop muted playsInline style={{width: '100%', height:'100%', objectFit: 'cover'}} />
                                        ) : (
                                          <img src={ex.image} alt="" style={{width: '100%', height:'100%', objectFit: 'cover'}} />
                                        )
                                      ) : <FiActivity />}
                                    </div>
                                    <div>
                                      <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '1.05rem', textDecoration: isCompleted ? 'line-through' : 'none' }}>{ex.name}</div>
                                      {ex.notes && <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{ex.notes}</div>}
                                      {isLocked && <div style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 500 }}>Complete previous exercise to unlock</div>}
                                    </div>
                                  </div>
                                  
                                  {!isRestDay && (
                                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', color: '#475569', fontSize: '0.9rem' }}>
                                      <div style={{ textAlign: 'center', minWidth: '40px' }}><div style={{ fontWeight: '600', color: '#0f172a' }}>{ex.sets}</div><div style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>Sets</div></div>
                                      <div style={{ textAlign: 'center', minWidth: '40px' }}><div style={{ fontWeight: '600', color: '#0f172a' }}>{ex.reps}</div><div style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>Reps</div></div>
                                      <div style={{ textAlign: 'center', minWidth: '50px' }}><div style={{ fontWeight: '600', color: '#0f172a' }}>{ex.rest}</div><div style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>Rest</div></div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div style={{ color: '#94a3b8', padding: '1.5rem', background: '#fcfcfc', borderRadius: '12px', border: '1px dashed #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem' }}>
                            <FiClock size={16} /> Rest Day
                          </div>
                          )}
                        </div>
                      )
                    })
                  })()}
                </div>

            </motion.div>
          ) : (
            <div className="neat-card" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', color: '#94a3b8' }}>
              <div style={{ textAlign: 'center' }}>
                <FiActivity size={32} color="#e2e8f0" style={{ marginBottom: '1rem' }} />
                <div>{isClient ? 'No workout plan assigned yet.' : 'Select a template or create a new one.'}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Workouts;
