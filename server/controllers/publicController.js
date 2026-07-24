import User from '../models/User.js';
import ContactMessage from '../models/ContactMessage.js';

export const getPublicCoaches = async (req, res) => {
  try {
    const filter = { role: 'Coach', isActive: true, approvalStatus: 'Approved' };
    
    // Optional query parameter filtering
    if (req.query.specialization) {
      filter.specialization = { $regex: req.query.specialization, $options: 'i' };
    }

    const coaches = await User.find(filter)
      .select('fullName profileImage specialization coachStats experienceLevel')
      .sort({ 'coachStats.rating': -1 })
      .limit(50);
      
    res.status(200).json(coaches);
  } catch (error) {
    console.error('Error fetching public coaches:', error);
    res.status(500).json({ message: 'Server error fetching coaches' });
  }
};

export const submitContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const newMessage = new ContactMessage({ name, email, subject, message });
    await newMessage.save();

    res.status(201).json({ message: 'Your message has been sent successfully!' });
  } catch (error) {
    console.error('Error submitting contact message:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
};
