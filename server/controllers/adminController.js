import User from '../models/User.js';
import Client from '../models/Client.js';
import DietTemplate from '../models/DietTemplate.js';
import WorkoutTemplate from '../models/WorkoutTemplate.js';
import ClientDietPlan from '../models/ClientDietPlan.js';
import ClientWorkoutPlan from '../models/ClientWorkoutPlan.js';
import WeightLog from '../models/WeightLog.js';

// @desc    Add a new user (Coach/Client)
// @route   POST /api/admin/users
// @access  Private/Admin
export const addUserAdmin = async (req, res) => {
  try {
    const { 
      fullName, email, password, phone, role, specialization,
      fitnessGoal, currentWeight, height, targetWeight
    } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    if (role === 'Coach' && specialization) {
      const existingCoach = await User.findOne({ role: 'Coach', specialization });
      if (existingCoach) {
        return res.status(400).json({ success: false, message: `A coach with the specialization '${specialization}' already exists.` });
      }
    }

    const user = await User.create({
      fullName,
      email,
      password,
      phone,
      role,
      specialization: role === 'Coach' ? specialization : '',
      approvalStatus: 'Approved',
      isVerified: true,
      fitnessGoal,
      currentWeight,
      height,
      targetWeight
    });

    if (user) {
      res.status(201).json({ success: true, data: user, message: 'User created successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const totalCoaches = await User.countDocuments({ role: 'Coach' });
    const totalClients = await User.countDocuments({ role: 'Client' });
    // Dummy values for revenue and sessions for now
    const totalRevenue = 280000; 
    const todaysSessions = 26;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const registrationDataRaw = await User.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo }, role: { $in: ['Client', 'Coach'] } } },
      { 
        $group: { 
          _id: { 
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            role: "$role"
          }, 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { "_id.date": 1 } }
    ]);

    // Format data into { date: 'YYYY-MM-DD', Clients: X, Coaches: Y }
    const dateMap = {};
    registrationDataRaw.forEach(item => {
      const date = item._id.date;
      const role = item._id.role;
      if (!dateMap[date]) {
        dateMap[date] = { date, Clients: 0, Coaches: 0 };
      }
      if (role === 'Client') dateMap[date].Clients = item.count;
      if (role === 'Coach') dateMap[date].Coaches = item.count;
    });

    const registrationData = Object.values(dateMap).sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json({
      success: true,
      data: {
        totalCoaches,
        totalClients,
        totalRevenue,
        todaysSessions,
        registrationData
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all coaches
// @route   GET /api/admin/coaches
// @access  Private/Admin
export const getCoaches = async (req, res) => {
  try {
    const coaches = await User.find({ role: 'Coach' }).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: coaches });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update coach status (Approve/Suspend)
// @route   PATCH /api/admin/coaches/:id/status
// @access  Private/Admin
export const updateCoachStatus = async (req, res) => {
  try {
    const { approvalStatus, isActive, isVerified } = req.body;
    const coach = await User.findById(req.params.id);

    if (!coach || coach.role !== 'Coach') {
      return res.status(404).json({ success: false, message: 'Coach not found' });
    }

    if (approvalStatus) {
      coach.approvalStatus = approvalStatus;
      if (approvalStatus === 'Approved') {
        coach.isVerified = true;
        coach.isActive = true;
      } else if (approvalStatus === 'Declined') {
        coach.isVerified = false;
        coach.isActive = false;
      } else if (approvalStatus === 'Pending') {
        coach.isVerified = false;
      }
    }

    if (isActive !== undefined) coach.isActive = isActive;
    if (isVerified !== undefined) coach.isVerified = isVerified;

    await coach.save();

    res.json({ success: true, data: coach, message: 'Coach status updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update any user (Coach/Client)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
export const updateUserAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Only allow updating certain fields to prevent role escalation or password changes here
    const { fullName, phone, specialization, isActive, approvalStatus, isVerified } = req.body;

    if (specialization && user.role === 'Coach') {
      const existingCoach = await User.findOne({ role: 'Coach', specialization, _id: { $ne: user._id } });
      if (existingCoach) {
        return res.status(400).json({ success: false, message: `A coach with the specialization '${specialization}' already exists.` });
      }
    }

    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;
    if (specialization) user.specialization = specialization;
    if (isActive !== undefined) user.isActive = isActive;
    if (approvalStatus) user.approvalStatus = approvalStatus;
    if (isVerified !== undefined) user.isVerified = isVerified;

    await user.save();
    res.json({ success: true, data: user, message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete any user (Coach/Client)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUserAdmin = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Also delete any associated Client records if they are a client
    if (user.role === 'Client') {
      await Client.findOneAndDelete({ email: user.email }); // Assuming Client model links by email
    }

    res.json({ success: true, data: {}, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
