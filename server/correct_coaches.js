import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);

import User from './models/User.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fitness')
  .then(async () => {
    console.log('Connected to DB to correct goal-based coach assignments');
    
    // Find our specific coaches
    const asswinth = await User.findOne({ fullName: 'Asswinth', role: 'Coach' });
    const kishore = await User.findOne({ fullName: 'kishore', role: 'Coach' });
    const abcd = await User.findOne({ fullName: 'abcd', role: 'Coach' });
    const elena = await User.findOne({ fullName: 'Coach Elena', role: 'Coach' });
    const david = await User.findOne({ fullName: 'Coach David', role: 'Coach' });

    const coachesMap = {};
    
    // Map goals to the user's preferred original coaches
    if (asswinth) {
      coachesMap['Fat Loss'] = asswinth._id;
      coachesMap['Weight Loss'] = asswinth._id;
    }
    
    if (kishore) {
      coachesMap['Strength Training'] = kishore._id;
      coachesMap['Bodybuilding'] = kishore._id;
      coachesMap['Muscle Gain'] = kishore._id;
    }
    
    if (abcd) {
      coachesMap['Yoga'] = abcd._id;
      coachesMap['General Fitness'] = abcd._id;
      coachesMap['Maintenance'] = abcd._id;
    }
    
    if (elena) {
      coachesMap['Crossfit'] = elena._id;
      coachesMap['Athletic Performance'] = elena._id;
    }

    // Default fallback
    const defaultCoachId = asswinth ? asswinth._id : (david ? david._id : null);

    // Reassign all clients
    const clients = await User.find({ role: 'Client' });
    
    let count = 0;
    for (let client of clients) {
      const targetCoachId = coachesMap[client.fitnessGoal] || defaultCoachId;
      if (targetCoachId && (!client.assignedCoach || client.assignedCoach.toString() !== targetCoachId.toString())) {
        client.assignedCoach = targetCoachId;
        client.coachAssignedDate = Date.now();
        await client.save();
        count++;
        console.log(`Reassigned ${client.fullName} (Goal: ${client.fitnessGoal}) to coach ID: ${targetCoachId}`);
      }
    }

    console.log(`Successfully corrected assignments for ${count} clients!`);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
