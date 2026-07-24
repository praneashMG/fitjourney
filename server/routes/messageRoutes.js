import express from 'express';
const router = express.Router();
import { protect } from '../middleware/authMiddleware.js';
import { sendMessage, getMessages, markMessagesRead } from '../controllers/messageController.js';

router.route('/').post(protect, sendMessage);
router.route('/:userId').get(protect, getMessages);
router.route('/mark-read/:userId').put(protect, markMessagesRead);

export default router;
