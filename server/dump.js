import mongoose from 'mongoose';
import User from './models/User.js';
import Notification from './models/Notification.js';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/db.js';

connectDB().then(async () => {
  const coaches = await User.find({role: 'Coach'});
  const clients = await User.find({role: 'Client'});
  const notifs = await Notification.find({});
  const output = {
    coaches: coaches.map(c => ({ id: c._id, name: c.fullName, spec: c.specialization, app: c.approvalStatus, isActive: c.isActive, isVerified: c.isVerified })),
    clients: clients.map(c => ({ id: c._id, name: c.fullName, goal: c.fitnessGoal })),
    notifs
  };
  fs.writeFileSync('db_dump.json', JSON.stringify(output, null, 2));
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
