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
    console.log('Current Weight in profile:', user.currentWeight);
    
    // Also delete the weight 40 and restore to 79.2 (or the correct one)
    if (user.currentWeight === 40) {
      user.currentWeight = 79.2; // Based on previous screenshot
      await user.save();
      console.log('Updated profile currentWeight to 79.2');
      
      // Update the weight log
      await WeightLog.deleteMany({ userId: user._id });
      await WeightLog.create({
        userId: user._id,
        weight: 79.2,
        date: user.createdAt || new Date()
      });
      console.log('Fixed the weight log for Praneash to 79.2');
    }
    
    process.exit(0);
  });
