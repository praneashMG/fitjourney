import User from '../models/User.js';
import ClientWorkoutPlan from '../models/ClientWorkoutPlan.js';
import ClientDietPlan from '../models/ClientDietPlan.js';
import WorkoutTemplate from '../models/WorkoutTemplate.js';
import DietTemplate from '../models/DietTemplate.js';
import WeightLog from '../models/WeightLog.js';
import WorkoutSession from '../models/WorkoutSession.js';
import DietSession from '../models/DietSession.js';

/**
 * Get all dashboard data for the authenticated client
 * @route GET /api/dashboard/client
 * @access Private
 */
export const getClientDashboard = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware

    // Fetch user details
    const user = await User.findById(userId).select('-password').populate('assignedCoach', 'fullName email phone profileImage role specialization coachStats');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Fetch the active workout plan
    let workoutPlan = await ClientWorkoutPlan.findOne({ clientId: userId, isActive: true })
      .populate('templateId', 'name goal')
      .sort({ createdAt: -1 });
      
    if (workoutPlan && !workoutPlan.templateId) {
      workoutPlan.isActive = false;
      await workoutPlan.save();
      workoutPlan = null;
    }
      
    if (!workoutPlan && user.fitnessGoal && user.currentWeight) {
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
        workoutPlan = await ClientWorkoutPlan.create({
          clientId: userId,
          templateId: template._id,
          exercises,
          isActive: true
        });
        workoutPlan = await ClientWorkoutPlan.findById(workoutPlan._id).populate('templateId', 'name goal');
      }
    }

    // Fetch the active diet plan
    let dietPlan = await ClientDietPlan.findOne({ clientId: userId, isActive: true })
      .populate('templateId', 'name goal')
      .sort({ createdAt: -1 });

    if (dietPlan && !dietPlan.templateId) {
      dietPlan.isActive = false;
      await dietPlan.save();
      dietPlan = null;
    }

    if (!dietPlan && user.fitnessGoal && user.currentWeight) {
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
        dietPlan = await ClientDietPlan.create({
          clientId: userId,
          templateId: template._id,
          meals,
          isActive: true
        });
        dietPlan = await ClientDietPlan.findById(dietPlan._id).populate('templateId', 'name goal');
      }
    }

    // In a real application, you might also fetch upcoming sessions, notifications, etc.

    return res.status(200).json({
      success: true,
      data: {
        user,
        workoutPlan,
        dietPlan
      }
    });
  } catch (error) {
    console.error('Error fetching client dashboard:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Log today's weight for the authenticated client
 * @route POST /api/dashboard/weight
 * @access Private
 */
export const logWeight = async (req, res) => {
  try {
    const userId = req.user.id;
    const { weight } = req.body;

    if (!weight) {
      return res.status(400).json({ success: false, message: 'Weight is required' });
    }

    // Create new weight log
    const newLog = await WeightLog.create({
      userId,
      weight
    });

    // Update currentWeight in User profile
    await User.findByIdAndUpdate(userId, { currentWeight: weight });

    return res.status(201).json({ success: true, data: newLog, message: 'Weight logged successfully' });
  } catch (error) {
    console.error('Error logging weight:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Get weight history for the authenticated client (last 7 logs)
 * @route GET /api/dashboard/weight-history
 * @access Private
 */
export const getWeightHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const limit = parseInt(req.query.limit) || 30;
    
    // Fetch weight logs sorted by date ascending for the chart
    const logs = await WeightLog.find({ userId })
      .sort({ date: -1 })
      .limit(limit);

    // Format and filter to ensure only 1 point per day (the latest one)
    const uniqueDays = new Map();
    
    logs.forEach(log => {
      const d = new Date(log.date);
      const formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      // Since logs are sorted newest to oldest, the first time we see a date, it's the latest entry for that day
      if (!uniqueDays.has(formattedDate)) {
        uniqueDays.set(formattedDate, log.weight);
      }
    });

    // Reconstruct the array and reverse it back to chronological order for the chart (oldest to newest)
    const chartData = Array.from(uniqueDays, ([name, weight]) => ({ name, weight })).reverse();

    return res.status(200).json({ success: true, data: chartData });
  } catch (error) {
    console.error('Error fetching weight history:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Get all dashboard data for the authenticated coach
 * @route GET /api/dashboard/coach
 * @access Private
 */
export const getCoachDashboard = async (req, res) => {
  try {
    const coachId = req.user.id;

    // 1. Get all clients assigned to this coach
    const clients = await User.find({ assignedCoach: coachId, role: 'Client' }).select('_id fullName profileImage');
    const clientIds = clients.map(c => c._id);
    const totalClients = clients.length;

    if (totalClients === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalClients: 0,
          activePlans: 0,
          todaysSessions: 0,
          pendingReviews: 0,
          chartData: [0, 0, 0, 0, 0, 0, 0],
          recentActivity: []
        }
      });
    }

    // 2. Active Plans
    const activeWorkoutPlans = await ClientWorkoutPlan.countDocuments({ clientId: { $in: clientIds }, isActive: true });
    const activeDietPlans = await ClientDietPlan.countDocuments({ clientId: { $in: clientIds }, isActive: true });
    const activePlans = activeWorkoutPlans + activeDietPlans;

    // Date range helpers
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // 3. Today's Sessions (Workouts + Diets)
    const todaysWorkouts = await WorkoutSession.countDocuments({ 
      clientId: { $in: clientIds }, 
      createdAt: { $gte: startOfToday, $lte: endOfToday } 
    });
    const todaysDiets = await DietSession.countDocuments({
      clientId: { $in: clientIds },
      createdAt: { $gte: startOfToday, $lte: endOfToday }
    });
    const todaysSessions = todaysWorkouts + todaysDiets;

    // 4. Pending Reviews (Placeholder for now)
    const pendingReviews = 0;

    // 5. Recent Activity
    // Fetch last 5 workouts and 5 diets, combine, sort, and take top 4
    const recentWorkouts = await WorkoutSession.find({ clientId: { $in: clientIds } })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('clientId', 'fullName');
      
    const recentDiets = await DietSession.find({ clientId: { $in: clientIds } })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('clientId', 'fullName');

    let allActivities = [];
    
    recentWorkouts.forEach(w => {
      allActivities.push({
        id: `w-${w._id}`,
        type: 'workout',
        text: `${w.clientId?.fullName || 'A client'} ${w.status === 'completed' ? 'completed a workout' : 'started a workout'}`,
        time: w.createdAt,
        timestamp: w.createdAt.getTime()
      });
    });

    recentDiets.forEach(d => {
      allActivities.push({
        id: `d-${d._id}`,
        type: 'diet',
        text: `${d.clientId?.fullName || 'A client'} ${d.status === 'completed' ? 'completed all meals' : 'logged a meal'}`,
        time: d.createdAt,
        timestamp: d.createdAt.getTime()
      });
    });

    // Add new clients as activity
    const recentNewClients = await User.find({ assignedCoach: coachId, role: 'Client' })
      .sort({ createdAt: -1 })
      .limit(2);
      
    recentNewClients.forEach(c => {
      allActivities.push({
        id: `c-${c._id}`,
        type: 'client',
        text: `New client ${c.fullName} signed up`,
        time: c.createdAt,
        timestamp: c.createdAt.getTime()
      });
    });

    allActivities.sort((a, b) => b.timestamp - a.timestamp);
    const recentActivity = allActivities.slice(0, 4);

    // 6. Client Engagement Chart Data (Mon to Sun of current week, or last 7 days)
    // To match Mon-Sun layout, we'll bucket completed sessions for the current week.
    // To be simple and ensure we have some data, we'll get the last 7 days dynamically, 
    // but map it to Mon-Sun. Let's just create a generic 7-day array of completed sessions.
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentCompletedWorkouts = await WorkoutSession.find({
      clientId: { $in: clientIds },
      createdAt: { $gte: sevenDaysAgo },
      status: 'completed'
    });

    // Initialize Mon(0) to Sun(6)
    let weeklyData = [0, 0, 0, 0, 0, 0, 0];
    
    recentCompletedWorkouts.forEach(w => {
      const date = new Date(w.createdAt);
      // getDay() is 0 (Sun) to 6 (Sat)
      let dayIndex = date.getDay() - 1; // 0(Mon) to 5(Sat), -1 for Sun
      if (dayIndex === -1) dayIndex = 6; // Sunday
      weeklyData[dayIndex] += 1; // Increment session count for that day
    });

    // Base values to ensure chart isn't totally flat if there is low usage, scaled by engagement
    // Adding 10 to everything just to look decent if there's very sparse data,
    // or just return exact numbers.
    const chartData = weeklyData.map(val => val * 10 + 5);

    return res.status(200).json({
      success: true,
      data: {
        totalClients,
        activePlans,
        todaysSessions,
        pendingReviews,
        chartData,
        recentActivity
      }
    });

  } catch (error) {
    console.error('Error fetching coach dashboard:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
