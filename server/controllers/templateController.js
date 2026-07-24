import WorkoutTemplate from '../models/WorkoutTemplate.js';
import DietTemplate from '../models/DietTemplate.js';
import User from '../models/User.js';

export const getWorkoutTemplates = async (req, res) => {
  try {
    let query = {};
    if (req.user && req.user.role === 'Client') {
      const user = await User.findById(req.user.id);
      if (user && user.currentWeight && user.fitnessGoal) {
        query = {
          goal: user.fitnessGoal,
          'weightRange.min': { $lte: user.currentWeight },
          'weightRange.max': { $gt: user.currentWeight }
        };
      } else if (user && user.role === 'Client') {
        // Return nothing if they haven't set their weight/goal yet
        return res.json({ success: true, data: [] });
      }
    } else if (req.user && req.user.role === 'Coach') {
      const user = await User.findById(req.user.id);
      if (user && user.specialization) {
        query = { goal: user.specialization };
      }
    }
    const workouts = await WorkoutTemplate.find(query).sort({ 'weightRange.min': 1 });
    res.json({ success: true, data: workouts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDietTemplates = async (req, res) => {
  try {
    let query = {};
    if (req.user && req.user.role === 'Client') {
      const user = await User.findById(req.user.id);
      if (user && user.currentWeight && user.fitnessGoal) {
        query = {
          goal: user.fitnessGoal,
          'weightRange.min': { $lte: user.currentWeight },
          'weightRange.max': { $gt: user.currentWeight }
        };
      } else if (user && user.role === 'Client') {
        // Return nothing if they haven't set their weight/goal yet
        return res.json({ success: true, data: [] });
      }
    } else if (req.user && req.user.role === 'Coach') {
      const user = await User.findById(req.user.id);
      if (user && user.specialization) {
        query = { goal: user.specialization };
      }
    }
    const diets = await DietTemplate.find(query).sort({ 'weightRange.min': 1 });
    res.json({ success: true, data: diets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new workout template
// @route   POST /api/templates/workouts
// @access  Private (Coach/Admin)
export const createWorkoutTemplate = async (req, res) => {
  try {
    if (req.user.role === 'Coach' && req.user.specialization !== req.body.goal) {
      return res.status(403).json({ success: false, message: 'You can only create templates for your specialization' });
    }
    const template = await WorkoutTemplate.create(req.body);
    res.status(201).json({ success: true, data: template });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a workout template
// @route   PUT /api/templates/workouts/:id
// @access  Private (Coach/Admin)
export const updateWorkoutTemplate = async (req, res) => {
  try {
    let template = await WorkoutTemplate.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }
    if (req.user.role === 'Coach' && req.user.specialization !== template.goal) {
      return res.status(403).json({ success: false, message: 'You can only edit templates for your specialization' });
    }
    
    template = await WorkoutTemplate.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    
    // Sync to all active ClientWorkoutPlans that use this template
    const ClientWorkoutPlan = (await import('../models/ClientWorkoutPlan.js')).default;
    let exercises = {};
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    days.forEach(day => {
      if (template.exercises && template.exercises[day] && Array.isArray(template.exercises[day])) {
        exercises[day] = template.exercises[day].map(ex => ({ ...ex.toObject(), completed: false }));
      }
    });
    await ClientWorkoutPlan.updateMany({ templateId: template._id }, { $set: { exercises } });

    res.json({ success: true, data: template });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a workout template
// @route   DELETE /api/templates/workouts/:id
// @access  Private (Coach/Admin)
export const deleteWorkoutTemplate = async (req, res) => {
  try {
    const template = await WorkoutTemplate.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }
    if (req.user.role === 'Coach' && req.user.specialization !== template.goal) {
      return res.status(403).json({ success: false, message: 'You can only delete templates for your specialization' });
    }
    await template.deleteOne();
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new diet template
// @route   POST /api/templates/diets
// @access  Private (Coach/Admin)
export const createDietTemplate = async (req, res) => {
  try {
    if (req.user.role === 'Coach' && req.user.specialization !== req.body.goal) {
      return res.status(403).json({ success: false, message: 'You can only create templates for your specialization' });
    }
    const template = await DietTemplate.create(req.body);
    res.status(201).json({ success: true, data: template });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a diet template
// @route   PUT /api/templates/diets/:id
// @access  Private (Coach/Admin)
export const updateDietTemplate = async (req, res) => {
  try {
    let template = await DietTemplate.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }
    if (req.user.role === 'Coach' && req.user.specialization !== template.goal) {
      return res.status(403).json({ success: false, message: 'You can only edit templates for your specialization' });
    }
    
    template = await DietTemplate.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    
    // Sync to all active ClientDietPlans that use this template
    const ClientDietPlan = (await import('../models/ClientDietPlan.js')).default;
    let meals = {};
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const types = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
    
    days.forEach(day => {
      if (template.meals && template.meals[day]) {
        meals[day] = {};
        types.forEach(type => {
          if (template.meals[day][type] && Array.isArray(template.meals[day][type])) {
            meals[day][type] = template.meals[day][type].map(meal => ({ ...meal.toObject(), consumed: false }));
          }
        });
      }
    });
    
    await ClientDietPlan.updateMany({ templateId: template._id }, { $set: { meals } });

    res.json({ success: true, data: template });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a diet template
// @route   DELETE /api/templates/diets/:id
// @access  Private (Coach/Admin)
export const deleteDietTemplate = async (req, res) => {
  try {
    const template = await DietTemplate.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }
    if (req.user.role === 'Coach' && req.user.specialization !== template.goal) {
      return res.status(403).json({ success: false, message: 'You can only delete templates for your specialization' });
    }
    await template.deleteOne();
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
