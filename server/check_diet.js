import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ClientDietPlan from './models/ClientDietPlan.js';
import User from './models/User.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fitness')
  .then(async () => {
    console.log('Connected to DB');
    const plans = await ClientDietPlan.find({});
    console.log(`Found ${plans.length} diet plans.`);
    if (plans.length > 0) {
      console.log('Sample plan:');
      console.log(JSON.stringify(plans[0], null, 2));
    }
    
    const users = await User.find({});
    console.log(`Found ${users.length} users.`);
    
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
