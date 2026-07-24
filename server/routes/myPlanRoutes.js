import express from 'express';
import { getMyWorkoutPlan, toggleExerciseCompletion, getMyDietPlan, toggleDietCompletion } from '../controllers/myPlanController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/workout').get(protect, getMyWorkoutPlan);
router.route('/workout/toggle').put(protect, toggleExerciseCompletion);

router.route('/diet').get(protect, getMyDietPlan);
router.route('/diet/toggle').put(protect, toggleDietCompletion);

export default router;
