import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

// Fix for local network DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

import User from './models/User.js';
import WorkoutTemplate from './models/WorkoutTemplate.js';
import ClientWorkoutPlan from './models/ClientWorkoutPlan.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fitness')
  .then(async () => {
    console.log('Connected to DB');
    
    const clients = await User.find({ role: 'Client' });
    
    for (let client of clients) {
      // Find their current plan
      const plan = await ClientWorkoutPlan.findOne({ clientId: client._id, isActive: true });
      if (plan) {
        // Find a matching template (we'll just use General Fitness if goal is unknown)
        let goal = client.fitnessGoal || 'General Fitness';
        let weight = client.currentWeight || 75;
        
        // Find template that matches goal and weight range
        const template = await WorkoutTemplate.findOne({ 
          goal: goal,
          'weightRange.min': { $lte: weight },
          'weightRange.max': { $gt: weight }
        });
        
        if (template) {
          plan.exercises = template.exercises;
          plan.templateId = template._id;
          await plan.save();
          console.log(`Updated 1hr workout plan for client ${client.email}`);
        } else {
          // Fallback to first available
          const fb = await WorkoutTemplate.findOne();
          if (fb) {
            plan.exercises = fb.exercises;
            plan.templateId = fb._id;
            await plan.save();
            console.log(`Updated (fallback) 1hr workout plan for client ${client.email}`);
          }
        }
      }
    }

    console.log('Successfully updated all existing clients to the new 1-hour workouts!');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
