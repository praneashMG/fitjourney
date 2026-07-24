import mongoose from 'mongoose';

const workoutTemplateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    goal: { 
      type: String, 
      enum: ['Weight Loss', 'Fat Loss', 'Muscle Gain', 'Bodybuilding', 'Strength Training', 'General Fitness', 'Yoga', 'Crossfit', 'Sports Performance', 'Increase Flexibility'],
      required: true 
    },
    bmiRange: {
      min: { type: Number, required: true },
      max: { type: Number, required: true }
    },
    weightRange: {
      min: { type: Number },
      max: { type: Number }
    },
    experienceLevel: { 
      type: String, 
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: true 
    },
    workoutLocation: { 
      type: String, 
      enum: ['Home', 'Gym', 'Hybrid'],
      required: true 
    },
    equipmentRequired: [{ type: String }],
    medicalRestrictions: [{ type: String }], // Optional conditions this template is NOT suitable for
    
    // Structured exercises by day
    exercises: {
      Monday: [{ name: String, sets: Number, reps: String, rest: String, notes: String, image: String }],
      Tuesday: [{ name: String, sets: Number, reps: String, rest: String, notes: String, image: String }],
      Wednesday: [{ name: String, sets: Number, reps: String, rest: String, notes: String, image: String }],
      Thursday: [{ name: String, sets: Number, reps: String, rest: String, notes: String, image: String }],
      Friday: [{ name: String, sets: Number, reps: String, rest: String, notes: String, image: String }],
      Saturday: [{ name: String, sets: Number, reps: String, rest: String, notes: String, image: String }],
      Sunday: [{ name: String, sets: Number, reps: String, rest: String, notes: String, image: String }]
    }
  },
  { timestamps: true }
);

const WorkoutTemplate = mongoose.model('WorkoutTemplate', workoutTemplateSchema);
export default WorkoutTemplate;
