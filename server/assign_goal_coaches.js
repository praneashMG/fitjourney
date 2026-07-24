import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);

import User from './models/User.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fitness')
  .then(async () => {
    console.log('Connected to DB for goal-based coach assignment');
    
    const coachesData = [
      {
        fullName: 'Coach Sarah',
        email: 'sarah.coach@gym.com',
        specialization: 'Wellness & Mobility Coach',
        goals: ['Yoga', 'General Fitness', 'Maintenance'],
        profileImage: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=150&q=80'
      },
      {
        fullName: 'Coach Marcus',
        email: 'marcus.coach@gym.com',
        specialization: 'Weight Management Expert',
        goals: ['Weight Loss', 'Fat Loss'],
        profileImage: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&q=80'
      },
      {
        fullName: 'Coach David',
        email: 'david.coach@gym.com',
        specialization: 'Strength & Hypertrophy Coach',
        goals: ['Bodybuilding', 'Strength Training', 'Muscle Gain'],
        profileImage: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=150&q=80'
      },
      {
        fullName: 'Coach Elena',
        email: 'elena.coach@gym.com',
        specialization: 'Performance & Crossfit Coach',
        goals: ['Crossfit', 'Athletic Performance'],
        profileImage: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=150&q=80'
      }
    ];

    // Create or find coaches
    const coaches = {};
    for (const data of coachesData) {
      let coach = await User.findOne({ email: data.email });
      if (!coach) {
        coach = await User.create({
          fullName: data.fullName,
          email: data.email,
          password: 'password123',
          phone: '+1234567890',
          role: 'Coach',
          specialization: data.specialization,
          isVerified: true,
          approvalStatus: 'Approved',
          profileImage: data.profileImage
        });
        console.log(`Created new coach: ${data.fullName}`);
      } else {
        console.log(`Found existing coach: ${data.fullName}`);
      }
      
      // Map goals to this coach's ID
      data.goals.forEach(goal => {
        coaches[goal] = coach._id;
      });
      // Fallback
      coaches['default'] = coach._id;
    }

    // Find all clients and assign the coach based on their goal
    const clients = await User.find({ role: 'Client' });
    
    let count = 0;
    for (let client of clients) {
      const targetCoachId = coaches[client.fitnessGoal] || coaches['default'];
      if (!client.assignedCoach || client.assignedCoach.toString() !== targetCoachId.toString()) {
        client.assignedCoach = targetCoachId;
        client.coachAssignedDate = Date.now();
        await client.save();
        count++;
        console.log(`Assigned ${client.fullName} (Goal: ${client.fitnessGoal}) to coach ID: ${targetCoachId}`);
      }
    }

    console.log(`Successfully updated ${count} clients with their new specialized coaches!`);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
