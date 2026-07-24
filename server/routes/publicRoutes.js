import express from 'express';
import { getPublicCoaches, submitContactMessage } from '../controllers/publicController.js';

const router = express.Router();

router.get('/coaches', getPublicCoaches);
router.post('/contact', submitContactMessage);

export default router;
