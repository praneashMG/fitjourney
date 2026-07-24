import express from 'express';
import { updatePersonalInfo, updateFitnessInfo, updatePreferences, updateUserPassword } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/profile/personal', protect, updatePersonalInfo);
router.put('/profile/fitness', protect, updateFitnessInfo);
router.put('/profile/preferences', protect, updatePreferences);
router.put('/password', protect, updateUserPassword);

export default router;
