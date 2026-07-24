const fs = require('fs');
const path = require('path');

// 1. Client Model
fs.writeFileSync('models/Client.js', `import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema(
  {
    coachId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    gender: { type: String },
    dateOfBirth: { type: Date },
    height: { type: Number, required: true }, // in cm
    weight: { type: Number, required: true }, // in kg
    goal: { 
      type: String, 
      enum: ['Lose Weight', 'Gain Weight', 'Build Muscle', 'Maintain Weight', 'General Fitness'],
      required: true
    },
    activityLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner'
    },
    medicalConditions: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    profileImage: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Completed'],
      default: 'Active'
    },
    joinedDate: { type: Date, default: Date.now },
    notes: { type: String }
  },
  { timestamps: true }
);

const Client = mongoose.model('Client', clientSchema);
export default Client;
`);

// 2. Client Controller
fs.writeFileSync('controllers/clientController.js', `import Client from '../models/Client.js';

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

    const clientExists = await Client.findOne({ email });
    if (clientExists) {
      return res.status(400).json({ success: false, message: 'Client with this email already exists' });
    }

    const client = await Client.create({
      ...req.body,
      coachId: req.user._id,
    });

    res.status(201).json({ success: true, data: client });
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

    // Build query
    let query = { coachId: req.user._id };

    // Search by keyword (name, email, phone)
    if (req.query.keyword) {
      const keyword = req.query.keyword;
      query.$or = [
        { fullName: { $regex: keyword, $options: 'i' } },
        { email: { $regex: keyword, $options: 'i' } },
        { phone: { $regex: keyword, $options: 'i' } },
      ];
    }

    // Filter by status or goal if provided
    if (req.query.status) query.status = req.query.status;
    if (req.query.goal) query.goal = req.query.goal;
    if (req.query.activityLevel) query.activityLevel = req.query.activityLevel;

    const total = await Client.countDocuments(query);
    const clients = await Client.find(query).skip(startIndex).limit(limit).sort({ createdAt: -1 });

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
    const client = await Client.findOne({ _id: req.params.id, coachId: req.user._id });
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    res.json({ success: true, data: client });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Private
export const updateClient = async (req, res) => {
  try {
    let client = await Client.findOne({ _id: req.params.id, coachId: req.user._id });
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    client = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

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
    const client = await Client.findOne({ _id: req.params.id, coachId: req.user._id });
    if (!client) {
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
`);

// 3. Client Routes
fs.writeFileSync('routes/clientRoutes.js', `import express from 'express';
import { 
  addClient, 
  getClients, 
  getSingleClient, 
  updateClient, 
  deleteClient, 
  changeStatus 
} from '../controllers/clientController.js';
import { protect, authorize } from '../middleware/authMiddleware.js'; // Ensure authorize exists or just use protect

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

router.route('/')
  .get(getClients)
  .post(addClient);

router.route('/:id')
  .get(getSingleClient)
  .put(updateClient)
  .delete(deleteClient);

router.patch('/:id/status', changeStatus);

export default router;
`);

console.log('Day 3 backend files generated successfully!');
