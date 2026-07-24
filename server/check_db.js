import mongoose from 'mongoose';
import User from './models/User.js';
import Notification from './models/Notification.js';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fitness').then(async () => {
  const coaches = await User.find({role: 'Coach'});
  console.log('COACHES:', coaches.map(c => ({id: c._id, name: c.fullName, spec: c.specialization, app: c.approvalStatus, ver: c.isVerified, act: c.isActive})));
  const clients = await User.find({role: 'Client'});
  console.log('CLIENTS:', clients.map(c => ({id: c._id, name: c.fullName, goal: c.fitnessGoal})));
  const notifs = await Notification.find({});
  console.log('NOTIFS:', notifs);
  process.exit(0);
});
