import express from 'express';
import { 
  getWorkoutTemplates, 
  getDietTemplates,
  createWorkoutTemplate,
  updateWorkoutTemplate,
  deleteWorkoutTemplate,
  createDietTemplate,
  updateDietTemplate,
  deleteDietTemplate
} from '../controllers/templateController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/workouts')
  .get(protect, getWorkoutTemplates)
  .post(protect, createWorkoutTemplate);

router.route('/workouts/:id')
  .put(protect, updateWorkoutTemplate)
  .delete(protect, deleteWorkoutTemplate);

router.route('/diets')
  .get(protect, getDietTemplates)
  .post(protect, createDietTemplate);

router.route('/diets/:id')
  .put(protect, updateDietTemplate)
  .delete(protect, deleteDietTemplate);

export default router;
