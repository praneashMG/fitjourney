const fs = require('fs');

// 1. seedAdmin.js
if (!fs.existsSync('utils')) fs.mkdirSync('utils', { recursive: true });
fs.writeFileSync('utils/seedAdmin.js', `import User from '../models/User.js';

const seedAdmin = async () => {
  try {
    const adminEmail = 'adminfit@gmail.com';
    const adminExists = await User.findOne({ email: adminEmail });
    
    if (!adminExists) {
      const adminUser = new User({
        fullName: 'System Admin',
        email: adminEmail,
        password: 'fitness@1234**', // will be hashed by pre-save hook
        phone: '0000000000',
        role: 'Admin',
        isVerified: true,
        isActive: true
      });
      await adminUser.save();
      console.log('✅ Default Admin account seeded successfully!');
    }
  } catch (error) {
    console.error('❌ Error seeding admin account:', error.message);
  }
};

export default seedAdmin;
`);

// 2. roleMiddleware.js (authorize)
// We already have roleMiddleware from Day 2 in implementation, but apparently it was missing or named differently. Let's make sure it's fully implemented.
if (!fs.existsSync('middleware')) fs.mkdirSync('middleware', { recursive: true });
fs.writeFileSync('middleware/roleMiddleware.js', `export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: \`User role \${req.user?.role} is not authorized to access this route\` });
    }
    next();
  };
};
`);

// 3. adminController.js
fs.writeFileSync('controllers/adminController.js', `import User from '../models/User.js';
import Client from '../models/Client.js';

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const totalCoaches = await User.countDocuments({ role: 'Coach' });
    const totalClients = await Client.countDocuments();
    // Dummy values for revenue and sessions for now
    const totalRevenue = 280000; 
    const todaysSessions = 26;

    res.json({
      success: true,
      data: {
        totalCoaches,
        totalClients,
        totalRevenue,
        todaysSessions
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
    const { isActive, isVerified } = req.body;
    const coach = await User.findById(req.params.id);

    if (!coach || coach.role !== 'Coach') {
      return res.status(404).json({ success: false, message: 'Coach not found' });
    }

    if (isActive !== undefined) coach.isActive = isActive;
    if (isVerified !== undefined) coach.isVerified = isVerified;

    await coach.save();

    res.json({ success: true, data: coach, message: 'Coach status updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
`);

// 4. adminRoutes.js
fs.writeFileSync('routes/adminRoutes.js', `import express from 'express';
import { getDashboardStats, getCoaches, updateCoachStatus } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('Admin'));

router.get('/stats', getDashboardStats);
router.get('/coaches', getCoaches);
router.patch('/coaches/:id/status', updateCoachStatus);

export default router;
`);

console.log('Admin backend files generated!');
