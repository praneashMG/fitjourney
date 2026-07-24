import User from '../models/User.js';
import DietTemplate from '../models/DietTemplate.js';
import WorkoutTemplate from '../models/WorkoutTemplate.js';
import ClientDietPlan from '../models/ClientDietPlan.js';
import ClientWorkoutPlan from '../models/ClientWorkoutPlan.js';
import WeightLog from '../models/WeightLog.js';
import generateToken from '../utils/generateToken.js';

export const registerUser = async (req, res) => {
  try {
    const { 
      fullName, email, password, phone, role, specialization,
      fitnessGoal, currentWeight, height, targetWeight, foodPreference, experienceLevel, workoutLocation
    } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    if (role === 'Coach' && specialization) {
      const existingCoach = await User.findOne({ role: 'Coach', specialization });
      if (existingCoach) {
        return res.status(400).json({ success: false, message: `A coach with the specialization '${specialization}' already exists in the system. Only one coach per goal is allowed.` });
      }
    }

    const approvalStatus = role === 'Coach' ? 'Pending' : 'Approved';
    const isVerified = role === 'Client'; // Clients are verified immediately, Coaches wait for Admin

    const user = await User.create({ 
      fullName, 
      email, 
      password, 
      phone, 
      role,
      specialization: role === 'Coach' ? specialization : '',
      approvalStatus,
      isVerified,
      fitnessGoal,
      currentWeight,
      height,
      targetWeight,
      foodPreference,
      experienceLevel
    });

    if (user) {
      // Auto-assign workout and diet if client provided goal and weight
      if (role === 'Client' && fitnessGoal && currentWeight) {
        // Find matching Diet Template
        const dietTemplate = await DietTemplate.findOne({
          goal: fitnessGoal,
          'weightRange.min': { $lte: currentWeight },
          'weightRange.max': { $gte: currentWeight }
        });

        if (dietTemplate) {
          await ClientDietPlan.create({
            clientId: user._id,
            templateId: dietTemplate._id,
            meals: dietTemplate.meals,
            dailyCaloriesTarget: dietTemplate.caloriesRange?.max,
            macros: dietTemplate.macros
          });
        }

        // Find matching Workout Template
        const workoutTemplate = await WorkoutTemplate.findOne({
          goal: fitnessGoal,
          'weightRange.min': { $lte: currentWeight },
          'weightRange.max': { $gte: currentWeight }
        });

        if (workoutTemplate) {
          await ClientWorkoutPlan.create({
            clientId: user._id,
            templateId: workoutTemplate._id,
            exercises: workoutTemplate.exercises
          });
        }
        
        // Log the initial weight to jumpstart their Progress Tracker
        await WeightLog.create({
          userId: user._id,
          weight: currentWeight
        });
      }

      const userToReturn = await User.findById(user._id).select('-password').populate('assignedCoach', 'fullName email phone profileImage role specialization coachStats');
      res.status(201).json({
        success: true,
        message: approvalStatus === 'Pending' ? 'Registration successful! Your account is pending admin approval.' : 'Registration Successful',
        token: approvalStatus === 'Pending' ? undefined : generateToken(user._id),
        user: userToReturn
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      
      if (user.role === 'Coach') {
        if (user.approvalStatus === 'Pending') {
          return res.status(403).json({ success: false, message: 'Your account is pending admin approval.' });
        }
        if (user.approvalStatus === 'Declined') {
          return res.status(403).json({ success: false, message: 'Your account application was declined.' });
        }
      }

      const userToReturn = await User.findById(user._id).select('-password').populate('assignedCoach', 'fullName email phone profileImage role specialization coachStats');
      res.json({
        success: true,
        message: 'Login Successful',
        token: generateToken(user._id),
        user: userToReturn
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid Credentials' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('assignedCoach', 'fullName email phone profileImage role specialization coachStats');
    if (user) {
      res.json({ success: true, data: user });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logoutUser = async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};
