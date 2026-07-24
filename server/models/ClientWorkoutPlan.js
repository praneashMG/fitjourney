import mongoose from 'mongoose';

const clientWorkoutPlanSchema = new mongoose.Schema(
  {
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    coachId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkoutTemplate' },
    
    // Editable copy of the exercises for this specific client
    exercises: {
      Monday: [{ name: String, sets: Number, reps: String, rest: String, notes: String, image: String, completed: { type: Boolean, default: false } }],
      Tuesday: [{ name: String, sets: Number, reps: String, rest: String, notes: String, image: String, completed: { type: Boolean, default: false } }],
      Wednesday: [{ name: String, sets: Number, reps: String, rest: String, notes: String, image: String, completed: { type: Boolean, default: false } }],
      Thursday: [{ name: String, sets: Number, reps: String, rest: String, notes: String, image: String, completed: { type: Boolean, default: false } }],
      Friday: [{ name: String, sets: Number, reps: String, rest: String, notes: String, image: String, completed: { type: Boolean, default: false } }],
      Saturday: [{ name: String, sets: Number, reps: String, rest: String, notes: String, image: String, completed: { type: Boolean, default: false } }],
      Sunday: [{ name: String, sets: Number, reps: String, rest: String, notes: String, image: String, completed: { type: Boolean, default: false } }]
    },
    
    progress: { type: Number, default: 0 },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    coachNotes: { type: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const ClientWorkoutPlan = mongoose.model('ClientWorkoutPlan', clientWorkoutPlanSchema);
export default ClientWorkoutPlan;
