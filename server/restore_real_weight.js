import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import User from './models/User.js';
import WeightLog from './models/WeightLog.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fitness')
  .then(async () => {
    const user = await User.findOne({ fullName: 'Praneash MG' });
    
    // Restore the real registered weight (91.9 from the screenshot)
    user.currentWeight = 91.9;
    await user.save();
    console.log('Restored profile currentWeight to 91.9');
    
    // Clear and restore the weight log
    await WeightLog.deleteMany({ userId: user._id });
    await WeightLog.create({
      userId: user._id,
      weight: 91.9,
      date: user.createdAt || new Date()
    });
    console.log('Fixed the weight log for Praneash to 91.9');
    
    process.exit(0);
  });
