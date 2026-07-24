import Message from '../models/Message.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

/**
 * Send a new message
 * @route POST /api/messages
 * @access Private
 */
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId, text } = req.body;

    if (!receiverId || !text) {
      return res.status(400).json({ success: false, message: 'Receiver ID and text are required' });
    }

    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      text
    });
    
    // Create notification for receiver
    const sender = await User.findById(senderId);
    if (sender) {
      await Notification.create({
        recipient: receiverId,
        title: 'New Message',
        message: `You have a new message from ${sender.fullName}`,
        type: 'GENERAL'
      });
    }

    return res.status(201).json({ success: true, data: message });
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Get message history with a specific user
 * @route GET /api/messages/:userId
 * @access Private
 */
export const getMessages = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId }
      ]
    }).sort({ createdAt: 1 });

    return res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Mark messages from a specific user as read
 * @route PUT /api/messages/mark-read/:userId
 * @access Private
 */
export const markMessagesRead = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const senderId = req.params.userId;

    await Message.updateMany(
      { sender: senderId, receiver: currentUserId, isRead: false },
      { isRead: true }
    );

    return res.status(200).json({ success: true, message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
