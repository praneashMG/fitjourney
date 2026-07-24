import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);

import User from './models/User.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fitness')
  .then(async () => {
    console.log('Connected to DB for updating coach stats');

    const coaches = await User.find({ role: 'Coach' });
    
    for (let i = 0; i < coaches.length; i++) {
      let coach = coaches[i];
      coach.coachStats = {
        rating: (4.5 + Math.random() * 0.5).toFixed(1), // Random rating between 4.5 and 5.0
        reviews: Math.floor(Math.random() * 200) + 50, // 50 to 250 reviews
        experienceYears: Math.floor(Math.random() * 10) + 2, // 2 to 11 years
        availability: i % 2 === 0 ? 'Available Today' : 'Available Tomorrow'
      };
      
      // Specifically for Coach Marcus from screenshot
      if (coach.fullName.includes('Marcus')) {
         coach.coachStats = {
           rating: 4.9,
           reviews: 120,
           experienceYears: 8,
           availability: 'Available Today'
         };
      }

      await coach.save();
      console.log(`Updated stats for ${coach.fullName}`);
    }

    console.log('Successfully updated all coach stats!');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
