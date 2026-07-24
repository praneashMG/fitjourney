import ClientWorkoutPlan from '../models/ClientWorkoutPlan.js';
import ClientDietPlan from '../models/ClientDietPlan.js';
import WorkoutTemplate from '../models/WorkoutTemplate.js';
import DietTemplate from '../models/DietTemplate.js';
import User from '../models/User.js';

// @desc    Get user's personalized workout plan
// @route   GET /api/my-plan/workout
// @access  Private
export const getMyWorkoutPlan = async (req, res) => {
  try {
    let plan = await ClientWorkoutPlan.findOne({ clientId: req.user._id, isActive: true }).populate('templateId');
    
    if (plan && !plan.templateId) {
      plan.isActive = false;
      await plan.save();
      plan = null;
    }

    if (!plan) {
      const user = await User.findById(req.user._id);
      if (user && user.fitnessGoal && user.currentWeight) {
        const template = await WorkoutTemplate.findOne({
          goal: user.fitnessGoal,
          'weightRange.min': { $lte: user.currentWeight },
          'weightRange.max': { $gt: user.currentWeight }
        });
        
        if (template) {
          let exercises = {};
          const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
          days.forEach(day => {
            if (template.exercises && template.exercises[day] && Array.isArray(template.exercises[day])) {
              exercises[day] = template.exercises[day].map(ex => ({ ...ex.toObject(), completed: false }));
            }
          });
          plan = await ClientWorkoutPlan.create({
            clientId: user._id,
            templateId: template._id,
            exercises,
            isActive: true
          });
          plan = await ClientWorkoutPlan.findById(plan._id).populate('templateId');
        }
      }
    }

    if (!plan) {
      return res.status(404).json({ success: false, message: 'Workout plan not found' });
    }
    res.json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle exercise completion status
// @route   PUT /api/my-plan/workout/toggle
// @access  Private
export const toggleExerciseCompletion = async (req, res) => {
  try {
    const { day, exerciseId, completed } = req.body;
    
    const plan = await ClientWorkoutPlan.findOne({ clientId: req.user._id });
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Workout plan not found' });
    }
    
    // Find the specific exercise
    if (!plan.exercises[day]) {
      return res.status(400).json({ success: false, message: 'Invalid day' });
    }
    
    const exercise = plan.exercises[day].id(exerciseId);
    if (!exercise) {
      return res.status(404).json({ success: false, message: 'Exercise not found' });
    }
    
    exercise.completed = completed;
    await plan.save();
    
    // Calculate total progress
    let totalExercises = 0;
    let completedExercises = 0;
    
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    days.forEach(d => {
      if (plan.exercises[d]) {
        plan.exercises[d].forEach(ex => {
          // If it's a rest day, we can ignore it or count it, let's ignore zero-rep rests
          if (ex.name.toLowerCase().includes('rest') && ex.sets === 0) return;
          
          totalExercises++;
          if (ex.completed) completedExercises++;
        });
      }
    });
    
    const completionRate = totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;
    
    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      'progressStats.workoutCompletionRate': completionRate
    });

    res.json({ success: true, data: plan, completionRate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// @desc    Get user's personalized diet plan
// @route   GET /api/my-plan/diet
// @access  Private
export const getMyDietPlan = async (req, res) => {
  try {
    let plan = await ClientDietPlan.findOne({ clientId: req.user._id, isActive: true }).populate('templateId');
    
    if (plan && !plan.templateId) {
      plan.isActive = false;
      await plan.save();
      plan = null;
    }

    if (!plan) {
      const user = await User.findById(req.user._id);
      if (user && user.fitnessGoal && user.currentWeight) {
        const template = await DietTemplate.findOne({
          goal: user.fitnessGoal,
          'weightRange.min': { $lte: user.currentWeight },
          'weightRange.max': { $gt: user.currentWeight }
        });
        
        if (template) {
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
          plan = await ClientDietPlan.create({
            clientId: user._id,
            templateId: template._id,
            meals,
            isActive: true
          });
          plan = await ClientDietPlan.findById(plan._id).populate('templateId');
        }
      }
    }

    if (!plan) {
      return res.status(404).json({ success: false, message: 'Diet plan not found' });
    }
    res.json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle diet meal completion status
// @route   PUT /api/my-plan/diet/toggle
// @access  Private
export const toggleDietCompletion = async (req, res) => {
  try {
    const { day, mealType, mealId, consumed } = req.body;
    
    const plan = await ClientDietPlan.findOne({ clientId: req.user._id });
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Diet plan not found' });
    }
    
    if (!plan.meals[day] || !plan.meals[day][mealType]) {
      return res.status(400).json({ success: false, message: 'Invalid day or meal type' });
    }
    
    const meal = plan.meals[day][mealType].id(mealId);
    if (!meal) {
      return res.status(404).json({ success: false, message: 'Meal not found' });
    }
    
    meal.consumed = consumed;
    await plan.save();
    
    // Calculate total progress
    let totalMeals = 0;
    let consumedMeals = 0;
    
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const types = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
    
    days.forEach(d => {
      if (plan.meals[d]) {
        types.forEach(t => {
          if (plan.meals[d][t]) {
            plan.meals[d][t].forEach(m => {
              totalMeals++;
              if (m.consumed) consumedMeals++;
            });
          }
        });
      }
    });
    
    const completionRate = totalMeals > 0 ? Math.round((consumedMeals / totalMeals) * 100) : 0;
    
    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      'progressStats.dietCompletionRate': completionRate
    });

    res.json({ success: true, data: plan, completionRate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
