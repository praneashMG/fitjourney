import express from 'express';
import { submitAssessment } from '../controllers/assessmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, submitAssessment);

export default router;
