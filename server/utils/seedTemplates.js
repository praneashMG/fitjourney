import mongoose from 'mongoose';
import WorkoutTemplate from '../models/WorkoutTemplate.js';
import DietTemplate from '../models/DietTemplate.js';
import dotenv from 'dotenv';
dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    await WorkoutTemplate.deleteMany({});
    await DietTemplate.deleteMany({});

    await WorkoutTemplate.create({
      name: 'Abs & Core Shred',
      goal: 'Fat Loss',
      bmiRange: { min: 10, max: 50 },
      experienceLevel: 'Beginner',
      workoutLocation: 'Home',
      exercises: {
        Monday: [
          { name: 'Crunches', sets: 3, reps: '15' },
          { name: 'Plank', sets: 3, reps: '60 seconds' },
          { name: 'Russian Twists', sets: 3, reps: '20' }
        ],
        Tuesday: [],
        Wednesday: [
          { name: 'Leg Raises', sets: 3, reps: '12' },
          { name: 'Bicycle Crunches', sets: 3, reps: '20' }
        ]
      }
    });

    await DietTemplate.create({
      name: 'High Protein Fat Loss',
      goal: 'Fat Loss',
      foodPreference: 'Non Vegetarian',
      caloriesRange: { min: 1500, max: 3000 },
      meals: {
        Breakfast: [{ name: 'Eggs', quantity: '3 whole' }, { name: 'Oats', quantity: '50g' }],
        Lunch: [{ name: 'Chicken Breast', quantity: '200g' }, { name: 'Broccoli', quantity: '1 cup' }],
        Dinner: [{ name: 'Salmon', quantity: '150g' }, { name: 'Sweet Potato', quantity: '1 medium' }]
      }
    });

    console.log('Templates seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
