import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();

connectDB().then(async () => {
  const token = jwt.sign({ id: '6a4f4037f1679689e9b01737' }, process.env.JWT_SECRET || 'fallback_secret_key', { expiresIn: '30d' });
  console.log('TOKEN:', token);
  process.exit(0);
});
