import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema(
  {
    coachId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    gender: { type: String },
    dateOfBirth: { type: Date },
    height: { type: Number, required: true }, // in cm
    weight: { type: Number, required: true }, // in kg
    goal: { 
      type: String, 
      enum: ['Lose Weight', 'Gain Weight', 'Build Muscle', 'Maintain Weight', 'General Fitness'],
      required: true
    },
    activityLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner'
    },
    medicalConditions: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    profileImage: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Completed'],
      default: 'Active'
    },
    joinedDate: { type: Date, default: Date.now },
    notes: { type: String }
  },
  { timestamps: true }
);

const Client = mongoose.model('Client', clientSchema);
export default Client;
