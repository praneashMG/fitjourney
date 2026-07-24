import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/axios';
import { useSelector } from 'react-redux';

const DietPlans = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  const mealTypes = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const { data } = await api.get('/templates/diets');
        let fetchedTemplates = data.data;

        // Filter templates based on user's weight if the user is a client and has weight set
        if (user && user.role === 'Client' && user.currentWeight) {
          fetchedTemplates = fetchedTemplates.filter(
            (t) => user.currentWeight >= (t.weightRange?.min || 0) && user.currentWeight <= (t.weightRange?.max || 999)
          );
        }

        setTemplates(fetchedTemplates);
        if (fetchedTemplates.length > 0) {
          setSelectedTemplate(fetchedTemplates[0]);
        }
      } catch (err) {
        console.error('Failed to fetch templates', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, [user]);

  if (loading) return <div style={{ padding: '2rem', color: '#1e293b' }}>Loading Diet Templates...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
        style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white' }}
      >
        <div>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Template Library</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '0.5rem', marginBottom: '0.5rem' }}>Diet Plans</h1>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', margin: 0 }}>Standardized Nutrition for Clients</p>
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '2rem' }}>
        
        {/* Sidebar: Template List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'white', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', maxHeight: '70vh', overflowY: 'auto' }}>
          <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>Available Plans</h3>
          {templates.map(temp => (
            <div 
              key={temp._id} 
              onClick={() => setSelectedTemplate(temp)}
              style={{ 
                padding: '1rem', 
                borderRadius: '8px', 
                cursor: 'pointer',
                background: selectedTemplate?._id === temp._id ? '#f0fdf4' : 'transparent',
                border: selectedTemplate?._id === temp._id ? '1px solid #bbf7d0' : '1px solid transparent',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ fontWeight: '600', color: selectedTemplate?._id === temp._id ? '#15803d' : '#334155' }}>{temp.name}</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>Goal: {temp.goal}</div>
            </div>
          ))}
          {templates.length === 0 && <div style={{ color: '#64748b', fontSize: '0.9rem' }}>No templates found.</div>}
        </div>

        {/* Main Content: Selected Template Details */}
        {selectedTemplate ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', color: '#0f172a', margin: '0 0 1rem 0' }}>{selectedTemplate.name}</h2>
                <div style={{ display: 'flex', gap: '1rem', color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: '#f8fafc', padding: '6px 12px', borderRadius: '8px' }}>Weight Range: {selectedTemplate.weightRange?.min} - {selectedTemplate.weightRange?.max} kg</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: '#f8fafc', padding: '6px 12px', borderRadius: '8px' }}>Calories: {selectedTemplate.caloriesRange?.min} - {selectedTemplate.caloriesRange?.max}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: '#f8fafc', padding: '6px 12px', borderRadius: '8px' }}>Diet: {selectedTemplate.foodPreference}</span>
                </div>
              </div>
              
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', minWidth: '200px' }}>
                <div style={{ fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '0.5rem' }}>Daily Macros</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ color: '#334155' }}>Protein:</span>
                  <span style={{ fontWeight: '600', color: '#0f172a' }}>{selectedTemplate.macros?.protein}g</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ color: '#334155' }}>Carbs:</span>
                  <span style={{ fontWeight: '600', color: '#0f172a' }}>{selectedTemplate.macros?.carbs}g</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#334155' }}>Fats:</span>
                  <span style={{ fontWeight: '600', color: '#0f172a' }}>{selectedTemplate.macros?.fat}g</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {mealTypes.map(mealType => (
                <div key={mealType}>
                  <h3 style={{ fontSize: '1.2rem', color: '#1e293b', marginBottom: '1rem', borderBottom: '2px solid #e2e8f0', display: 'inline-block', paddingBottom: '0.25rem' }}>{mealType}</h3>
                  {selectedTemplate.meals[mealType] && selectedTemplate.meals[mealType].length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {selectedTemplate.meals[mealType].map((item, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <div>
                            <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '1.05rem' }}>{item.name}</div>
                            <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>{item.quantity}</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: '600', color: '#334155', fontSize: '1.1rem' }}>{item.calories}</div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>Calories</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ color: '#94a3b8', fontStyle: 'italic', padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>No items added</div>
                  )}
                </div>
              ))}
            </div>

          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'white', borderRadius: '12px', border: '1px solid var(--border)', minHeight: '400px', color: '#64748b' }}>
            Select a template to view details
          </div>
        )}
      </div>
    </div>
  );
};

export default DietPlans;
