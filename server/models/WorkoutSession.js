import mongoose from 'mongoose';

const workoutSessionSchema = new mongoose.Schema(
  {
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    workoutPlanId: { type: mongoose.Schema.Types.ObjectId, ref: 'ClientWorkoutPlan' },
    status: { type: String, enum: ['active', 'completed'], default: 'active' },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    elapsedSeconds: { type: Number, default: 0 },
    timerStatus: { type: String, enum: ['running', 'paused', 'completed'], default: 'running' },
    lastTimerActionAt: { type: Date, default: Date.now },
    targetSeconds: { type: Number, default: 3600 },
    exercises: [
      {
        name: String,
        sets: Number,
        reps: String,
        completed: { type: Boolean, default: false }
      }
    ]
  },
  { timestamps: true }
);

const WorkoutSession = mongoose.model('WorkoutSession', workoutSessionSchema);
export default WorkoutSession;
