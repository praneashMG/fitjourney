import mongoose from 'mongoose';

const clientDietPlanSchema = new mongoose.Schema(
  {
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    coachId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'DietTemplate' },
    
    // Editable copy of the diet meals for this specific client per day
    meals: {
      Monday: {
        Breakfast: [{ name: String, quantity: String, calories: Number, image: String, consumed: { type: Boolean, default: false } }],
        Lunch: [{ name: String, quantity: String, calories: Number, image: String, consumed: { type: Boolean, default: false } }],
        Dinner: [{ name: String, quantity: String, calories: Number, image: String, consumed: { type: Boolean, default: false } }],
        Snacks: [{ name: String, quantity: String, calories: Number, image: String, consumed: { type: Boolean, default: false } }]
      },
      Tuesday: {
        Breakfast: [{ name: String, quantity: String, calories: Number, image: String, consumed: { type: Boolean, default: false } }],
        Lunch: [{ name: String, quantity: String, calories: Number, image: String, consumed: { type: Boolean, default: false } }],
        Dinner: [{ name: String, quantity: String, calories: Number, image: String, consumed: { type: Boolean, default: false } }],
        Snacks: [{ name: String, quantity: String, calories: Number, image: String, consumed: { type: Boolean, default: false } }]
      },
      Wednesday: {
        Breakfast: [{ name: String, quantity: String, calories: Number, image: String, consumed: { type: Boolean, default: false } }],
        Lunch: [{ name: String, quantity: String, calories: Number, image: String, consumed: { type: Boolean, default: false } }],
        Dinner: [{ name: String, quantity: String, calories: Number, image: String, consumed: { type: Boolean, default: false } }],
        Snacks: [{ name: String, quantity: String, calories: Number, image: String, consumed: { type: Boolean, default: false } }]
      },
      Thursday: {
        Breakfast: [{ name: String, quantity: String, calories: Number, image: String, consumed: { type: Boolean, default: false } }],
        Lunch: [{ name: String, quantity: String, calories: Number, image: String, consumed: { type: Boolean, default: false } }],
        Dinner: [{ name: String, quantity: String, calories: Number, image: String, consumed: { type: Boolean, default: false } }],
        Snacks: [{ name: String, quantity: String, calories: Number, image: String, consumed: { type: Boolean, default: false } }]
      },
      Friday: {
        Breakfast: [{ name: String, quantity: String, calories: Number, image: String, consumed: { type: Boolean, default: false } }],
        Lunch: [{ name: String, quantity: String, calories: Number, image: String, consumed: { type: Boolean, default: false } }],
        Dinner: [{ name: String, quantity: String, calories: Number, image: String, consumed: { type: Boolean, default: false } }],
        Snacks: [{ name: String, quantity: String, calories: Number, image: String, consumed: { type: Boolean, default: false } }]
      },
      Saturday: {
        Breakfast: [{ name: String, quantity: String, calories: Number, image: String, consumed: { type: Boolean, default: false } }],
        Lunch: [{ name: String, quantity: String, calories: Number, image: String, consumed: { type: Boolean, default: false } }],
        Dinner: [{ name: String, quantity: String, calories: Number, image: String, consumed: { type: Boolean, default: false } }],
        Snacks: [{ name: String, quantity: String, calories: Number, image: String, consumed: { type: Boolean, default: false } }]
      },
      Sunday: {
        Breakfast: [{ name: String, quantity: String, calories: Number, image: String, consumed: { type: Boolean, default: false } }],
        Lunch: [{ name: String, quantity: String, calories: Number, image: String, consumed: { type: Boolean, default: false } }],
        Dinner: [{ name: String, quantity: String, calories: Number, image: String, consumed: { type: Boolean, default: false } }],
        Snacks: [{ name: String, quantity: String, calories: Number, image: String, consumed: { type: Boolean, default: false } }]
      }
    },
    
    dailyCaloriesTarget: { type: Number },
    macros: {
      protein: { type: Number }, 
      carbs: { type: Number },
      fat: { type: Number }
    },
    
    progress: { type: Number, default: 0 },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    coachNotes: { type: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const ClientDietPlan = mongoose.model('ClientDietPlan', clientDietPlanSchema);
export default ClientDietPlan;
