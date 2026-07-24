import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import User from './models/User.js';
import WeightLog from './models/WeightLog.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fitness')
  .then(async () => {
    console.log('Connected to DB to seed weight logs');

    const clients = await User.find({ role: 'Client' });
    
    // Clear existing logs
    await WeightLog.deleteMany({});

    for (let client of clients) {
      const baseWeight = client.currentWeight || 80; // default 80
      // generate last 7 days of data
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        // simulate a slight downward trend
        const weight = baseWeight + (i * 0.15) + (Math.random() * 0.2 - 0.1); 
        await WeightLog.create({
          userId: client._id,
          weight: Number(weight.toFixed(1)),
          date
        });
      }
      console.log(`Seeded weight history for ${client.fullName}`);
    }

    console.log('Successfully seeded weight logs!');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
