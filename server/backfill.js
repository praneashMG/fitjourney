import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ClientAssessment from './models/ClientAssessment.js';
import ClientWorkoutPlan from './models/ClientWorkoutPlan.js';
import WorkoutTemplate from './models/WorkoutTemplate.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB().then(async () => {
    const assessments = await ClientAssessment.find();
    let createdCount = 0;
    
    for (const assessment of assessments) {
        const existingPlan = await ClientWorkoutPlan.findOne({ clientId: assessment.userId });
        if (!existingPlan) {
            const template = await WorkoutTemplate.findOne({
                goal: assessment.goal,
                'weightRange.min': { $lte: assessment.currentWeight },
                'weightRange.max': { $gt: assessment.currentWeight }
            });
            
            if (template) {
                await ClientWorkoutPlan.create({
                    clientId: assessment.userId,
                    templateId: template._id,
                    exercises: template.exercises
                });
                createdCount++;
                console.log('Created plan for', assessment.fullName);
            } else {
                console.log('No template found for', assessment.fullName, assessment.goal, assessment.currentWeight);
            }
        }
    }
    
    console.log('Backfill complete. Created:', createdCount);
    process.exit();
}).catch(err => {
    console.error(err);
    process.exit(1);
});
