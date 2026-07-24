import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import User from './models/User.js';
import Message from './models/Message.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fitness')
  .then(async () => {
    const client = await User.findOne({ fullName: 'Praneash MG' }).populate('assignedCoach');
    if (client && client.assignedCoach) {
      await Message.create({
        sender: client.assignedCoach._id,
        receiver: client._id,
        text: 'Hey Praneash! I see you just updated your weight. Great job staying consistent, let me know if you have any questions about your new workout block.'
      });
      console.log('Test message seeded from Coach to Client');
    }
    process.exit(0);
  });
