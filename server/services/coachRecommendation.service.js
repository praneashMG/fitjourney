import User from '../models/User.js';

/**
 * Recommends the best Coach based on assessment data
 * @param {Object} assessmentData
 * @returns {Array} Array of top 3 matching coaches
 */
export const recommendCoaches = async (assessmentData) => {
  try {
    const { goal } = assessmentData;

    // Find active, verified, approved coaches whose specialization matches the client's goal
    let coaches = await User.find({ 
      role: 'Coach', 
      isActive: true, 
      isVerified: true,
      approvalStatus: 'Approved',
      specialization: { $regex: new RegExp(`^${goal}$`, 'i') }
    });

    if (!coaches || coaches.length === 0) {
      console.log('No exact match found. Falling back to ANY approved coach for debugging.');
      coaches = await User.find({ role: 'Coach', approvalStatus: 'Approved' });
      if (!coaches || coaches.length === 0) {
        console.log('STILL NO COACHES FOUND! Ensure a Coach is approved.');
        return [];
      }
    }

    // For demonstration, return up to 3 coaches randomly or by simple score
    // In production, implement a scoring system based on matching fields
    return coaches.slice(0, 3);
  } catch (error) {
    console.error('Error recommending coaches:', error);
    return [];
  }
};

export default { recommendCoaches };
