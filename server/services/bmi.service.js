// bmi.service.js

/**
 * Calculates Body Mass Index (BMI)
 * @param {number} weight - Weight in kg
 * @param {number} height - Height in cm
 * @returns {number} BMI rounded to 1 decimal place
 */
export const calculateBMI = (weight, height) => {
  if (!weight || !height) return 0;
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  return parseFloat(bmi.toFixed(1));
};

/**
 * Calculates Ideal Weight Range based on a healthy BMI (18.5 - 24.9)
 * @param {number} height - Height in cm
 * @returns {Object} { minWeight: number, maxWeight: number }
 */
export const calculateIdealWeightRange = (height) => {
  if (!height) return { minWeight: 0, maxWeight: 0 };
  const heightInMeters = height / 100;
  const minWeight = 18.5 * (heightInMeters * heightInMeters);
  const maxWeight = 24.9 * (heightInMeters * heightInMeters);
  return {
    minWeight: parseFloat(minWeight.toFixed(1)),
    maxWeight: parseFloat(maxWeight.toFixed(1))
  };
};

/**
 * Calculates the difference between current weight and target weight
 * @param {number} currentWeight - in kg
 * @param {number} targetWeight - in kg
 * @returns {number} difference in kg (positive means need to lose, negative means need to gain)
 */
export const calculateWeightDifference = (currentWeight, targetWeight) => {
  if (!currentWeight || !targetWeight) return 0;
  return parseFloat((currentWeight - targetWeight).toFixed(1));
};

export default {
  calculateBMI,
  calculateIdealWeightRange,
  calculateWeightDifference
};
