import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import User from './models/User.js';
import WeightLog from './models/WeightLog.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fitness')
  .then(async () => {
    console.log('Connected to DB to reset weight logs');

    const clients = await User.find({ role: 'Client' });
    
    // Clear ALL existing weight logs to remove the dummy data
    await WeightLog.deleteMany({});
    console.log('Deleted all existing weight logs.');

    let count = 0;
    // Re-create exactly one log per client using their profile's currentWeight and createdAt date
    for (let client of clients) {
      if (client.currentWeight) {
        await WeightLog.create({
          userId: client._id,
          weight: client.currentWeight,
          date: client.createdAt || new Date()
        });
        count++;
      }
    }

    console.log(`Successfully recreated ${count} initial weight logs from user profiles!`);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
