import DietSession from '../models/DietSession.js';
import ClientDietPlan from '../models/ClientDietPlan.js';

// @desc    Start a new diet session for the day
// @route   POST /api/diet-session/start
// @access  Private (Client)
export const startDiet = async (req, res) => {
  try {
    const { dietPlanId } = req.body;
    
    // Check if there's already an active session
    const activeSession = await DietSession.findOne({
      clientId: req.user.id,
      status: 'active'
    });

    if (activeSession) {
      return res.status(400).json({ success: false, message: 'You already have an active diet tracker for today.' });
    }

    let meals = {};
    if (dietPlanId) {
      const plan = await ClientDietPlan.findById(dietPlanId);
      if (plan && plan.meals) {
        meals = plan.meals;
      }
    }

    const newSession = await DietSession.create({
      clientId: req.user.id,
      dietPlanId: dietPlanId || null,
      status: 'active',
      meals
    });

    res.status(201).json({ success: true, data: newSession });
  } catch (error) {
    console.error('Error starting diet session:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get active diet session
// @route   GET /api/diet-session/active
// @access  Private (Client)
export const getActiveDiet = async (req, res) => {
  try {
    const session = await DietSession.findOne({
      clientId: req.user.id,
      status: 'active'
    });

    res.status(200).json({ success: true, data: session }); 
  } catch (error) {
    console.error('Error fetching active diet session:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Complete a diet session
// @route   PUT /api/diet-session/complete
// @access  Private (Client)
export const completeDiet = async (req, res) => {
  try {
    const session = await DietSession.findOne({
      clientId: req.user.id,
      status: 'active'
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'No active diet session found.' });
    }

    session.status = 'completed';
    session.endTime = Date.now();
    await session.save();

    if (session.dietPlanId) {
      const plan = await ClientDietPlan.findById(session.dietPlanId);
      if (plan) {
        plan.progress = (plan.progress || 0) + 1;
        await plan.save();
      }
    }

    // Update User streak and stats
    const user = await User.findById(req.user.id);
    if (user) {
      if (!user.progressStats) {
        user.progressStats = {};
      }
      // Assuming completing a diet session also contributes to streak/adherence
      user.progressStats.currentStreak = (user.progressStats.currentStreak || 0) + 1;
      
      if (user.progressStats.currentStreak > (user.progressStats.bestStreak || 0)) {
        user.progressStats.bestStreak = user.progressStats.currentStreak;
      }
      
      user.progressStats.dietAdherenceRate = (user.progressStats.dietAdherenceRate || 0) + 1;
      await user.save();
    }

    res.status(200).json({ success: true, data: session });
  } catch (error) {
    console.error('Error completing diet session:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
