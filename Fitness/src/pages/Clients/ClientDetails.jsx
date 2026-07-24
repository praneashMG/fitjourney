import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

const ClientDetails = () => {
  const { id } = useParams();
  const { token } = useSelector(state => state.auth);
  
  const [activeTab, setActiveTab] = useState('profile');
  const [activeDay, setActiveDay] = useState('Monday');
  
  const [client, setClient] = useState(null);
  const [workoutPlan, setWorkoutPlan] = useState({ exercises: {} });
  const [dietPlan, setDietPlan] = useState({ meals: {} });
  
  const [loading, setLoading] = useState(true);

  // Initialize empty state structure if missing
  const initEmptyWorkout = () => {
    const ex = {};
    daysOfWeek.forEach(d => { ex[d] = []; });
    return ex;
  };

  const initEmptyDiet = () => {
    const meals = {};
    daysOfWeek.forEach(d => { 
      meals[d] = { Breakfast: [], Lunch: [], Dinner: [], Snacks: [] }; 
    });
    return meals;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientRes = await axios.get(`http://localhost:5000/api/clients/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setClient(clientRes.data.data);

        const plansRes = await axios.get(`http://localhost:5000/api/clients/${id}/plans`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const wp = plansRes.data.data.workoutPlan || { exercises: initEmptyWorkout() };
        if (!wp.exercises) wp.exercises = initEmptyWorkout();
        setWorkoutPlan(wp);

        const dp = plansRes.data.data.dietPlan || { meals: initEmptyDiet() };
        if (!dp.meals) dp.meals = initEmptyDiet();
        // Handle migration from old format to new format
        if (dp.meals.Breakfast && !dp.meals.Monday) {
          dp.meals = initEmptyDiet();
        }
        setDietPlan(dp);

      } catch (error) {
        toast.error('Failed to load client details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, token]);

  const handleSaveWorkout = async () => {
    try {
      await axios.put(`http://localhost:5000/api/clients/${id}/workout`, { exercises: workoutPlan.exercises }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Workout plan saved');
    } catch (err) {
      toast.error('Failed to save workout plan');
    }
  };

  const handleSaveDiet = async () => {
    try {
      await axios.put(`http://localhost:5000/api/clients/${id}/diet`, { meals: dietPlan.meals }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Diet plan saved');
    } catch (err) {
      toast.error('Failed to save diet plan');
    }
  };

  const addExercise = () => {
    const newEx = { name: '', sets: 3, reps: '10', rest: '60s' };
    setWorkoutPlan({
      ...workoutPlan,
      exercises: {
        ...workoutPlan.exercises,
        [activeDay]: [...(workoutPlan.exercises[activeDay] || []), newEx]
      }
    });
  };

  const updateExercise = (index, field, value) => {
    const dayEx = [...workoutPlan.exercises[activeDay]];
    dayEx[index][field] = value;
    setWorkoutPlan({
      ...workoutPlan,
      exercises: { ...workoutPlan.exercises, [activeDay]: dayEx }
    });
  };

  const deleteExercise = (index) => {
    const dayEx = workoutPlan.exercises[activeDay].filter((_, i) => i !== index);
    setWorkoutPlan({
      ...workoutPlan,
      exercises: { ...workoutPlan.exercises, [activeDay]: dayEx }
    });
  };

  const addMeal = (mealType) => {
    const newMeal = { name: '', quantity: '', calories: 0 };
    setDietPlan({
      ...dietPlan,
      meals: {
        ...dietPlan.meals,
        [activeDay]: {
          ...dietPlan.meals[activeDay],
          [mealType]: [...(dietPlan.meals[activeDay][mealType] || []), newMeal]
        }
      }
    });
  };

  const updateMeal = (mealType, index, field, value) => {
    const mealsArray = [...dietPlan.meals[activeDay][mealType]];
    mealsArray[index][field] = value;
    setDietPlan({
      ...dietPlan,
      meals: {
        ...dietPlan.meals,
        [activeDay]: {
          ...dietPlan.meals[activeDay],
          [mealType]: mealsArray
        }
      }
    });
  };

  const deleteMeal = (mealType, index) => {
    const mealsArray = dietPlan.meals[activeDay][mealType].filter((_, i) => i !== index);
    setDietPlan({
      ...dietPlan,
      meals: {
        ...dietPlan.meals,
        [activeDay]: {
          ...dietPlan.meals[activeDay],
          [mealType]: mealsArray
        }
      }
    });
  };

  if (loading) return <div>Loading...</div>;
  if (!client) return <div>Client not found</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/clients" className="btn btn-secondary">← Back</Link>
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a' }}>{client.fullName}</h1>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
        <button onClick={() => setActiveTab('profile')} className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-secondary'}`}>Profile</button>
        <button onClick={() => setActiveTab('workout')} className={`btn ${activeTab === 'workout' ? 'btn-primary' : 'btn-secondary'}`}>7-Day Workout Plan</button>
        <button onClick={() => setActiveTab('diet')} className={`btn ${activeTab === 'diet' ? 'btn-primary' : 'btn-secondary'}`}>7-Day Diet Plan</button>
      </div>

      {activeTab === 'profile' && (
        <div className="glass-card">
          <h3>Profile Details</h3>
          <p><strong>Email:</strong> {client.email}</p>
          <p><strong>Phone:</strong> {client.phone}</p>
          <p><strong>Goal:</strong> {client.fitnessGoal}</p>
          <p><strong>Weight:</strong> {client.currentWeight}kg (Target: {client.targetWeight}kg)</p>
          <p><strong>Height:</strong> {client.height}cm</p>
        </div>
      )}

      {activeTab !== 'profile' && (
        <div style={{ display: 'flex', gap: '2rem' }}>
          {/* Day Selector Sidebar */}
          <div style={{ width: '200px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {daysOfWeek.map(day => (
              <button 
                key={day} 
                onClick={() => setActiveDay(day)}
                style={{ 
                  padding: '1rem', 
                  textAlign: 'left', 
                  borderRadius: '8px',
                  border: 'none',
                  background: activeDay === day ? 'var(--primary-blue)' : 'white',
                  color: activeDay === day ? 'white' : '#0f172a',
                  cursor: 'pointer',
                  fontWeight: activeDay === day ? '600' : '400',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="glass-card" style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0 }}>{activeDay} {activeTab === 'workout' ? 'Workout' : 'Diet'}</h2>
              <button onClick={activeTab === 'workout' ? handleSaveWorkout : handleSaveDiet} className="btn btn-primary">
                Save Plan
              </button>
            </div>

            {activeTab === 'workout' && (
              <div>
                {(workoutPlan.exercises[activeDay] || []).map((ex, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center', background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                    <input type="text" value={ex.name} onChange={e => updateExercise(idx, 'name', e.target.value)} placeholder="Exercise Name" className="form-input" style={{ flex: 2 }} />
                    <input type="number" value={ex.sets} onChange={e => updateExercise(idx, 'sets', e.target.value)} placeholder="Sets" className="form-input" style={{ width: '80px' }} />
                    <input type="text" value={ex.reps} onChange={e => updateExercise(idx, 'reps', e.target.value)} placeholder="Reps" className="form-input" style={{ width: '100px' }} />
                    <input type="text" value={ex.rest} onChange={e => updateExercise(idx, 'rest', e.target.value)} placeholder="Rest" className="form-input" style={{ width: '100px' }} />
                    <button onClick={() => deleteExercise(idx)} className="btn btn-secondary" style={{ color: '#EF4444', borderColor: '#fee2e2', background: '#fef2f2' }}>X</button>
                  </div>
                ))}
                <button onClick={addExercise} className="btn btn-secondary" style={{ marginTop: '1rem' }}>+ Add Exercise</button>
              </div>
            )}

            {activeTab === 'diet' && (
              <div>
                {mealTypes.map(mealType => (
                  <div key={mealType} style={{ marginBottom: '2rem' }}>
                    <h3 style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>{mealType}</h3>
                    {dietPlan.meals[activeDay]?.[mealType]?.map((meal, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center', background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                        <input type="text" value={meal.name} onChange={e => updateMeal(mealType, idx, 'name', e.target.value)} placeholder="Food Name" className="form-input" style={{ flex: 2 }} />
                        <input type="text" value={meal.quantity} onChange={e => updateMeal(mealType, idx, 'quantity', e.target.value)} placeholder="Quantity (e.g. 100g)" className="form-input" style={{ flex: 1 }} />
                        <input type="number" value={meal.calories} onChange={e => updateMeal(mealType, idx, 'calories', e.target.value)} placeholder="Calories" className="form-input" style={{ width: '100px' }} />
                        <button onClick={() => deleteMeal(mealType, idx)} className="btn btn-secondary" style={{ color: '#EF4444', borderColor: '#fee2e2', background: '#fef2f2' }}>X</button>
                      </div>
                    ))}
                    <button onClick={() => addMeal(mealType)} className="btn btn-secondary" style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>+ Add {mealType}</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDetails;
