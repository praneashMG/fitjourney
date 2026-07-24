import mongoose from 'mongoose';

const weightLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    weight: { type: Number, required: true },
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const WeightLog = mongoose.model('WeightLog', weightLogSchema);
export default WeightLog;
