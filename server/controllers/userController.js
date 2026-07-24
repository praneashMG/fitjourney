import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import DietTemplate from '../models/DietTemplate.js';
import WorkoutTemplate from '../models/WorkoutTemplate.js';
import ClientDietPlan from '../models/ClientDietPlan.js';
import ClientWorkoutPlan from '../models/ClientWorkoutPlan.js';
import WeightLog from '../models/WeightLog.js';

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('assignedCoach', 'fullName email phone profileImage role');
    if (user) {
      res.json({ success: true, data: user });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update personal information
// @route   PUT /api/users/profile/personal
export const updatePersonalInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.fullName = req.body.fullName || user.fullName;
      user.phone = req.body.phone || user.phone;
      if (req.body.profileImage !== undefined) user.profileImage = req.body.profileImage;
      if (req.body.dateOfBirth !== undefined) user.dateOfBirth = req.body.dateOfBirth;
      if (req.body.gender) user.gender = req.body.gender;
      if (req.body.emergencyContact !== undefined) user.emergencyContact = req.body.emergencyContact;
      
      if (req.body.address) {
        user.address = { ...user.address, ...req.body.address };
      }

      const updatedUser = await user.save();
      const userToReturn = await User.findById(updatedUser._id).select('-password').populate('assignedCoach', 'fullName email phone profileImage role');
      res.json(userToReturn);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update fitness information
// @route   PUT /api/users/profile/fitness
export const updateFitnessInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      const oldWeight = user.currentWeight;
      const oldGoal = user.fitnessGoal;

      if (req.body.height !== undefined) user.height = req.body.height;
      if (req.body.currentWeight !== undefined) user.currentWeight = req.body.currentWeight;
      if (req.body.targetWeight !== undefined) user.targetWeight = req.body.targetWeight;
      if (req.body.bmi !== undefined) user.bmi = req.body.bmi;
      if (req.body.fitnessGoal) user.fitnessGoal = req.body.fitnessGoal;
      if (req.body.activityLevel) user.activityLevel = req.body.activityLevel;
      if (req.body.workoutPreference) user.workoutPreference = req.body.workoutPreference;
      if (req.body.foodPreference) user.foodPreference = req.body.foodPreference;
      if (req.body.medicalConditions !== undefined) user.medicalConditions = req.body.medicalConditions;
      if (req.body.experienceLevel) user.experienceLevel = req.body.experienceLevel;
      if (req.body.allergies !== undefined) user.allergies = req.body.allergies;
      if (req.body.injuries !== undefined) user.injuries = req.body.injuries;

      const updatedUser = await user.save();

      // Check if weight or goal changed to re-assign plans
      if (user.role === 'Client' && (oldWeight !== updatedUser.currentWeight || oldGoal !== updatedUser.fitnessGoal)) {
        await ClientDietPlan.updateMany({ clientId: user._id, isActive: true }, { isActive: false });
        await ClientWorkoutPlan.updateMany({ clientId: user._id, isActive: true }, { isActive: false });

        const dietTemplate = await DietTemplate.findOne({
          goal: updatedUser.fitnessGoal,
          'weightRange.min': { $lte: updatedUser.currentWeight },
          'weightRange.max': { $gte: updatedUser.currentWeight }
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

        const workoutTemplate = await WorkoutTemplate.findOne({
          goal: updatedUser.fitnessGoal,
          'weightRange.min': { $lte: updatedUser.currentWeight },
          'weightRange.max': { $gte: updatedUser.currentWeight }
        });

        if (workoutTemplate) {
          await ClientWorkoutPlan.create({
            clientId: user._id,
            templateId: workoutTemplate._id,
            exercises: workoutTemplate.exercises
          });
        }

        if (oldWeight !== updatedUser.currentWeight) {
          await WeightLog.create({
            userId: user._id,
            weight: updatedUser.currentWeight
          });
        }
      }

      const userToReturn = await User.findById(updatedUser._id).select('-password').populate('assignedCoach', 'fullName email phone profileImage role');
      res.json(userToReturn);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update preferences
// @route   PUT /api/users/profile/preferences
export const updatePreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      if (req.body.notifications) {
        user.preferences.notifications = { ...user.preferences.notifications, ...req.body.notifications };
      }
      if (req.body.privacy) {
        user.preferences.privacy = { ...user.preferences.privacy, ...req.body.privacy };
      }

      const updatedUser = await user.save();
      const userToReturn = await User.findById(updatedUser._id).select('-password').populate('assignedCoach', 'fullName email phone profileImage role');
      res.json(userToReturn);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user password
// @route   PUT /api/users/password
// @access  Private
export const updateUserPassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('+password');

    if (user) {
      const { oldPassword, newPassword } = req.body;
      
      if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: 'Please provide both old and new passwords' });
      }

      // Ensure robust comparison by explicitly checking the hash
      const isMatch = await bcrypt.compare(oldPassword.trim(), user.password);
      
      if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect current password' });
      }

      user.password = newPassword.trim();
      await user.save();
      
      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
