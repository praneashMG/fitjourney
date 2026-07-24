import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import ClientWorkoutPlan from './models/ClientWorkoutPlan.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fitness')
  .then(async () => {
    console.log('Connected to DB');
    
    // Set streak to 2 for all users since they are on day 3
    const users = await User.find({ role: 'Client' });
    
    for (let user of users) {
      if (!user.progressStats) user.progressStats = {};
      
      user.progressStats.currentStreak = 2;
      if (2 > (user.progressStats.bestStreak || 0)) {
        user.progressStats.bestStreak = 2;
      }
      user.progressStats.totalWorkouts = 2;
      
      await user.save();
      console.log(`Updated user ${user.email} streak to 2`);
    }
    
    // Also update all active plans to have progress = 2
    const plans = await ClientWorkoutPlan.find({ isActive: true });
    for (let plan of plans) {
      plan.progress = 2;
      await plan.save();
      console.log(`Updated plan progress for ${plan.clientId} to 2`);
    }
    
    console.log('Sync complete! All users now have a 2-day streak (entering Day 3).');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
