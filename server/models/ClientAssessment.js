import mongoose from 'mongoose';

const clientAssessmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    // Section 1: Personal Details
    fullName: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    preferredLanguage: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },

    // Section 2: Body Measurements
    height: { type: Number, required: true }, // cm
    currentWeight: { type: Number, required: true }, // kg
    targetWeight: { type: Number, required: true }, // kg
    waist: { type: Number },
    chest: { type: Number },
    hip: { type: Number },
    bodyFatPercentage: { type: Number },

    // Section 3: Fitness Goal
    goal: { 
      type: String, 
      enum: ['Weight Loss', 'Fat Loss', 'Muscle Gain', 'Bodybuilding', 'Strength Training', 'General Fitness', 'Yoga', 'Crossfit', 'Sports Performance', 'Increase Flexibility'],
      required: true 
    },

    // Section 4: Fitness Experience
    experienceLevel: { 
      type: String, 
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: true 
    },

    // Section 5: Workout Preference
    workoutLocation: { 
      type: String, 
      enum: ['Home', 'Gym', 'Hybrid'],
      required: true 
    },
    workoutDuration: { type: String, required: true },
    workoutDays: [{ type: String }],
    preferredWorkoutTime: { 
      type: String,
      enum: ['Morning', 'Afternoon', 'Evening', 'Night']
    },

    // Section 6: Equipment Available
    equipmentAvailable: [{ type: String }],

    // Section 7: Medical Details
    medicalConditions: [{ type: String }],
    doctorRestrictions: { type: String },
    currentMedications: { type: String },

    // Section 8: Nutrition
    foodPreference: { 
      type: String,
      enum: ['Vegetarian', 'Eggetarian', 'Non Vegetarian', 'Vegan'],
      required: true
    },
    mealsPerDay: { type: Number },
    dailyWaterIntake: { type: Number }, // liters
    favoriteFoods: [{ type: String }],
    foodsToAvoid: [{ type: String }],

    // Section 9: Lifestyle
    occupation: { type: String },
    dailySittingHours: { type: Number },
    activityLevel: { type: String },
    stressLevel: { type: String },
    sleepHours: { type: Number },
    smoking: { type: Boolean },
    alcohol: { type: Boolean },

    // Section 10: Upload (URLs from Cloudinary)
    profilePhoto: { type: String },
    frontBodyImage: { type: String },
    sideBodyImage: { type: String },
    backBodyImage: { type: String }
  },
  { timestamps: true }
);

const ClientAssessment = mongoose.model('ClientAssessment', clientAssessmentSchema);
export default ClientAssessment;
