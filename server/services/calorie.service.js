// calorie.service.js

/**
 * Calculates Daily Calorie Requirement using the Mifflin-St Jeor Equation
 * @param {number} weight - in kg
 * @param {number} height - in cm
 * @param {number} age - in years
 * @param {string} gender - 'Male' or 'Female'
 * @param {string} activityLevel - 'Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active', 'Super Active'
 * @param {string} goal - The fitness goal to adjust calories
 * @returns {number} Daily Calories
 */
export const calculateDailyCalories = (weight, height, age, gender, activityLevel, goal) => {
  if (!weight || !height || !age || !gender) return 2000; // default fallback

  // Calculate Basal Metabolic Rate (BMR)
  let bmr = (10 * weight) + (6.25 * height) - (5 * age);
  if (gender.toLowerCase() === 'male') {
    bmr += 5;
  } else {
    bmr -= 161;
  }

  // Activity Multiplier
  let multiplier = 1.2; // Sedentary Default
  switch (activityLevel) {
    case 'Lightly Active': multiplier = 1.375; break;
    case 'Moderately Active': multiplier = 1.55; break;
    case 'Very Active': multiplier = 1.725; break;
    case 'Super Active': multiplier = 1.9; break;
  }

  let tdee = bmr * multiplier;

  // Adjust for Goal
  if (goal.includes('Loss')) {
    tdee -= 500; // 500 calorie deficit for weight loss
  } else if (goal.includes('Gain') || goal.includes('Bodybuilding')) {
    tdee += 500; // 500 calorie surplus for weight gain
  }

  return Math.round(tdee);
};

/**
 * Calculates Daily Protein Requirement (in grams)
 * @param {number} weight - in kg
 * @param {string} goal - The fitness goal
 * @returns {number} Protein in grams
 */
export const calculateProteinRequirement = (weight, goal) => {
  if (!weight) return 0;
  
  let multiplier = 1.2; // Default for general fitness
  
  if (goal.includes('Muscle Gain') || goal.includes('Bodybuilding') || goal.includes('Strength Training')) {
    multiplier = 2.0;
  } else if (goal.includes('Weight Loss') || goal.includes('Fat Loss')) {
    multiplier = 1.8;
  } else if (goal.includes('Sports Performance')) {
    multiplier = 1.6;
  }

  return Math.round(weight * multiplier);
};

/**
 * Calculates Daily Water Requirement (in liters)
 * @param {number} weight - in kg
 * @returns {number} Water in liters
 */
export const calculateWaterRequirement = (weight) => {
  if (!weight) return 2.5; // fallback
  // General rule: ~35ml per kg of body weight
  const liters = (weight * 35) / 1000;
  return parseFloat(liters.toFixed(1));
};

export default {
  calculateDailyCalories,
  calculateProteinRequirement,
  calculateWaterRequirement
};
