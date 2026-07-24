import ClientAssessment from '../models/ClientAssessment.js';
import ClientWorkoutPlan from '../models/ClientWorkoutPlan.js';
import ClientDietPlan from '../models/ClientDietPlan.js';
import CoachAssignment from '../models/CoachAssignment.js';
import bmiService from './bmi.service.js';
import calorieService from './calorie.service.js';
import workoutRecService from './workoutRecommendation.service.js';
import dietRecService from './dietRecommendation.service.js';
import coachRecService from './coachRecommendation.service.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

/**
 * Main orchestrator for processing a new client assessment
 * @param {string} userId - The ID of the client submitting the assessment
 * @param {Object} rawData - The raw form data from the 10 sections
 * @returns {Object} Result of the processing
 */
export const processAssessment = async (userId, rawData) => {
  try {
    // 1. Save Raw Assessment Data
    const assessment = new ClientAssessment({
      userId,
      ...rawData
    });
    await assessment.save();

    // 2. BMI Calculations
    const bmi = bmiService.calculateBMI(rawData.currentWeight, rawData.height);
    const idealWeightRange = bmiService.calculateIdealWeightRange(rawData.height);
    const weightDiff = bmiService.calculateWeightDifference(rawData.currentWeight, rawData.targetWeight);

    // 3. Calorie & Macro Calculations
    const dailyCalories = calorieService.calculateDailyCalories(
      rawData.currentWeight,
      rawData.height,
      rawData.age,
      rawData.gender,
      rawData.activityLevel || 'Lightly Active', // Fallback
      rawData.goal
    );
    const proteinRequirement = calorieService.calculateProteinRequirement(rawData.currentWeight, rawData.goal);
    const waterRequirement = calorieService.calculateWaterRequirement(rawData.currentWeight);

    // 4. Recommendation Engines
    const workoutTemplate = await workoutRecService.recommendWorkout(rawData, bmi);
    const dietTemplate = await dietRecService.recommendDiet(rawData, dailyCalories);
    const recommendedCoaches = await coachRecService.recommendCoaches(rawData);
    
    // Create notifications for all matched coaches
    if (recommendedCoaches && recommendedCoaches.length > 0) {
      const clientUser = await User.findById(userId);
      const notifications = recommendedCoaches.map(coach => ({
        recipient: coach._id,
        title: 'New Client Match!',
        message: `${clientUser?.fullName || 'A new client'} is looking for a coach specializing in ${rawData.goal}. Check them out!`,
        type: 'NEW_LEAD'
      }));
      await Notification.insertMany(notifications);
    }

    const assignedCoach = recommendedCoaches.length > 0 ? recommendedCoaches[0]._id : null;

    // 5. Create Personalized Workout Plan (Clone Template)
    let workoutPlan = null;
    if (workoutTemplate) {
      workoutPlan = new ClientWorkoutPlan({
        clientId: userId,
        coachId: assignedCoach,
        templateId: workoutTemplate._id,
        exercises: workoutTemplate.exercises // Copy exercises directly
      });
      await workoutPlan.save();
    }

    // 6. Create Personalized Diet Plan (Clone Template)
    let dietPlan = null;
    if (dietTemplate) {
      dietPlan = new ClientDietPlan({
        clientId: userId,
        coachId: assignedCoach,
        templateId: dietTemplate._id,
        meals: dietTemplate.meals,
        dailyCaloriesTarget: dailyCalories,
        macros: {
          protein: proteinRequirement,
          carbs: Math.round((dailyCalories * 0.5) / 4), // 50% carbs
          fat: Math.round((dailyCalories * 0.2) / 9) // 20% fats (rough estimate)
        }
      });
      await dietPlan.save();
    }

    // 7. Create Coach Assignment
    if (assignedCoach) {
      const assignment = new CoachAssignment({
        clientId: userId,
        coachId: assignedCoach,
        status: 'Active'
      });
      await assignment.save();
      
      // Update User to point to the assigned coach
      await User.findByIdAndUpdate(userId, { assignedCoach: assignedCoach, coachAssignedDate: new Date() });
    }

    // 8. Update User Profile with calculated stats
    await User.findByIdAndUpdate(userId, {
      fullName: rawData.fullName,
      phone: rawData.phone,
      height: rawData.height,
      currentWeight: rawData.currentWeight,
      targetWeight: rawData.targetWeight,
      bmi: bmi,
      fitnessGoal: rawData.goal,
      activityLevel: rawData.activityLevel,
      workoutPreference: rawData.workoutLocation,
      foodPreference: rawData.foodPreference,
      medicalConditions: (rawData.medicalConditions || []).join(', '),
      dateOfBirth: rawData.dateOfBirth,
      gender: rawData.gender
    });

    return {
      success: true,
      message: 'Assessment processed successfully',
      data: {
        stats: { bmi, idealWeightRange, weightDiff, dailyCalories, proteinRequirement, waterRequirement },
        workoutPlanId: workoutPlan ? workoutPlan._id : null,
        dietPlanId: dietPlan ? dietPlan._id : null,
        assignedCoachId: assignedCoach, user: await User.findById(userId)
      }
    };
  } catch (error) {
    console.error('Error processing assessment:', error);
    throw new Error('Failed to process assessment: ' + error.message);
  }
};

export default { processAssessment };
