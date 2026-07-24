import DietTemplate from '../models/DietTemplate.js';

/**
 * Recommends the best matching Diet Template based on assessment data
 * @param {Object} assessmentData
 * @param {number} targetCalories
 * @returns {Object} The matched diet template, or null
 */
export const recommendDiet = async (assessmentData, targetCalories) => {
  try {
    const { goal, foodPreference, currentWeight } = assessmentData;

    // Look for templates matching goal, preference, and fitting the calorie range
    let templates = await DietTemplate.find({
      goal: goal,
      foodPreference: foodPreference,
      'weightRange.min': { $lte: currentWeight },
      'weightRange.max': { $gt: currentWeight }
    });

    // Loosen constraints if no match
    if (templates.length === 0) {
      templates = await DietTemplate.find({
        goal: goal,
        foodPreference: foodPreference
      });
    }

    // Fallback
    if (templates.length === 0) {
      return null;
    }

    return templates[0];
  } catch (error) {
    console.error('Error recommending diet:', error);
    return null;
  }
};

export default { recommendDiet };
