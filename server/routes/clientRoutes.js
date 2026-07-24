import express from 'express';
import { getClients, addClient, getSingleClient, updateClient, deleteClient, getClientPlans, updateClientWorkoutPlan, updateClientDietPlan } from '../controllers/clientController.js';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import Message from '../models/Message.js';

const router = express.Router();

router.get('/my-clients', protect, async (req, res) => {
  try {
    const clients = await User.find({ assignedCoach: req.user.id, role: 'Client' })
      .select('fullName email profileImage fitnessGoal');
      
    const clientsWithMessages = await Promise.all(clients.map(async (client) => {
      const latestMessage = await Message.findOne({
        $or: [
          { sender: req.user.id, receiver: client._id },
          { sender: client._id, receiver: req.user.id }
        ]
      }).sort({ createdAt: -1 });
      
      const unreadCount = await Message.countDocuments({
        sender: client._id,
        receiver: req.user.id,
        isRead: false
      });
      
      return {
        ...client.toObject(),
        latestMessageTime: latestMessage ? latestMessage.createdAt : new Date(0),
        latestMessageText: latestMessage ? latestMessage.text : '',
        unreadCount
      };
    }));
    
    clientsWithMessages.sort((a, b) => b.latestMessageTime - a.latestMessageTime);

    res.json({ success: true, data: clientsWithMessages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.route('/').get(protect, getClients).post(protect, addClient);
router.route('/:id').get(protect, getSingleClient).put(protect, updateClient).delete(protect, deleteClient);
router.route('/:id/plans').get(protect, getClientPlans);
router.route('/:id/workout').put(protect, updateClientWorkoutPlan);
router.route('/:id/diet').put(protect, updateClientDietPlan);

export default router;
