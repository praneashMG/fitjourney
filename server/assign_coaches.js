import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);

import User from './models/User.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fitness')
  .then(async () => {
    console.log('Connected to DB');
    
    // Check if a coach exists, if not create one
    let coach = await User.findOne({ role: 'Coach' });
    
    if (!coach) {
      console.log('No coach found, creating Coach Sarah...');
      coach = await User.create({
        fullName: 'Coach Sarah',
        email: 'sarah.coach@gym.com',
        password: 'password123',
        phone: '+1234567890',
        role: 'Coach',
        specialization: 'Senior Fitness Coach',
        isVerified: true,
        approvalStatus: 'Approved',
        profileImage: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=150&q=80'
      });
    } else {
      console.log(`Using existing coach: ${coach.fullName}`);
      // Add a nice profile image if none exists
      if (!coach.profileImage) {
        coach.profileImage = 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=150&q=80';
        await coach.save();
      }
    }
    
    // Find all clients and assign the coach
    const clients = await User.find({ role: 'Client' });
    
    let count = 0;
    for (let client of clients) {
      if (!client.assignedCoach || client.assignedCoach.toString() !== coach._id.toString()) {
        client.assignedCoach = coach._id;
        client.coachAssignedDate = Date.now();
        await client.save();
        count++;
      }
    }

    console.log(`Successfully assigned ${coach.fullName} to ${count} clients!`);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
