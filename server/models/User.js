import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8 },
    phone: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Coach', 'Client'], required: true },
    specialization: { type: String, default: '' },
    profileImage: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    approvalStatus: { type: String, enum: ['Pending', 'Approved', 'Declined'], default: 'Approved' },
    
    // Fitness Profile Fields (Phase 2)
    height: { type: Number },
    currentWeight: { type: Number },
    targetWeight: { type: Number },
    bmi: { type: Number },
    fitnessGoal: { type: String, enum: ['Weight Loss', 'Fat Loss', 'Muscle Gain', 'Maintenance', 'General Fitness', 'Athletic Performance', 'Bodybuilding', 'Strength Training', 'Yoga', 'Crossfit'] },
    activityLevel: { type: String, enum: ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active', 'Super Active'] },
    workoutPreference: { type: String },
    foodPreference: { type: String },
    medicalConditions: { type: String },
    
    // Phase 3 Extensions (Sidebar Architecture)
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say'] },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      country: { type: String, default: '' }
    },
    emergencyContact: { type: String, default: '' },
    
    experienceLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
    allergies: { type: String, default: '' },
    injuries: { type: String, default: '' },
    
    assignedCoach: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    coachAssignedDate: { type: Date },
    
    subscription: {
      planType: { type: String, default: 'Free' },
      startDate: { type: Date },
      expiryDate: { type: Date },
      status: { type: String, enum: ['Active', 'Expired', 'Cancelled', 'None'], default: 'None' }
    },
    
    progressStats: {
      workoutCompletionRate: { type: Number, default: 0 },
      dietAdherenceRate: { type: Number, default: 0 },
      currentStreak: { type: Number, default: 0 },
      bestStreak: { type: Number, default: 0 },
      totalWorkouts: { type: Number, default: 0 }
    },
    
    lastLogin: { type: Date },
    
    coachStats: {
      rating: { type: Number, default: 4.9 },
      reviews: { type: Number, default: 120 },
      experienceYears: { type: Number, default: 5 },
      availability: { type: String, default: 'Available Today' }
    },
    
    preferences: {
      notifications: {
        workoutReminder: { type: Boolean, default: true },
        dietReminder: { type: Boolean, default: true },
        sessionReminder: { type: Boolean, default: true },
        coachMessages: { type: Boolean, default: true },
        emailNotifications: { type: Boolean, default: true },
        pushNotifications: { type: Boolean, default: true }
      },
      privacy: {
        shareProgressWithCoach: { type: Boolean, default: true },
        allowProgressPhotos: { type: Boolean, default: false }
      }
    }
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
