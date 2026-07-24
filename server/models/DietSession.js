import mongoose from 'mongoose';

const dietSessionSchema = new mongoose.Schema(
  {
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    dietPlanId: { type: mongoose.Schema.Types.ObjectId, ref: 'ClientDietPlan' },
    status: { type: String, enum: ['active', 'completed'], default: 'active' },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    meals: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  { timestamps: true }
);

const DietSession = mongoose.model('DietSession', dietSessionSchema);
export default DietSession;
