import WorkoutSession from '../models/WorkoutSession.js';
import ClientWorkoutPlan from '../models/ClientWorkoutPlan.js';
import User from '../models/User.js';

const calculateDayTimeSeconds = (exercises) => {
  if (!exercises || exercises.length === 0) return 3600; // default 1 hour
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
          repTimeSeconds = maxReps * 4;
        } else {
          repTimeSeconds = 60;
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
  return totalSeconds;
};

// @desc    Start a new workout session
// @route   POST /api/workout-session/start
// @access  Private (Client)
export const startWorkout = async (req, res) => {
  try {
    const { workoutPlanId } = req.body;
    
    // Check if there's already an active session
    const activeSession = await WorkoutSession.findOne({
      clientId: req.user.id,
      status: 'active'
    });

    if (activeSession) {
      return res.status(400).json({ success: false, message: 'You already have an active workout session.' });
    }

    let exercises = [];
    
    // If a plan ID is provided, populate exercises based on current progress
    if (workoutPlanId) {
      const plan = await ClientWorkoutPlan.findById(workoutPlanId);
      if (plan) {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        let currentProgress = plan.progress || 0;
        
        // Find the next day with exercises to skip rest days
        let dayName = days[currentProgress % 7];
        let todayExercises = plan.exercises[dayName] || [];
        
        // If current day has no exercises, skip ahead (up to 7 days to avoid infinite loop)
        let attempts = 0;
        while (todayExercises.length === 0 && attempts < 7) {
          currentProgress++;
          dayName = days[currentProgress % 7];
          todayExercises = plan.exercises[dayName] || [];
          attempts++;
        }
          
        exercises = todayExercises.map(ex => ({ 
          name: ex.name, 
          sets: ex.sets,
          reps: ex.reps,
          completed: false 
        }));
      }
    }

    const newSession = await WorkoutSession.create({
      clientId: req.user.id,
      workoutPlanId: workoutPlanId || null,
      status: 'active',
      exercises,
      targetSeconds: calculateDayTimeSeconds(exercises),
      timerStatus: 'running',
      lastTimerActionAt: Date.now()
    });

    res.status(201).json({ success: true, data: newSession });
  } catch (error) {
    console.error('Error starting workout session:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get active workout session
// @route   GET /api/workout-session/active
// @access  Private (Client)
export const getActiveWorkout = async (req, res) => {
  try {
    const session = await WorkoutSession.findOne({
      clientId: req.user.id,
      status: 'active'
    });

    if (session) {
      // Sync up the elapsed time if it was running
      if (session.timerStatus === 'running') {
        const now = Date.now();
        const diff = Math.floor((now - new Date(session.lastTimerActionAt).getTime()) / 1000);
        session.elapsedSeconds += diff;
        session.lastTimerActionAt = now;
        await session.save();
      }
    }

    res.status(200).json({ success: true, data: session }); // Return session or null
  } catch (error) {
    console.error('Error fetching active workout session:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Complete a workout session
// @route   PUT /api/workout-session/complete
// @access  Private (Client)
export const completeWorkout = async (req, res) => {
  try {
    const session = await WorkoutSession.findOne({
      clientId: req.user.id,
      status: 'active'
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'No active session found.' });
    }

    if (session.timerStatus === 'running') {
      const now = Date.now();
      const diff = Math.floor((now - new Date(session.lastTimerActionAt).getTime()) / 1000);
      session.elapsedSeconds += diff;
    }

    if (session.elapsedSeconds < session.targetSeconds) {
      return res.status(400).json({ 
        success: false, 
        message: `Workout incomplete. You need to train for at least ${Math.ceil(session.targetSeconds/60)} minutes.` 
      });
    }

    session.status = 'completed';
    session.timerStatus = 'completed';
    session.endTime = Date.now();
    await session.save();

    // Increment progress on the workout plan
    if (session.workoutPlanId) {
      const plan = await ClientWorkoutPlan.findById(session.workoutPlanId);
      if (plan) {
        // Just increment progress to point to the next day
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
      user.progressStats.currentStreak = (user.progressStats.currentStreak || 0) + 1;
      
      if (user.progressStats.currentStreak > (user.progressStats.bestStreak || 0)) {
        user.progressStats.bestStreak = user.progressStats.currentStreak;
      }
      
      user.progressStats.totalWorkouts = (user.progressStats.totalWorkouts || 0) + 1;
      await user.save();
    }

    res.status(200).json({ success: true, data: session });
  } catch (error) {
    console.error('Error completing workout session:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Toggle workout timer (pause/resume)
// @route   PUT /api/workout-session/toggle-timer
// @access  Private (Client)
export const toggleTimer = async (req, res) => {
  try {
    const session = await WorkoutSession.findOne({
      clientId: req.user.id,
      status: 'active'
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'No active session found.' });
    }

    if (session.timerStatus === 'completed') {
      return res.status(400).json({ success: false, message: 'Session is already completed.' });
    }

    const { action } = req.body; // 'pause' or 'resume'
    const now = Date.now();

    if (action === 'pause' && session.timerStatus === 'running') {
      const diff = Math.floor((now - new Date(session.lastTimerActionAt).getTime()) / 1000);
      session.elapsedSeconds += diff;
      session.timerStatus = 'paused';
      session.lastTimerActionAt = now;
    } else if (action === 'resume' && session.timerStatus === 'paused') {
      session.timerStatus = 'running';
      session.lastTimerActionAt = now;
    }

    await session.save();
    res.status(200).json({ success: true, data: session });
  } catch (error) {
    console.error('Error toggling timer:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
