import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const admin = await User.findOne({ email: 'praneashp@gmail.com' });
  if (admin) {
    console.log('User found:', admin.email);
    console.log('Password hash present?:', !!admin.password);
    console.log('Password is:', admin.password);
  } else {
    console.log('User not found');
  }
  process.exit();
});
