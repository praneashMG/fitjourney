import mongoose from 'mongoose';
import dotenv from 'dotenv';
import WorkoutTemplate from './models/WorkoutTemplate.js';
import DietTemplate from './models/DietTemplate.js';
import connectDB from './config/db.js';
import dns from 'dns';

// Fix for local network DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const weightRanges = [
  { min: 50, max: 60, intensity: 'High', baseCals: 1600 },
  { min: 60, max: 70, intensity: 'High', baseCals: 1800 },
  { min: 70, max: 80, intensity: 'Medium-High', baseCals: 2000 },
  { min: 80, max: 90, intensity: 'Medium', baseCals: 2200 },
  { min: 90, max: 100, intensity: 'Medium', baseCals: 2400 },
  { min: 100, max: 110, intensity: 'Medium-Low', baseCals: 2500 },
  { min: 110, max: 120, intensity: 'Low', baseCals: 2600 },
  { min: 120, max: 130, intensity: 'Low', baseCals: 2700 },
  { min: 130, max: 140, intensity: 'Low', baseCals: 2800 },
  { min: 140, max: 150, intensity: 'Very Low', baseCals: 2900 }
];

const imgFood = {
  breakfast: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80',
  lunch: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
  dinner: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80',
  snack: 'https://images.unsplash.com/photo-1590159763121-7c870bfcc18f?w=800&q=80'
};

const getDietForGoal = (goal, range) => {
  const isHeavy = range.min >= 100;
  
  if (goal === 'Bodybuilding') {
    return {
      Breakfast: [{ name: 'Oats & Egg Whites', quantity: '1 cup oats, 6 whites', calories: isHeavy ? 600 : 400, image: imgFood.breakfast }],
      Lunch: [{ name: 'Chicken & Rice', quantity: isHeavy ? '250g chicken, 2 cups rice' : '150g chicken, 1 cup rice', calories: isHeavy ? 800 : 550, image: imgFood.lunch }],
      Dinner: [{ name: 'Steak & Sweet Potato', quantity: isHeavy ? '250g steak, large potato' : '150g steak, small potato', calories: isHeavy ? 850 : 600, image: imgFood.dinner }],
      Snacks: [{ name: 'Mass Gainer Shake', quantity: '2 scoops', calories: 400, image: imgFood.snack }]
    };
  } else if (goal === 'Fat Loss') {
    return {
      Breakfast: [{ name: 'Greek Yogurt & Berries', quantity: '1 cup yogurt', calories: 250, image: imgFood.breakfast }],
      Lunch: [{ name: 'Large Green Salad with Turkey', quantity: '200g turkey, mixed greens', calories: 350, image: imgFood.lunch }],
      Dinner: [{ name: 'Baked Cod & Asparagus', quantity: '150g cod', calories: 300, image: imgFood.dinner }],
      Snacks: [{ name: 'Almonds', quantity: '1 small handful', calories: 150, image: imgFood.snack }]
    };
  } else if (goal === 'Strength Training') {
    return {
      Breakfast: [{ name: 'Whole Eggs & Bacon', quantity: '4 eggs, 2 strips bacon', calories: 500, image: imgFood.breakfast }],
      Lunch: [{ name: 'Beef Burger (No Bun)', quantity: '2 patties, side salad', calories: 700, image: imgFood.lunch }],
      Dinner: [{ name: 'Pork Chops & Potatoes', quantity: '200g pork, mashed potatoes', calories: 750, image: imgFood.dinner }],
      Snacks: [{ name: 'Protein Shake & Banana', quantity: '1 scoop, 1 banana', calories: 250, image: imgFood.snack }]
    };
  } else if (goal === 'Yoga') {
    return {
      Breakfast: [{ name: 'Smoothie Bowl', quantity: 'Acai, fruits, chia seeds', calories: 350, image: imgFood.breakfast }],
      Lunch: [{ name: 'Quinoa & Roasted Veggies', quantity: '1 cup quinoa, mixed veg', calories: 450, image: imgFood.lunch }],
      Dinner: [{ name: 'Lentil Soup', quantity: '2 cups lentil soup', calories: 400, image: imgFood.dinner }],
      Snacks: [{ name: 'Hummus & Carrots', quantity: '2 tbsp hummus', calories: 200, image: imgFood.snack }]
    };
  } else if (goal === 'Crossfit') {
    return {
      Breakfast: [{ name: 'Avocado Toast & Poached Eggs', quantity: '2 slices, 2 eggs', calories: 500, image: imgFood.breakfast }],
      Lunch: [{ name: 'Grilled Chicken Wrap', quantity: '2 wraps, 200g chicken', calories: 650, image: imgFood.lunch }],
      Dinner: [{ name: 'Salmon & Quinoa', quantity: '200g salmon, 1 cup quinoa', calories: 700, image: imgFood.dinner }],
      Snacks: [{ name: 'Energy Balls', quantity: '3 date/nut balls', calories: 300, image: imgFood.snack }]
    };
  } else {
    // General Fitness
    return {
      Breakfast: [{ name: 'Oatmeal & Fruit', quantity: '1/2 cup oats, berries', calories: 350, image: imgFood.breakfast }],
      Lunch: [{ name: 'Tuna Sandwich', quantity: 'Whole wheat bread, 1 can tuna', calories: 450, image: imgFood.lunch }],
      Dinner: [{ name: 'Chicken Stir-fry', quantity: '150g chicken, mixed veggies', calories: 500, image: imgFood.dinner }],
      Snacks: [{ name: 'Apple & Peanut Butter', quantity: '1 apple, 1 tbsp PB', calories: 200, image: imgFood.snack }]
    };
  }
};

const getExercisesForGoal = (goal, range) => {
  const imgCardio = 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&q=80';
  const imgLift = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80';
  const imgYoga = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80';
  
  if (goal === 'Bodybuilding') {
    return {
      Monday: [
        { name: 'Barbell Bench Press', sets: 5, reps: '8-10', rest: '90s', image: imgLift },
        { name: 'Incline Dumbbell Press', sets: 4, reps: '10-12', rest: '90s', image: imgLift },
        { name: 'Cable Crossovers', sets: 4, reps: '12-15', rest: '60s', image: imgLift },
        { name: 'Overhead Triceps Extension', sets: 4, reps: '12', rest: '60s', image: imgLift },
        { name: 'Tricep Pushdowns', sets: 4, reps: '15', rest: '60s', image: imgLift },
        { name: 'Push-ups to Failure', sets: 3, reps: 'Failure', rest: '60s', image: imgLift }
      ],
      Tuesday: [
        { name: 'Barbell Squats', sets: 5, reps: '8-10', rest: '120s', image: imgLift },
        { name: 'Leg Press', sets: 4, reps: '10-12', rest: '90s', image: imgLift },
        { name: 'Walking Lunges', sets: 4, reps: '20', rest: '60s', image: imgLift },
        { name: 'Leg Extensions', sets: 4, reps: '15', rest: '60s', image: imgLift },
        { name: 'Lying Leg Curls', sets: 4, reps: '12', rest: '60s', image: imgLift },
        { name: 'Standing Calf Raises', sets: 5, reps: '20', rest: '60s', image: imgLift }
      ],
      Wednesday: [
        { name: 'Deadlifts', sets: 5, reps: '5-8', rest: '120s', image: imgLift },
        { name: 'Barbell Rows', sets: 4, reps: '8-10', rest: '90s', image: imgLift },
        { name: 'Lat Pulldowns', sets: 4, reps: '10-12', rest: '60s', image: imgLift },
        { name: 'Seated Cable Rows', sets: 4, reps: '12', rest: '60s', image: imgLift },
        { name: 'Barbell Bicep Curls', sets: 4, reps: '10', rest: '60s', image: imgLift },
        { name: 'Hammer Curls', sets: 4, reps: '12', rest: '60s', image: imgLift }
      ],
      Thursday: [
        { name: 'Overhead Shoulder Press', sets: 5, reps: '8-10', rest: '90s', image: imgLift },
        { name: 'Lateral Raises', sets: 5, reps: '15', rest: '60s', image: imgLift },
        { name: 'Front Dumbbell Raises', sets: 4, reps: '12', rest: '60s', image: imgLift },
        { name: 'Face Pulls', sets: 4, reps: '15', rest: '60s', image: imgLift },
        { name: 'Shrugs', sets: 4, reps: '15', rest: '60s', image: imgLift },
        { name: 'Cable Crunches', sets: 4, reps: '20', rest: '60s', image: imgLift }
      ],
      Friday: [
        { name: 'Incline Bench Press', sets: 4, reps: '8-10', rest: '90s', image: imgLift },
        { name: 'Dumbbell Flyes', sets: 4, reps: '12', rest: '60s', image: imgLift },
        { name: 'Close-Grip Bench Press', sets: 4, reps: '10', rest: '90s', image: imgLift },
        { name: 'Skull Crushers', sets: 4, reps: '12', rest: '60s', image: imgLift },
        { name: 'Hanging Leg Raises', sets: 4, reps: '15', rest: '60s', image: imgLift },
        { name: 'Plank', sets: 3, reps: '60s', rest: '60s', image: imgLift }
      ],
      Saturday: [
        { name: 'Romanian Deadlifts', sets: 4, reps: '8-10', rest: '90s', image: imgLift },
        { name: 'Bulgarian Split Squats', sets: 4, reps: '10', rest: '90s', image: imgLift },
        { name: 'Leg Press Calf Raises', sets: 4, reps: '15', rest: '60s', image: imgLift },
        { name: 'Preacher Curls', sets: 4, reps: '12', rest: '60s', image: imgLift },
        { name: 'Concentration Curls', sets: 4, reps: '12', rest: '60s', image: imgLift },
        { name: 'Reverse Curls', sets: 3, reps: '15', rest: '60s', image: imgLift }
      ],
      Sunday: [{ name: 'Rest', sets: 0, reps: '0', rest: '0', image: imgYoga }]
    };
  } else if (goal === 'Fat Loss') {
    return {
      Monday: [
        { name: 'HIIT Treadmill Sprints', sets: 10, reps: '30s sprint', rest: '30s', image: imgCardio },
        { name: 'Jump Squats', sets: 4, reps: '20', rest: '60s', image: imgCardio },
        { name: 'Mountain Climbers', sets: 4, reps: '60s', rest: '45s', image: imgCardio },
        { name: 'Burpees', sets: 4, reps: '15', rest: '60s', image: imgCardio },
        { name: 'Kettlebell Swings', sets: 4, reps: '20', rest: '45s', image: imgLift },
        { name: 'Box Jumps', sets: 4, reps: '15', rest: '60s', image: imgCardio }
      ],
      Tuesday: [
        { name: 'Rowing Machine Intervals', sets: 8, reps: '1 min fast', rest: '1 min slow', image: imgCardio },
        { name: 'Dumbbell Thrusters', sets: 4, reps: '15', rest: '60s', image: imgLift },
        { name: 'Renegade Rows', sets: 4, reps: '12', rest: '60s', image: imgLift },
        { name: 'Push-ups', sets: 4, reps: '20', rest: '60s', image: imgLift },
        { name: 'Plank Jacks', sets: 4, reps: '45s', rest: '45s', image: imgCardio },
        { name: 'Russian Twists', sets: 4, reps: '30', rest: '45s', image: imgCardio }
      ],
      Wednesday: [
        { name: 'Steady State Cycling', sets: 1, reps: '45 mins', rest: '0s', image: imgCardio },
        { name: 'Walking Lunges', sets: 4, reps: '24', rest: '60s', image: imgLift },
        { name: 'Goblet Squats', sets: 4, reps: '15', rest: '60s', image: imgLift },
        { name: 'Step-ups', sets: 4, reps: '20', rest: '60s', image: imgLift },
        { name: 'Bicycle Crunches', sets: 4, reps: '40', rest: '45s', image: imgCardio }
      ],
      Thursday: [
        { name: 'Jump Rope', sets: 10, reps: '2 mins', rest: '30s', image: imgCardio },
        { name: 'Battle Ropes', sets: 6, reps: '45s', rest: '45s', image: imgCardio },
        { name: 'Medicine Ball Slams', sets: 4, reps: '20', rest: '60s', image: imgLift },
        { name: 'High Knees', sets: 4, reps: '60s', rest: '45s', image: imgCardio },
        { name: 'Jumping Jacks', sets: 4, reps: '60s', rest: '30s', image: imgCardio },
        { name: 'V-Ups', sets: 4, reps: '15', rest: '45s', image: imgCardio }
      ],
      Friday: [
        { name: 'Stairmaster', sets: 1, reps: '30 mins', rest: '0s', image: imgCardio },
        { name: 'Dumbbell Snatch', sets: 4, reps: '10 each arm', rest: '60s', image: imgLift },
        { name: 'Push Press', sets: 4, reps: '12', rest: '60s', image: imgLift },
        { name: 'Lateral Bounds', sets: 4, reps: '20', rest: '45s', image: imgCardio },
        { name: 'Leg Raises', sets: 4, reps: '20', rest: '45s', image: imgCardio }
      ],
      Saturday: [
        { name: 'Active Recovery Walk or Light Jog', sets: 1, reps: '60 mins', rest: '0s', image: imgCardio },
        { name: 'Light Stretching', sets: 1, reps: '15 mins', rest: '0s', image: imgYoga }
      ],
      Sunday: [{ name: 'Rest', sets: 0, reps: '0', rest: '0', image: imgYoga }]
    };
  } else if (goal === 'Strength Training') {
    return {
      Monday: [
        { name: 'Heavy Squats', sets: 5, reps: '5', rest: '180s', image: imgLift },
        { name: 'Pause Squats', sets: 3, reps: '5', rest: '120s', image: imgLift },
        { name: 'Romanian Deadlifts', sets: 4, reps: '8', rest: '120s', image: imgLift },
        { name: 'Leg Press', sets: 4, reps: '10', rest: '90s', image: imgLift },
        { name: 'Weighted Planks', sets: 4, reps: '60s', rest: '60s', image: imgLift }
      ],
      Tuesday: [
        { name: 'Heavy Bench Press', sets: 5, reps: '5', rest: '180s', image: imgLift },
        { name: 'Close-Grip Bench Press', sets: 4, reps: '6-8', rest: '120s', image: imgLift },
        { name: 'Incline Dumbbell Press', sets: 4, reps: '8', rest: '90s', image: imgLift },
        { name: 'Pendlay Rows', sets: 4, reps: '8', rest: '120s', image: imgLift },
        { name: 'Pull-ups', sets: 4, reps: 'Failure', rest: '90s', image: imgLift }
      ],
      Wednesday: [
        { name: 'Overhead Press', sets: 5, reps: '5', rest: '180s', image: imgLift },
        { name: 'Push Press', sets: 3, reps: '6', rest: '120s', image: imgLift },
        { name: 'Seated Dumbbell Press', sets: 4, reps: '8', rest: '90s', image: imgLift },
        { name: 'Lateral Raises', sets: 4, reps: '12', rest: '60s', image: imgLift },
        { name: 'Face Pulls', sets: 4, reps: '15', rest: '60s', image: imgLift }
      ],
      Thursday: [
        { name: 'Heavy Deadlifts', sets: 5, reps: '5', rest: '180s', image: imgLift },
        { name: 'Deficit Deadlifts', sets: 3, reps: '5', rest: '180s', image: imgLift },
        { name: 'Front Squats', sets: 4, reps: '6-8', rest: '120s', image: imgLift },
        { name: 'Good Mornings', sets: 3, reps: '8', rest: '90s', image: imgLift },
        { name: 'Ab Wheel Rollouts', sets: 4, reps: '15', rest: '60s', image: imgLift }
      ],
      Friday: [
        { name: 'Spoto Press (Paused Bench)', sets: 4, reps: '5', rest: '120s', image: imgLift },
        { name: 'Barbell Rows', sets: 5, reps: '5', rest: '120s', image: imgLift },
        { name: 'Weighted Dips', sets: 4, reps: '8-10', rest: '90s', image: imgLift },
        { name: 'Barbell Curls', sets: 4, reps: '8', rest: '90s', image: imgLift },
        { name: 'Farmer Walks', sets: 4, reps: '60s', rest: '90s', image: imgLift }
      ],
      Saturday: [
        { name: 'Speed Squats (Dynamic Effort)', sets: 8, reps: '3', rest: '60s', image: imgLift },
        { name: 'Speed Bench Press (Dynamic Effort)', sets: 8, reps: '3', rest: '60s', image: imgLift },
        { name: 'Box Jumps', sets: 5, reps: '5', rest: '60s', image: imgCardio },
        { name: 'Medicine Ball Throws', sets: 5, reps: '10', rest: '60s', image: imgLift },
        { name: 'Sled Pushes', sets: 5, reps: '30s', rest: '90s', image: imgCardio }
      ],
      Sunday: [{ name: 'Rest', sets: 0, reps: '0', rest: '0', image: imgYoga }]
    };
  } else if (goal === 'Yoga') {
    return {
      Monday: [
        { name: 'Sun Salutations (Surya Namaskar)', sets: 10, reps: '1 round', rest: '0s', image: imgYoga },
        { name: 'Standing Poses Flow', sets: 1, reps: '20 mins', rest: '0s', image: imgYoga },
        { name: 'Warrior Sequence (I, II, III)', sets: 3, reps: '60s hold each side', rest: '30s', image: imgYoga },
        { name: 'Balance Poses (Tree, Eagle)', sets: 2, reps: '60s hold each side', rest: '30s', image: imgYoga },
        { name: 'Seated Forward Folds', sets: 3, reps: '90s hold', rest: '30s', image: imgYoga },
        { name: 'Savasana', sets: 1, reps: '10 mins', rest: '0s', image: imgYoga }
      ],
      Tuesday: [
        { name: 'Pranayama Breathing', sets: 1, reps: '10 mins', rest: '0s', image: imgYoga },
        { name: 'Hatha Core Flow', sets: 1, reps: '20 mins', rest: '0s', image: imgYoga },
        { name: 'Plank & Chaturanga Holds', sets: 5, reps: '60s', rest: '30s', image: imgYoga },
        { name: 'Boat Pose (Navasana)', sets: 4, reps: '60s hold', rest: '30s', image: imgYoga },
        { name: 'Backbends (Bridge, Bow)', sets: 4, reps: '60s hold', rest: '30s', image: imgYoga },
        { name: 'Savasana', sets: 1, reps: '10 mins', rest: '0s', image: imgYoga }
      ],
      Wednesday: [
        { name: 'Restorative Yin Yoga', sets: 1, reps: '60 mins', rest: '0s', image: imgYoga }
      ],
      Thursday: [
        { name: 'Ashtanga Primary Series (First Half)', sets: 1, reps: '40 mins', rest: '0s', image: imgYoga },
        { name: 'Inversion Practice (Headstand Prep)', sets: 1, reps: '10 mins', rest: '0s', image: imgYoga },
        { name: 'Hip Openers (Pigeon Pose)', sets: 2, reps: '3 mins each side', rest: '0s', image: imgYoga },
        { name: 'Savasana', sets: 1, reps: '5 mins', rest: '0s', image: imgYoga }
      ],
      Friday: [
        { name: 'Power Vinyasa Flow', sets: 1, reps: '45 mins', rest: '0s', image: imgYoga },
        { name: 'Arm Balances (Crow Pose)', sets: 3, reps: '30s hold', rest: '60s', image: imgYoga },
        { name: 'Deep Twists', sets: 3, reps: '60s hold each side', rest: '30s', image: imgYoga },
        { name: 'Savasana', sets: 1, reps: '10 mins', rest: '0s', image: imgYoga }
      ],
      Saturday: [
        { name: 'Slow Morning Stretch', sets: 1, reps: '20 mins', rest: '0s', image: imgYoga },
        { name: 'Meditation & Mindfulness', sets: 1, reps: '30 mins', rest: '0s', image: imgYoga },
        { name: 'Gentle Yoga', sets: 1, reps: '20 mins', rest: '0s', image: imgYoga }
      ],
      Sunday: [{ name: 'Rest', sets: 0, reps: '0', rest: '0', image: imgYoga }]
    };
  } else if (goal === 'Crossfit') {
    return {
      Monday: [
        { name: 'Warmup: Rowing', sets: 1, reps: '5 mins', rest: '0s', image: imgCardio },
        { name: 'Strength: Back Squat', sets: 5, reps: '5', rest: '120s', image: imgLift },
        { name: 'WOD: Fran (Thrusters & Pull-ups)', sets: 1, reps: '21-15-9', rest: 'For Time', image: imgLift },
        { name: 'Accessory: GHD Sit-ups', sets: 4, reps: '15', rest: '60s', image: imgLift },
        { name: 'Cooldown: Stretching', sets: 1, reps: '10 mins', rest: '0s', image: imgYoga }
      ],
      Tuesday: [
        { name: 'Warmup: Jump Rope', sets: 1, reps: '5 mins', rest: '0s', image: imgCardio },
        { name: 'Strength: Strict Press', sets: 5, reps: '5', rest: '120s', image: imgLift },
        { name: 'WOD: Cindy (AMRAP Pullups, Pushups, Squats)', sets: 1, reps: '20 mins', rest: '0', image: imgLift },
        { name: 'Accessory: Dumbbell Rows', sets: 4, reps: '12', rest: '60s', image: imgLift },
        { name: 'Cooldown: Stretching', sets: 1, reps: '10 mins', rest: '0s', image: imgYoga }
      ],
      Wednesday: [
        { name: 'Warmup: Assault Bike', sets: 1, reps: '5 mins', rest: '0s', image: imgCardio },
        { name: 'Olympic Lift: Snatch Technique', sets: 6, reps: '3', rest: '90s', image: imgLift },
        { name: 'WOD: Helen (Run, Swings, Pullups)', sets: 3, reps: 'Rounds for time', rest: '0s', image: imgCardio },
        { name: 'Core: Plank Holds', sets: 4, reps: '60s', rest: '45s', image: imgLift },
        { name: 'Cooldown: Foam Rolling', sets: 1, reps: '10 mins', rest: '0s', image: imgYoga }
      ],
      Thursday: [
        { name: 'Warmup: Light Jog', sets: 1, reps: '5 mins', rest: '0s', image: imgCardio },
        { name: 'Strength: Deadlift', sets: 5, reps: '5', rest: '120s', image: imgLift },
        { name: 'WOD: Grace (Clean & Jerk)', sets: 1, reps: '30 reps for time', rest: '0', image: imgLift },
        { name: 'Accessory: Box Jumps', sets: 4, reps: '15', rest: '60s', image: imgCardio },
        { name: 'Cooldown: Stretching', sets: 1, reps: '10 mins', rest: '0s', image: imgYoga }
      ],
      Friday: [
        { name: 'Warmup: Rowing', sets: 1, reps: '5 mins', rest: '0s', image: imgCardio },
        { name: 'Strength: Front Squat', sets: 5, reps: '5', rest: '120s', image: imgLift },
        { name: 'WOD: Murph (Run, Pullups, Pushups, Squats)', sets: 1, reps: 'For Time (40-60m)', rest: '0', image: imgLift },
        { name: 'Cooldown: Stretching', sets: 1, reps: '10 mins', rest: '0s', image: imgYoga }
      ],
      Saturday: [
        { name: 'Team Partner WOD', sets: 1, reps: '40 mins AMRAP', rest: '0s', image: imgLift },
        { name: 'Skill Work: Handstand Walks', sets: 1, reps: '15 mins', rest: '0s', image: imgLift },
        { name: 'Cooldown: Stretching', sets: 1, reps: '10 mins', rest: '0s', image: imgYoga }
      ],
      Sunday: [{ name: 'Rest', sets: 0, reps: '0', rest: '0', image: imgYoga }]
    };
  } else {
    // General Fitness
    return {
      Monday: [
        { name: 'Warmup Jog', sets: 1, reps: '10 mins', rest: '0s', image: imgCardio },
        { name: 'Dumbbell Goblet Squats', sets: 4, reps: '15', rest: '60s', image: imgLift },
        { name: 'Push-ups', sets: 4, reps: '12-15', rest: '60s', image: imgLift },
        { name: 'Dumbbell Rows', sets: 4, reps: '12', rest: '60s', image: imgLift },
        { name: 'Plank', sets: 4, reps: '60s', rest: '45s', image: imgYoga },
        { name: 'Burpees', sets: 3, reps: '15', rest: '60s', image: imgCardio },
        { name: 'Cooldown Stretch', sets: 1, reps: '10 mins', rest: '0s', image: imgYoga }
      ],
      Tuesday: [
        { name: 'Steady State Cardio (Treadmill/Bike)', sets: 1, reps: '30 mins', rest: '0s', image: imgCardio },
        { name: 'Walking Lunges', sets: 4, reps: '20', rest: '60s', image: imgLift },
        { name: 'Dumbbell Shoulder Press', sets: 4, reps: '12', rest: '60s', image: imgLift },
        { name: 'Lat Pulldowns', sets: 4, reps: '15', rest: '60s', image: imgLift },
        { name: 'Russian Twists', sets: 4, reps: '30', rest: '45s', image: imgYoga },
        { name: 'Cooldown Stretch', sets: 1, reps: '10 mins', rest: '0s', image: imgYoga }
      ],
      Wednesday: [
        { name: 'Warmup: Jump Rope', sets: 1, reps: '10 mins', rest: '0s', image: imgCardio },
        { name: 'Romanian Deadlifts (Dumbbells)', sets: 4, reps: '12', rest: '60s', image: imgLift },
        { name: 'Dumbbell Bench Press', sets: 4, reps: '12', rest: '60s', image: imgLift },
        { name: 'Face Pulls', sets: 4, reps: '15', rest: '60s', image: imgLift },
        { name: 'Leg Raises', sets: 4, reps: '20', rest: '45s', image: imgYoga },
        { name: 'Kettlebell Swings', sets: 3, reps: '20', rest: '60s', image: imgLift },
        { name: 'Cooldown Stretch', sets: 1, reps: '10 mins', rest: '0s', image: imgYoga }
      ],
      Thursday: [
        { name: 'HIIT Cardio Intervals', sets: 1, reps: '25 mins', rest: '0s', image: imgCardio },
        { name: 'Step-ups', sets: 4, reps: '12 per leg', rest: '60s', image: imgLift },
        { name: 'Bicep Curls', sets: 3, reps: '15', rest: '60s', image: imgLift },
        { name: 'Tricep Dips', sets: 3, reps: '15', rest: '60s', image: imgLift },
        { name: 'Bicycle Crunches', sets: 4, reps: '40', rest: '45s', image: imgYoga },
        { name: 'Cooldown Stretch', sets: 1, reps: '10 mins', rest: '0s', image: imgYoga }
      ],
      Friday: [
        { name: 'Warmup Jog', sets: 1, reps: '10 mins', rest: '0s', image: imgCardio },
        { name: 'Leg Press', sets: 4, reps: '15', rest: '60s', image: imgLift },
        { name: 'Incline Dumbbell Press', sets: 4, reps: '12', rest: '60s', image: imgLift },
        { name: 'Seated Cable Rows', sets: 4, reps: '15', rest: '60s', image: imgLift },
        { name: 'Mountain Climbers', sets: 4, reps: '60s', rest: '45s', image: imgCardio },
        { name: 'Box Jumps', sets: 3, reps: '15', rest: '60s', image: imgCardio },
        { name: 'Cooldown Stretch', sets: 1, reps: '10 mins', rest: '0s', image: imgYoga }
      ],
      Saturday: [
        { name: 'Long Steady Cardio (Run, Bike, Swim)', sets: 1, reps: '45 mins', rest: '0s', image: imgCardio },
        { name: 'Core Circuit (Planks, Crunches)', sets: 1, reps: '15 mins', rest: '0s', image: imgYoga }
      ],
      Sunday: [{ name: 'Rest', sets: 0, reps: '0', rest: '0', image: imgYoga }]
    };
  }
};

const seed = async () => {
  try {
    await connectDB();

    console.log('Clearing old templates...');
    await WorkoutTemplate.deleteMany();
    await DietTemplate.deleteMany();

    const goals = ['Bodybuilding', 'Fat Loss', 'Strength Training', 'Yoga', 'Crossfit', 'General Fitness'];

    console.log('Generating UNIQUE Workout & Diet Templates for all goals...');

    for (let goal of goals) {
      for (let range of weightRanges) {
        // Customize calories based on goal
        let goalCals = range.baseCals;
        let proteinRatio = 0.3;
        let carbsRatio = 0.4;
        let fatRatio = 0.3;

        if (goal === 'Bodybuilding' || goal === 'Strength Training' || goal === 'Crossfit') {
          goalCals += (range.min >= 100 ? 500 : 300);
          proteinRatio = 0.35;
          carbsRatio = 0.45;
          fatRatio = 0.2;
        } else if (goal === 'Fat Loss') {
          goalCals -= 300;
          proteinRatio = 0.4; // high protein to preserve muscle
          carbsRatio = 0.3;
          fatRatio = 0.3;
        } else if (goal === 'Yoga') {
          carbsRatio = 0.5; // more carbs for sustained energy
          proteinRatio = 0.2;
        }

        // 1. Workout Template
        await WorkoutTemplate.create({
          name: `${goal} Protocol: ${range.min}-${range.max} kg`,
          goal: goal,
          bmiRange: { min: range.min / 2.89, max: range.max / 2.89 },
          weightRange: { min: range.min, max: range.max },
          experienceLevel: 'Beginner',
          workoutLocation: 'Gym',
          equipmentRequired: ['Dumbbells', 'Cardio Machine', 'Mat'],
          exercises: getExercisesForGoal(goal, range)
        });

        // 2. Diet Template
        await DietTemplate.create({
          name: `${goal} Diet: ${range.min}-${range.max} kg`,
          goal: goal,
          foodPreference: goal === 'Yoga' ? 'Vegetarian' : 'Non Vegetarian',
          caloriesRange: { min: goalCals - 100, max: goalCals + 100 },
          weightRange: { min: range.min, max: range.max },
          meals: getDietForGoal(goal, range),
          macros: {
            protein: Math.round((goalCals * proteinRatio) / 4),
            carbs: Math.round((goalCals * carbsRatio) / 4),
            fat: Math.round((goalCals * fatRatio) / 9)
          }
        });
      }
    }

    console.log(`✅ Successfully seeded ${goals.length * weightRanges.length * 2} UNIQUE Templates!`);
    process.exit();
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seed();
