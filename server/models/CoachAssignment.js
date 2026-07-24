import mongoose from 'mongoose';

const coachAssignmentSchema = new mongoose.Schema(
  {
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    coachId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['Pending', 'Active', 'Completed', 'Cancelled'],
      default: 'Active'
    },
    assignedDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    notes: { type: String }
  },
  { timestamps: true }
);

const CoachAssignment = mongoose.model('CoachAssignment', coachAssignmentSchema);
export default CoachAssignment;
