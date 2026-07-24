import assessmentService from '../services/assessment.service.js';

/**
 * Handle the submission of a fitness assessment
 * @param {Object} req 
 * @param {Object} res 
 */
export const submitAssessment = async (req, res) => {
  try {
    // Assuming user ID is injected by auth middleware
    const userId = req.user.id; 
    
    // In production, validate req.body against schema (e.g., using express-validator)
    const rawData = req.body;

    const result = await assessmentService.processAssessment(userId, rawData);
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in submitAssessment controller:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
