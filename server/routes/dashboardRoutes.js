import express from 'express';
import { getClientDashboard, logWeight, getWeightHistory, getCoachDashboard } from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/client', protect, getClientDashboard);
router.get('/coach', protect, getCoachDashboard);
router.post('/weight', protect, logWeight);
router.get('/weight-history', protect, getWeightHistory);

export default router;
