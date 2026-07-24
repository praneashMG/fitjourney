import connectDB from './config/db.js';
import User from './models/User.js';
import dotenv from 'dotenv';
dotenv.config();

connectDB().then(async () => {
  const u = await User.findOne({email: 'adminfit@gmail.com'});
  if (u) {
    console.log('OLD ROLE:', u.role);
    u.role = 'Admin';
    await u.save();
    console.log('NEW ROLE:', u.role);
  } else {
    console.log('User not found!');
  }
  process.exit(0);
});
