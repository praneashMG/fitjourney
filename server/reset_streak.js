import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

// Fix for local network DNS failing to resolve mongodb+srv records
dns.setServers(['8.8.8.8', '8.8.4.4']);

import User from './models/User.js';
import ClientWorkoutPlan from './models/ClientWorkoutPlan.js';
import ClientDietPlan from './models/ClientDietPlan.js';
import WorkoutSession from './models/WorkoutSession.js';
import DietSession from './models/DietSession.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fitness')
  .then(async () => {
    console.log('Connected to DB');
    
    // Reset all users streak to 0
    const users = await User.find({ role: 'Client' });
    
    for (let user of users) {
      if (!user.progressStats) user.progressStats = {};
      
      user.progressStats.currentStreak = 0;
      user.progressStats.bestStreak = 0;
      user.progressStats.totalWorkouts = 0;
      user.progressStats.dietAdherenceRate = 0;
      user.progressStats.workoutCompletionRate = 0;
      
      await user.save();
      console.log(`Reset user ${user.email} stats to 0`);
    }
    
    // Reset all workout plans to have progress = 0
    const workoutPlans = await ClientWorkoutPlan.find();
    for (let plan of workoutPlans) {
      plan.progress = 0;
      // Also mark all exercises as incomplete
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      for (const day of days) {
        if (plan.exercises && plan.exercises[day]) {
          for (let ex of plan.exercises[day]) {
            ex.completed = false;
          }
        }
      }
      await plan.save();
      console.log(`Reset workout plan progress for ${plan.clientId} to 0`);
    }

    // Reset all diet plans to have progress = 0
    const dietPlans = await ClientDietPlan.find();
    for (let plan of dietPlans) {
      plan.progress = 0;
      await plan.save();
      console.log(`Reset diet plan progress for ${plan.clientId} to 0`);
    }

    // Clear active sessions so users start fresh
    await WorkoutSession.deleteMany({ status: 'active' });
    await DietSession.deleteMany({ status: 'active' });
    
    console.log('Reset complete! All users now start at Day 1 with 0 Streak.');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
