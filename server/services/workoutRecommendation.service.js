import WorkoutTemplate from '../models/WorkoutTemplate.js';

/**
 * Recommends the best matching Workout Template based on assessment data
 * @param {Object} assessmentData
 * @param {number} bmi
 * @returns {Object} The matched workout template, or a default one
 */
export const recommendWorkout = async (assessmentData, bmi) => {
  try {
    const { goal, experienceLevel, workoutLocation, currentWeight } = assessmentData;

    // Search for templates matching core criteria
    // In a real production system, this could use complex scoring or vector search
    // Here we use a query that matches exact or fallback parameters
    let templates = await WorkoutTemplate.find({
      goal: goal,
      experienceLevel: experienceLevel,
      workoutLocation: workoutLocation,
      'weightRange.min': { $lte: currentWeight },
      'weightRange.max': { $gt: currentWeight }
    });

    // If no exact match, loosen constraints (e.g., ignore BMI)
    if (templates.length === 0) {
      templates = await WorkoutTemplate.find({
        goal: goal,
        experienceLevel: experienceLevel
      });
    }

    // If still no match, fetch any template for that goal
    if (templates.length === 0) {
      templates = await WorkoutTemplate.find({ goal: goal });
    }

    // Fallback if absolutely no templates exist
    if (templates.length === 0) {
      return null;
    }

    // Return the first match (could randomize or score later)
    return templates[0];
  } catch (error) {
    console.error('Error recommending workout:', error);
    return null;
  }
};

export default { recommendWorkout };
