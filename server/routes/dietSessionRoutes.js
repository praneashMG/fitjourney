import express from 'express';
import { startDiet, getActiveDiet, completeDiet } from '../controllers/dietSessionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/start', startDiet);
router.get('/active', getActiveDiet);
router.put('/complete', completeDiet);

export default router;
