import connectDB from './config/db.js';
import seedAdmin from './utils/seedAdmin.js';
import dotenv from 'dotenv';
dotenv.config();

connectDB().then(async () => {
  await seedAdmin();
  console.log('Done!');
  process.exit(0);
});
