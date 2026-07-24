import Client from '../models/Client.js';
import User from '../models/User.js';
import ClientAssessment from '../models/ClientAssessment.js';
import ClientWorkoutPlan from '../models/ClientWorkoutPlan.js';
import ClientDietPlan from '../models/ClientDietPlan.js';

// @desc    Add a new client
// @route   POST /api/clients
// @access  Private
export const addClient = async (req, res) => {
  try {
    const { fullName, email, phone, goal, height, weight } = req.body;
    
    // Check required fields
    if (!fullName || !email || !phone || !goal || !height || !weight) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const clientExists = await User.findOne({ email });
    if (clientExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const user = await User.create({
      fullName,
      email,
      password: 'Password123!', // Default password for coach-added clients
      phone,
      role: 'Client',
      fitnessGoal: goal,
      height,
      currentWeight: weight,
      assignedCoach: req.user._id,
      isVerified: true,
      approvalStatus: 'Approved'
    });

    const client = await Client.create({
      ...req.body,
      coachId: req.user._id,
      userId: user._id
    });

    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all clients (with pagination, search, filter)
// @route   GET /api/clients
// @access  Private
export const getClients = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Build query for registered clients assigned to this coach (Admins see all)
    let query = { role: 'Client' };
    if (req.user.role !== 'Admin') {
      query.assignedCoach = req.user._id;
    }

    // Search by keyword (name, email, phone)
    if (req.query.keyword) {
      const keyword = req.query.keyword;
      query.$or = [
        { fullName: { $regex: keyword, $options: 'i' } },
        { email: { $regex: keyword, $options: 'i' } },
        { phone: { $regex: keyword, $options: 'i' } },
      ];
    }

    if (req.query.goal) query.fitnessGoal = req.query.goal;

    const total = await User.countDocuments(query);
    const clients = await User.find(query).select('-password').skip(startIndex).limit(limit).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: clients.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: clients,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single client
// @route   GET /api/clients/:id
// @access  Private
export const getSingleClient = async (req, res) => {
  try {
    let query = { _id: req.params.id };
    if (req.user.role !== 'Admin') {
      query.assignedCoach = req.user._id;
    }
    const client = await User.findOne(query).select('-password');
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    const assessment = await ClientAssessment.findOne({ userId: client._id });

    res.json({ success: true, data: { ...client.toObject(), assessment } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Private
export const updateClient = async (req, res) => {
  try {
    let query = { _id: req.params.id };
    if (req.user.role !== 'Admin') {
      // In early code this queried Client model. But `fetchClients` returns `User` models.
      // And `getSingleClient` queries `User`. We should update `User`.
      query.assignedCoach = req.user._id;
    }

    let client = await User.findOne(query);
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    // Only allow updating specific fields
    const { fullName, phone, fitnessGoal, isActive } = req.body;
    if (fullName) client.fullName = fullName;
    if (phone) client.phone = phone;
    if (fitnessGoal) client.fitnessGoal = fitnessGoal;
    if (isActive !== undefined) client.isActive = isActive;

    await client.save();

    res.json({ success: true, data: client });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete client
// @route   DELETE /api/clients/:id
// @access  Private
export const deleteClient = async (req, res) => {
  try {
    let query = { _id: req.params.id };
    if (req.user.role !== 'Admin') {
      query.coachId = req.user._id;
    }
    const client = await Client.findOne(query);
    if (!client) {
      // It might be a User record we want to delete from the User model instead of Client model?
      // Since `fetchClients` returns Users... wait.
      const userClient = await User.findById(req.params.id);
      if (userClient) {
        await User.findByIdAndDelete(req.params.id);
        return res.json({ success: true, message: 'Client User removed' });
      }
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    
    await client.deleteOne();
    res.json({ success: true, message: 'Client removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Change client status
// @route   PATCH /api/clients/:id/status
// @access  Private
export const changeStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Active', 'Inactive', 'Completed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const client = await Client.findOne({ _id: req.params.id, coachId: req.user._id });
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    client.status = status;
    await client.save();
    res.json({ success: true, data: client });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get client's workout and diet plans
// @route   GET /api/clients/:id/plans
// @access  Private
export const getClientPlans = async (req, res) => {
  try {
    const workoutPlan = await ClientWorkoutPlan.findOne({ clientId: req.params.id, coachId: req.user._id });
    const dietPlan = await ClientDietPlan.findOne({ clientId: req.params.id, coachId: req.user._id });
    
    res.json({ success: true, data: { workoutPlan, dietPlan } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update or Create 7-Day Workout Plan
// @route   PUT /api/clients/:id/workout
// @access  Private
export const updateClientWorkoutPlan = async (req, res) => {
  try {
    const { exercises, coachNotes } = req.body;
    let plan = await ClientWorkoutPlan.findOne({ clientId: req.params.id, coachId: req.user._id });
    
    if (plan) {
      plan.exercises = exercises;
      if (coachNotes !== undefined) plan.coachNotes = coachNotes;
      await plan.save();
    } else {
      plan = await ClientWorkoutPlan.create({
        clientId: req.params.id,
        coachId: req.user._id,
        exercises,
        coachNotes
      });
    }
    
    res.json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update or Create 7-Day Diet Plan
// @route   PUT /api/clients/:id/diet
// @access  Private
export const updateClientDietPlan = async (req, res) => {
  try {
    const { meals, coachNotes } = req.body;
    let plan = await ClientDietPlan.findOne({ clientId: req.params.id, coachId: req.user._id });
    
    if (plan) {
      plan.meals = meals;
      if (coachNotes !== undefined) plan.coachNotes = coachNotes;
      await plan.save();
    } else {
      plan = await ClientDietPlan.create({
        clientId: req.params.id,
        coachId: req.user._id,
        meals,
        coachNotes
      });
    }
    
    res.json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
