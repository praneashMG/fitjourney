import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import ClientWorkoutPlan from './models/ClientWorkoutPlan.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fitness')
  .then(async () => {
    console.log('Connected to DB');
    
    // Find all active plans
    const plans = await ClientWorkoutPlan.find({ isActive: true });
    
    for (let plan of plans) {
      if (plan.progress > 0) {
        const user = await User.findById(plan.clientId);
        if (user) {
          if (!user.progressStats) user.progressStats = {};
          
          user.progressStats.currentStreak = plan.progress;
          if (plan.progress > (user.progressStats.bestStreak || 0)) {
            user.progressStats.bestStreak = plan.progress;
          }
          user.progressStats.totalWorkouts = plan.progress;
          
          await user.save();
          console.log(`Updated user ${user.email} to streak ${plan.progress}`);
        }
      }
    }
    
    console.log('Sync complete');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
