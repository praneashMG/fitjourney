import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { FiCheck, FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiActivity, FiClock, FiTarget } from 'react-icons/fi';

const DietPlans = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [toggling, setToggling] = useState(null);

  // Coach Editing State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [activeEditDay, setActiveEditDay] = useState('Monday');

  const { user } = useSelector((state) => state.auth);
  const isClient = user && user.role === 'Client';
  const isCoach = user && (user.role === 'Coach' || user.role === 'Admin');
  const isAdmin = user && user.role === 'Admin';

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchData = async () => {
    try {
      if (isClient) {
        const { data } = await api.get('/my-plan/diet');
        if (data.success && data.data) {
          // Normalize the meals structure if it's the old format
          const templateData = data.data;
          if (templateData.meals && templateData.meals.Breakfast && !templateData.meals.Monday) {
             templateData.meals = initEmptyDiet();
          }
          setSelectedTemplate(templateData);
        } else {
          setSelectedTemplate(null);
        }
      } else {
        const { data } = await api.get('/templates/diets');
        let fetchedTemplates = data.data;
        // Normalize
        fetchedTemplates.forEach(t => {
          if (t.meals && t.meals.Breakfast && !t.meals.Monday) {
            t.meals = initEmptyDiet();
          }
        });
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

  const handleToggle = async (day, mealType, mealIndex, mealId, isConsumed) => {
    if (toggling || !isClient) return;
    
    setToggling(mealId);
    
    const newStatus = !isConsumed;
    setSelectedTemplate(prev => {
      const updated = { ...prev };
      updated.meals[day][mealType][mealIndex].consumed = newStatus;
      return updated;
    });

    try {
      await api.put('/my-plan/diet/toggle', { day, mealType, mealId, consumed: newStatus });
      if (newStatus) toast.success('Meal logged!');
    } catch (error) {
      toast.error('Failed to update progress');
      setSelectedTemplate(prev => {
        const updated = { ...prev };
        updated.meals[day][mealType][mealIndex].consumed = isConsumed;
        return updated;
      });
    } finally {
      setToggling(null);
    }
  };

  // --- COACH CRUD LOGIC ---

  const initEmptyDiet = () => {
    const meals = {};
    daysOfWeek.forEach(d => { 
      meals[d] = { Breakfast: [], Lunch: [], Dinner: [], Snacks: [] }; 
    });
    return meals;
  };

  const handleCreateNew = () => {
    const defaultGoal = isAdmin ? 'Fat Loss' : (user?.specialization || 'Fat Loss');
    setEditForm({
      name: 'New Diet Template',
      goal: defaultGoal,
      dietType: 'Non Vegetarian',
      weightRange: { min: 50, max: 60 },
      dailyCaloriesTarget: 2000,
      macros: { protein: 150, carbs: 200, fat: 50 },
      meals: initEmptyDiet()
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
      await api.delete(`/templates/diets/${selectedTemplate._id}`);
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
      
      if (payload.dietType) {
        payload.foodPreference = payload.dietType;
      }
      
      // Ensure caloriesRange exists for backend validation
      if (payload.dailyCaloriesTarget) {
        payload.caloriesRange = {
          min: parseInt(payload.dailyCaloriesTarget) - 100,
          max: parseInt(payload.dailyCaloriesTarget) + 100
        };
      } else if (payload.caloriesRange) {
        payload.caloriesRange = {
          min: parseInt(payload.caloriesRange.min) || 0,
          max: parseInt(payload.caloriesRange.max) || 0
        };
      } else {
        payload.caloriesRange = { min: 2000, max: 2500 };
      }

      if (!payload.weightRange) {
        payload.weightRange = { min: 50, max: 60 };
      }

      if (payload._id) {
        await api.put(`/templates/diets/${payload._id}`, payload);
        toast.success('Template updated successfully');
      } else {
        await api.post('/templates/diets', payload);
        toast.success('New template created');
      }
      setIsEditing(false);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save template');
    }
  };

  const updateEditForm = (field, value) => setEditForm(prev => ({ ...prev, [field]: value }));
  const updateWeightRange = (field, value) => setEditForm(prev => ({ ...prev, weightRange: { ...prev.weightRange, [field]: parseInt(value) || 0 } }));
  const updateMacros = (field, value) => setEditForm(prev => ({ ...prev, macros: { ...prev.macros, [field]: parseInt(value) || 0 } }));

  const addMeal = (mealType) => {
    const newMeal = { name: '', quantity: '', calories: 0 };
    setEditForm(prev => ({
      ...prev,
      meals: {
        ...prev.meals,
        [activeEditDay]: {
          ...prev.meals[activeEditDay],
          [mealType]: [...(prev.meals[activeEditDay]?.[mealType] || []), newMeal]
        }
      }
    }));
  };

  const handleFileUpload = async (mealType, index, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('media', file);
    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
      updateMeal(mealType, index, 'image', baseUrl + data.url);
      toast.success('Media uploaded successfully!');
    } catch (error) {
      console.error('Upload Error:', error);
      toast.error('Failed to upload media');
    }
  };

  const updateMeal = (mealType, index, field, value) => {
    const mealsArray = [...editForm.meals[activeEditDay][mealType]];
    mealsArray[index][field] = value;
    setEditForm(prev => ({
      ...prev,
      meals: {
        ...prev.meals,
        [activeEditDay]: {
          ...prev.meals[activeEditDay],
          [mealType]: mealsArray
        }
      }
    }));
  };

  const deleteMeal = (mealType, index) => {
    const mealsArray = editForm.meals[activeEditDay][mealType].filter((_, i) => i !== index);
    setEditForm(prev => ({
      ...prev,
      meals: {
        ...prev.meals,
        [activeEditDay]: {
          ...prev.meals[activeEditDay],
          [mealType]: mealsArray
        }
      }
    }));
  };

  const calculateTotalCalories = (mealsObj) => {
    if (!mealsObj) return 0;
    let total = 0;
    Object.values(mealsObj).forEach(mealsArr => {
      mealsArr.forEach(m => total += (parseInt(m.calories) || 0));
    });
    return total;
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
          <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#64748b' }}>Nutrition Library</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-1px', margin: '0.25rem 0' }}>
            Diet Plans
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.05rem', margin: 0 }}>
            Standardized Nutrition Frameworks for Clients
          </p>
        </div>
        {isCoach && !isEditing && (
          <button onClick={handleCreateNew} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiPlus /> Add Template
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '2.5rem' }}>
        
        {/* Sidebar */}
        {!isClient && (
          <div style={{ width: isMobile ? '100%' : '300px', flexShrink: 0 }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '1rem' }}>Weight Brackets</h3>
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
                        padding: '1.25rem', 
                        borderRadius: '16px', 
                        cursor: 'pointer',
                        background: isSelected ? '#0f172a' : 'white',
                        color: isSelected ? 'white' : '#0f172a',
                        border: isSelected ? '1px solid #0f172a' : '1px solid #e2e8f0',
                        boxShadow: isSelected ? '0 10px 25px -5px rgba(15, 23, 42, 0.2)' : 'none',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ fontWeight: '600', fontFamily: 'Outfit', fontSize: '1.15rem', marginBottom: '0.25rem' }}>
                        {temp.weightRange?.min} - {temp.weightRange?.max} kg
                      </div>
                      <div style={{ fontSize: '0.85rem', color: isSelected ? '#94a3b8' : '#64748b' }}>
                        {temp.dailyCaloriesTarget || temp.caloriesRange?.max || 0} kcal • {temp.goal}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                <div>
                  <label className="form-label">Template Name</label>
                  <input type="text" value={editForm.name} onChange={e => updateEditForm('name', e.target.value)} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Goal</label>
                  <select value={editForm.goal} onChange={e => updateEditForm('goal', e.target.value)} className="form-input" disabled={!isAdmin}>
                      {isAdmin ? (
                        <>
                          <option value="Fat Loss">Fat Loss</option>
                          <option value="Muscle Gain">Muscle Gain</option>
                          <option value="Maintenance">Maintenance</option>
                          <option value="Endurance">Endurance</option>
                          <option value="General Fitness">General Fitness</option>
                          <option value="Weight Loss">Weight Loss</option>
                          <option value="Bodybuilding">Bodybuilding</option>
                          <option value="Crossfit">Crossfit</option>
                          <option value="Yoga">Yoga</option>
                          <option value="Strength Training">Strength Training</option>
                        </>
                      ) : (
                      <option value={editForm.goal}>{editForm.goal}</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="form-label">Diet Type</label>
                  <select value={editForm.dietType} onChange={e => updateEditForm('dietType', e.target.value)} className="form-input">
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Non Vegetarian">Non Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Daily Calories</label>
                  <input type="number" value={editForm.dailyCaloriesTarget || editForm.caloriesRange?.max || ''} onChange={e => updateEditForm('dailyCaloriesTarget', e.target.value)} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Min Weight (kg)</label>
                  <input type="number" value={editForm.weightRange?.min || ''} onChange={e => updateWeightRange('min', e.target.value)} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Max Weight (kg)</label>
                  <input type="number" value={editForm.weightRange?.max || ''} onChange={e => updateWeightRange('max', e.target.value)} className="form-input" />
                </div>
                
                {/* Macros */}
                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label className="form-label">Protein (g)</label>
                    <input type="number" value={editForm.macros.protein} onChange={e => updateMacros('protein', e.target.value)} className="form-input" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="form-label">Carbs (g)</label>
                    <input type="number" value={editForm.macros.carbs} onChange={e => updateMacros('carbs', e.target.value)} className="form-input" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="form-label">Fat (g)</label>
                    <input type="number" value={editForm.macros.fat} onChange={e => updateMacros('fat', e.target.value)} className="form-input" />
                  </div>
                </div>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '1.5rem' }}>Meal Schedule Editor</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', borderBottom: '2px solid #f1f5f9' }}>
                  {daysOfWeek.map(day => (
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
                  {mealTypes.map(mealType => (
                    <div key={mealType} style={{ marginBottom: '2rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                        <h4 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a', fontWeight: '600' }}>{mealType}</h4>
                        <button onClick={() => addMeal(mealType)} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '8px' }}><FiPlus /> Add Food</button>
                      </div>
                      
                      {(!editForm.meals[activeEditDay]?.[mealType] || editForm.meals[activeEditDay]?.[mealType].length === 0) ? (
                        <div style={{ textAlign: 'center', padding: '1.5rem', color: '#94a3b8', border: '1px dashed #cbd5e1', borderRadius: '12px', background: '#f8fafc' }}>
                          <p style={{ margin: 0, fontSize: '0.95rem' }}>No foods for {mealType}. Click "Add Food".</p>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {editForm.meals[activeEditDay]?.[mealType]?.map((meal, idx) => (
                            <div key={idx} style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', alignItems: 'center', background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', transition: 'all 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#cbd5e1'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}>
                              <div style={{ flex: '1 1 250px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div>
                                  <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', marginBottom: '0.4rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Food Name</span>
                                  <input type="text" value={meal.name} onChange={e => updateMeal(mealType, idx, 'name', e.target.value)} placeholder="e.g. Oatmeal" className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }} />
                                </div>
                                <div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Media URL (Image)</span>
                                    <label style={{ cursor: 'pointer', color: '#3b82f6', fontSize: '0.8rem', fontWeight: '600' }}>
                                      Upload File
                                      <input type="file" style={{ display: 'none' }} accept="image/*,video/*" onChange={e => handleFileUpload(mealType, idx, e.target.files[0])} />
                                    </label>
                                  </div>
                                  <div 
                                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                    onDrop={(e) => { e.preventDefault(); e.stopPropagation(); handleFileUpload(mealType, idx, e.dataTransfer.files[0]); }}
                                  >
                                    <input type="text" value={meal.image || ''} onChange={e => updateMeal(mealType, idx, 'image', e.target.value)} placeholder="Drag & drop file, or paste URL" className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }} />
                                  </div>
                                </div>
                              </div>
                              
                              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.4rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quantity</span>
                                  <input type="text" value={meal.quantity} onChange={e => updateMeal(mealType, idx, 'quantity', e.target.value)} placeholder="e.g. 1 cup" className="form-input" style={{ width: '120px', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.4rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Calories</span>
                                  <input type="number" value={meal.calories} onChange={e => updateMeal(mealType, idx, 'calories', e.target.value)} className="form-input" style={{ width: '80px', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', textAlign: 'center' }} />
                                </div>
                                <button onClick={() => deleteMeal(mealType, idx)} style={{ padding: '0.75rem', color: '#ef4444', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', height: '42px' }} title="Delete Food" onMouseEnter={(e) => e.currentTarget.style.background = '#fecaca'} onMouseLeave={(e) => e.currentTarget.style.background = '#fee2e2'}><FiTrash2 size={18} /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          ) : selectedTemplate ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="neat-card" style={{ padding: isMobile ? '1.5rem' : '3.5rem' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                    <span className="badge-neat"><FiTarget size={14} /> {selectedTemplate.templateId ? selectedTemplate.templateId.goal : selectedTemplate.goal}</span>
                    <span className="badge-neat"><FiActivity size={14} /> {selectedTemplate.templateId ? selectedTemplate.templateId.dietType : selectedTemplate.dietType}</span>
                  </div>
                  <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.2rem', fontWeight: 600, letterSpacing: '-0.5px', marginBottom: '0.5rem' }}>
                    {selectedTemplate.templateId ? selectedTemplate.templateId.name : selectedTemplate.name}
                  </h2>
                  <div style={{ color: '#64748b', fontSize: '0.95rem' }}>
                    Target: <strong>{isClient ? selectedTemplate.templateId?.weightRange?.min : selectedTemplate.weightRange?.min} - {isClient ? selectedTemplate.templateId?.weightRange?.max : selectedTemplate.weightRange?.max} kg</strong>
                  </div>
                </div>

                {isCoach && (isAdmin || user?.specialization === selectedTemplate.goal) && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={handleEdit} className="btn btn-secondary"><FiEdit2 /> Edit</button>
                    <button onClick={handleDelete} className="btn btn-secondary" style={{ color: '#ef4444', borderColor: '#fee2e2', background: '#fef2f2' }}><FiTrash2 /></button>
                  </div>
                )}
                
                <div style={{ width: '220px', background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', marginLeft: '2rem' }}>
                  <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#64748b', margin: '0 0 1rem 0' }}>Daily Macros</h4>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                      <span style={{ color: '#475569' }}>Protein</span>
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>{selectedTemplate.macros?.protein}g</span>
                    </div>
                    <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: '40%', height: '100%', background: '#0f172a' }}></div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                      <span style={{ color: '#475569' }}>Carbs</span>
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>{selectedTemplate.macros?.carbs}g</span>
                    </div>
                    <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: '55%', height: '100%', background: '#64748b' }}></div>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                      <span style={{ color: '#475569' }}>Fat</span>
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>{selectedTemplate.macros?.fat}g</span>
                    </div>
                    <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: '25%', height: '100%', background: '#cbd5e1' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {daysOfWeek.map(day => {
                const hasMeals = selectedTemplate.meals?.[day] && (
                  (selectedTemplate.meals[day].Breakfast?.length > 0) ||
                  (selectedTemplate.meals[day].Lunch?.length > 0) ||
                  (selectedTemplate.meals[day].Dinner?.length > 0) ||
                  (selectedTemplate.meals[day].Snacks?.length > 0)
                );

                return (
                  <div key={day} style={{ marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 600, margin: 0 }}>{day}</h3>
                      {hasMeals && (
                        <span style={{ fontSize: '0.85rem', color: '#64748b', background: '#f1f5f9', padding: '0.2rem 0.6rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <FiActivity size={12} /> ~{calculateTotalCalories(selectedTemplate.meals[day])} kcal
                        </span>
                      )}
                      <div style={{ flex: 1, height: '1px', background: '#f1f5f9' }}></div>
                    </div>

                    {!hasMeals ? (
                       <div style={{ color: '#94a3b8', padding: '1.5rem', background: '#fcfcfc', borderRadius: '12px', border: '1px dashed #e2e8f0', fontSize: '0.95rem' }}>
                         No meals assigned for {day}.
                       </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                        {mealTypes.map((mealType) => {
                          const meals = selectedTemplate.meals[day]?.[mealType] || [];
                          if (meals.length === 0) return null;
                          
                          return (
                            <div key={mealType}>
                              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>{mealType}</h3>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {meals.map((meal, index) => {
                                  const isConsumed = meal.consumed;
                                  return (
                                    <div 
                                      key={index} 
                                      onClick={() => { if (isClient) handleToggle(day, mealType, index, meal._id, isConsumed); }}
                                      style={{ 
                                        padding: '1.25rem', 
                                        borderRadius: '12px',
                                        background: isConsumed ? '#f8fafc' : 'white',
                                        border: '1px solid #f1f5f9',
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center', 
                                        gap: '1.5rem',
                                        cursor: isClient ? 'pointer' : 'default',
                                        transition: 'all 0.2s ease',
                                        opacity: isConsumed ? 0.7 : 1
                                      }}
                                    >
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                        {isClient && (
                                          <div style={{ width: '28px', height: '28px', borderRadius: '8px', border: isConsumed ? 'none' : '2px solid #cbd5e1', background: isConsumed ? '#22c55e' : 'transparent', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
                                            {isConsumed && <FiCheck size={16} strokeWidth={3} />}
                                          </div>
                                        )}
                                        
                                        {meal.image && (
                                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f1f5f9', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#94a3b8', flexShrink: 0, overflow: 'hidden' }}>
                                              {meal.image.match(/\.(mp4|webm|ogg)$/i) ? (
                                                <video src={meal.image} autoPlay loop muted playsInline style={{width: '100%', height:'100%', objectFit: 'cover'}} />
                                              ) : (
                                                <img src={meal.image} alt="" style={{width: '100%', height:'100%', objectFit: 'cover'}} />
                                              )}
                                            </div>
                                        )}
                                        
                                        <div>
                                          <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '1.05rem', textDecoration: isConsumed ? 'line-through' : 'none' }}>{meal.name}</div>
                                          <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>{meal.quantity}</div>
                                        </div>
                                      </div>
                                      
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a', fontWeight: '600', background: '#f8fafc', padding: '0.5rem 1rem', borderRadius: '999px' }}>
                                        <FiActivity size={14} color="#64748b" /> {meal.calories} kcal
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </motion.div>
          ) : (
            <div className="neat-card" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', color: '#94a3b8' }}>
              <div style={{ textAlign: 'center' }}>
                <FiActivity size={32} color="#e2e8f0" style={{ marginBottom: '1rem' }} />
                <div>{isClient ? 'No diet plan assigned yet.' : 'Select a template or create a new one.'}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DietPlans;
