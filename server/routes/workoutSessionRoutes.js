import express from 'express';
import { startWorkout, getActiveWorkout, completeWorkout, toggleTimer } from '../controllers/workoutSessionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/start', startWorkout);
router.get('/active', getActiveWorkout);
router.put('/complete', completeWorkout);
router.put('/toggle-timer', toggleTimer);

export default router;
