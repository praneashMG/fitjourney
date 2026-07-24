import mongoose from 'mongoose';

const dietTemplateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    goal: { 
      type: String, 
      enum: ['Weight Loss', 'Fat Loss', 'Muscle Gain', 'Bodybuilding', 'Strength Training', 'General Fitness', 'Yoga', 'Crossfit', 'Sports Performance', 'Increase Flexibility'],
      required: true 
    },
    foodPreference: { 
      type: String,
      enum: ['Vegetarian', 'Eggetarian', 'Non Vegetarian', 'Vegan'],
      required: true
    },
    caloriesRange: {
      min: { type: Number, required: true },
      max: { type: Number, required: true }
    },
    weightRange: {
      min: { type: Number },
      max: { type: Number }
    },
    medicalRestrictions: [{ type: String }],
    
    meals: {
      Monday: {
        Breakfast: [{ name: String, quantity: String, calories: Number, image: String }],
        Lunch: [{ name: String, quantity: String, calories: Number, image: String }],
        Dinner: [{ name: String, quantity: String, calories: Number, image: String }],
        Snacks: [{ name: String, quantity: String, calories: Number, image: String }]
      },
      Tuesday: {
        Breakfast: [{ name: String, quantity: String, calories: Number, image: String }],
        Lunch: [{ name: String, quantity: String, calories: Number, image: String }],
        Dinner: [{ name: String, quantity: String, calories: Number, image: String }],
        Snacks: [{ name: String, quantity: String, calories: Number, image: String }]
      },
      Wednesday: {
        Breakfast: [{ name: String, quantity: String, calories: Number, image: String }],
        Lunch: [{ name: String, quantity: String, calories: Number, image: String }],
        Dinner: [{ name: String, quantity: String, calories: Number, image: String }],
        Snacks: [{ name: String, quantity: String, calories: Number, image: String }]
      },
      Thursday: {
        Breakfast: [{ name: String, quantity: String, calories: Number, image: String }],
        Lunch: [{ name: String, quantity: String, calories: Number, image: String }],
        Dinner: [{ name: String, quantity: String, calories: Number, image: String }],
        Snacks: [{ name: String, quantity: String, calories: Number, image: String }]
      },
      Friday: {
        Breakfast: [{ name: String, quantity: String, calories: Number, image: String }],
        Lunch: [{ name: String, quantity: String, calories: Number, image: String }],
        Dinner: [{ name: String, quantity: String, calories: Number, image: String }],
        Snacks: [{ name: String, quantity: String, calories: Number, image: String }]
      },
      Saturday: {
        Breakfast: [{ name: String, quantity: String, calories: Number, image: String }],
        Lunch: [{ name: String, quantity: String, calories: Number, image: String }],
        Dinner: [{ name: String, quantity: String, calories: Number, image: String }],
        Snacks: [{ name: String, quantity: String, calories: Number, image: String }]
      },
      Sunday: {
        Breakfast: [{ name: String, quantity: String, calories: Number, image: String }],
        Lunch: [{ name: String, quantity: String, calories: Number, image: String }],
        Dinner: [{ name: String, quantity: String, calories: Number, image: String }],
        Snacks: [{ name: String, quantity: String, calories: Number, image: String }]
      }
    },
    
    macros: {
      protein: { type: Number }, // in grams
      carbs: { type: Number },
      fat: { type: Number }
    }
  },
  { timestamps: true }
);

const DietTemplate = mongoose.model('DietTemplate', dietTemplateSchema);
export default DietTemplate;
