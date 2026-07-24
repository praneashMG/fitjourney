import express from 'express';
import { getDashboardStats, getCoaches, updateCoachStatus, updateUserAdmin, deleteUserAdmin, addUserAdmin } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('Admin'));

router.get('/stats', getDashboardStats);
router.get('/coaches', getCoaches);
router.patch('/coaches/:id/status', updateCoachStatus);
router.post('/users', addUserAdmin);
router.put('/users/:id', updateUserAdmin);
router.delete('/users/:id', deleteUserAdmin);

export default router;
